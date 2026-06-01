import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Restrict CORS to known app origins to deter cross-site abuse of the OpenWeather quota.
const ALLOWED_ORIGINS = new Set<string>([
  "https://cloudconnectweather.lovable.app",
  "https://id-preview--b60a879d-637a-45dc-a32c-16f9ef225621.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
]);
const ALLOWED_ORIGIN_SUFFIXES = [".lovable.app", ".lovableproject.com"];

// Per-IP throttle. Best-effort, per-instance: blocks an IP that exceeds the
// per-minute ceiling. Not a substitute for proper rate-limit infra, but adds a
// guardrail against accidental loops or a single client hammering the function.
const IP_LIMIT_PER_MIN = 60;
const IP_WINDOW_MS = 60 * 1000;
type IpBucket = { count: number; windowStart: number };
const ipBuckets = new Map<string, IpBucket>();

function checkIpRate(ip: string | null): boolean {
  if (!ip) return true;
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > IP_WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= IP_LIMIT_PER_MIN;
}

// Lightweight async logger. Best-effort insert into request_logs; failures are swallowed
// so they never affect the user-facing response.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const logClient =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    : null;

function logRequest(entry: {
  path: string;
  method: string;
  status_code: number;
  user_agent: string | null;
  ip: string | null;
  cache_status: string | null;
  duration_ms: number;
  rate_limited: boolean;
}) {
  if (!logClient) return;
  // Fire-and-forget; do not await.
  logClient.from("request_logs").insert(entry).then(({ error }) => {
    if (error) console.error("request_logs insert failed:", error.message);
  });
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_ORIGIN_SUFFIXES.some((suffix) => host.endsWith(suffix));
  } catch {
    return false;
  }
}

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = isAllowedOrigin(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "null",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Vary": "Origin",
  };
}

// In-memory response cache. Each edge instance keeps its own copy; entries expire after CACHE_TTL_MS.
// This dramatically reduces upstream OpenWeather calls for repeated lookups (e.g. all visitors loading the homepage).
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ENTRIES = 500;
type CacheEntry = { body: string; expiresAt: number };
const cache = new Map<string, CacheEntry>();

function buildCacheKey(endpoint: string, params: Record<string, unknown> | undefined): string {
  if (!params) return endpoint;
  const sortedKeys = Object.keys(params).sort();
  const parts = sortedKeys.map((k) => `${k}=${String(params[k])}`);
  return `${endpoint}?${parts.join("&")}`;
}

function getCached(key: string): string | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.body;
}

function setCached(key: string, body: string): void {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    // Evict oldest entry (Map preserves insertion order).
    const oldestKey = cache.keys().next().value;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }
  cache.set(key, { body, expiresAt: Date.now() + CACHE_TTL_MS });
}

serve(async (req) => {
  const startedAt = Date.now();
  const origin = req.headers.get("Origin");
  const corsHeaders = buildCorsHeaders(origin);
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  const userAgent = req.headers.get("user-agent");
  const path = new URL(req.url).pathname;

  // Helper to attach logging to a Response without changing its body.
  const respond = (resp: Response, cacheStatus: string | null, rateLimited = false) => {
    logRequest({
      path,
      method: req.method,
      status_code: resp.status,
      user_agent: userAgent,
      ip,
      cache_status: cacheStatus,
      duration_ms: Date.now() - startedAt,
      rate_limited: rateLimited || resp.status === 429,
    });
    return resp;
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!isAllowedOrigin(origin)) {
    return respond(
      new Response(JSON.stringify({ error: "Forbidden origin" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
      null,
    );
  }

  // Per-IP throttle (in-memory, per instance).
  if (!checkIpRate(ip)) {
    return respond(
      new Response(
        JSON.stringify({ error: "Per-IP rate limit exceeded", rateLimited: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      ),
      null,
      true,
    );
  }

  try {
    const API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    if (!API_KEY) {
      return respond(
        new Response(JSON.stringify({ error: "OPENWEATHER_API_KEY not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }),
        null,
      );
    }

    const { endpoint, params } = await req.json();

    // Validate endpoint to prevent abuse
    const allowedEndpoints = ["weather", "forecast", "geo/1.0/direct", "bulk"];
    if (!allowedEndpoints.includes(endpoint)) {
      return respond(
        new Response(JSON.stringify({ error: "Invalid endpoint" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }),
        null,
      );
    }

    // Bulk endpoint: fetch current weather for many coords in one request,
    // throttled server-side to stay under OpenWeather's 60 rpm free-tier limit.
    if (endpoint === "bulk") {
      const coords: Array<{ id: string; lat: number; lon: number }> =
        Array.isArray(params?.coords) ? params.coords : [];
      const units = params?.units ?? "imperial";
      const lang = params?.lang ?? "en";

      if (coords.length === 0 || coords.length > 200) {
        return respond(
          new Response(JSON.stringify({ error: "Invalid coords" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }),
          null,
        );
      }

      const results: Record<string, unknown> = {};
      const CONCURRENCY = 4;          // ~4 parallel fetches
      const MIN_INTERVAL_MS = 80;     // ≤ ~50 rpm sustained from this instance
      let lastFetchAt = 0;

      async function fetchOne(c: { id: string; lat: number; lon: number }) {
        const key = buildCacheKey("weather", { lat: c.lat, lon: c.lon, units, lang });
        const cached = getCached(key);
        if (cached !== null) { results[c.id] = JSON.parse(cached); return; }

        const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastFetchAt));
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        lastFetchAt = Date.now();

        const u = new URL("https://api.openweathermap.org/data/2.5/weather");
        u.searchParams.set("lat", String(c.lat));
        u.searchParams.set("lon", String(c.lon));
        u.searchParams.set("units", String(units));
        u.searchParams.set("lang", String(lang));
        u.searchParams.set("appid", API_KEY);
        const resp = await fetch(u.toString());
        const body = await resp.text();
        if (!resp.ok) {
          results[c.id] = {
            error: resp.status,
            activating: resp.status === 401,
            rateLimited: resp.status === 429,
          };
          return;
        }
        setCached(key, body);
        results[c.id] = JSON.parse(body);
      }

      // Simple concurrency-limited queue.
      const queue = [...coords];
      const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (queue.length) {
          const next = queue.shift();
          if (!next) break;
          try { await fetchOne(next); } catch { results[next.id] = { error: "fetch_failed" }; }
        }
      });
      await Promise.all(workers);

      // Aggregate flags: every-station 401 = key activating; every-station 429 = rate-limited.
      const entries = Object.values(results) as Array<any>;
      const allActivating =
        entries.length > 0 && entries.every((e) => e && e.activating === true);
      const allRateLimited =
        entries.length > 0 && entries.every((e) => e && (e.rateLimited === true || e.error === 429));
      return respond(
        new Response(
          JSON.stringify({ results, activating: allActivating, rateLimited: allRateLimited }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        ),
        "BULK",
        allRateLimited,
      );
    }

    // Serve from cache when available.
    const cacheKey = buildCacheKey(endpoint, params);
    const cachedBody = getCached(cacheKey);
    if (cachedBody !== null) {
      return respond(
        new Response(cachedBody, {
          headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "HIT" },
        }),
        "HIT",
      );
    }

    // Build URL
    const baseUrl =
      endpoint === "geo/1.0/direct"
        ? `https://api.openweathermap.org/${endpoint}`
        : `https://api.openweathermap.org/data/2.5/${endpoint}`;

    const url = new URL(baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }
    url.searchParams.set("appid", API_KEY);

    const response = await fetch(url.toString());
    const responseBody = await response.text();

    if (!response.ok) {
      let details: unknown = responseBody;
      try { details = JSON.parse(responseBody); } catch { /* keep raw */ }
      console.error("OpenWeatherMap upstream error:", response.status, details);
      // 401 from upstream = our key is brand-new and still activating on OpenWeatherMap's side.
      // Surface this as a soft 200 with an `activating` flag so the client can show a friendly
      // "provisioning telemetry" state and retry on a shorter interval, instead of treating it
      // as a hard error.
      if (response.status === 401) {
        return respond(
          new Response(
            JSON.stringify({ error: "Weather telemetry activating", activating: true }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          ),
          "MISS",
        );
      }
      // 429 = OpenWeatherMap free-tier rate cap (60/min). Surface as soft state so the client
      // can back off and show a friendly message instead of cascading into more retries.
      if (response.status === 429) {
        return respond(
          new Response(
            JSON.stringify({ error: "Weather telemetry rate-limited", rateLimited: true }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          ),
          "MISS",
          true,
        );
      }
      return respond(
        new Response(JSON.stringify({ error: "Weather data unavailable" }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }),
        "MISS",
      );
    }

    setCached(cacheKey, responseBody);

    return respond(
      new Response(responseBody, {
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "MISS" },
      }),
      "MISS",
    );
  } catch (e) {
    console.error("weather-proxy error:", e);
    return respond(
      new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
      null,
    );
  }
});
