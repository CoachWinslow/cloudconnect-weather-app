import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Restrict CORS to known app origins to deter cross-site abuse of the OpenWeather quota.
const ALLOWED_ORIGINS = new Set<string>([
  "https://cloudconnectweather.lovable.app",
  "https://id-preview--b60a879d-637a-45dc-a32c-16f9ef225621.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
]);
const ALLOWED_ORIGIN_SUFFIXES = [".lovable.app", ".lovableproject.com"];

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
  const origin = req.headers.get("Origin");
  const corsHeaders = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: "Forbidden origin" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "OPENWEATHER_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { endpoint, params } = await req.json();

    // Validate endpoint to prevent abuse
    const allowedEndpoints = ["weather", "forecast", "geo/1.0/direct"];
    if (!allowedEndpoints.includes(endpoint)) {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Serve from cache when available.
    const cacheKey = buildCacheKey(endpoint, params);
    const cachedBody = getCached(cacheKey);
    if (cachedBody !== null) {
      return new Response(cachedBody, {
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "HIT" },
      });
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
      return new Response(JSON.stringify({ error: "OpenWeatherMap API error", details }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    setCached(cacheKey, responseBody);

    return new Response(responseBody, {
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "MISS" },
    });
  } catch (e) {
    console.error("weather-proxy error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
