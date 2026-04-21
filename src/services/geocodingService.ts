import { supabase } from "@/integrations/supabase/client";

export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

const US_STATE_ABBREV: Record<string, string> = {
  alabama:"AL", alaska:"AK", arizona:"AZ", arkansas:"AR", california:"CA",
  colorado:"CO", connecticut:"CT", delaware:"DE", florida:"FL", georgia:"GA",
  hawaii:"HI", idaho:"ID", illinois:"IL", indiana:"IN", iowa:"IA",
  kansas:"KS", kentucky:"KY", louisiana:"LA", maine:"ME", maryland:"MD",
  massachusetts:"MA", michigan:"MI", minnesota:"MN", mississippi:"MS", missouri:"MO",
  montana:"MT", nebraska:"NE", nevada:"NV", "new hampshire":"NH", "new jersey":"NJ",
  "new mexico":"NM", "new york":"NY", "north carolina":"NC", "north dakota":"ND", ohio:"OH",
  oklahoma:"OK", oregon:"OR", pennsylvania:"PA", "rhode island":"RI", "south carolina":"SC",
  "south dakota":"SD", tennessee:"TN", texas:"TX", utah:"UT", vermont:"VT",
  virginia:"VA", washington:"WA", "west virginia":"WV", wisconsin:"WI", wyoming:"WY",
  "district of columbia":"DC",
};
const US_STATE_CODES = new Set(Object.values(US_STATE_ABBREV));

function normalizeUSQuery(query: string): string {
  // Split on commas, trim each part.
  const parts = query.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return query;
  const city = parts[0];
  const stateRaw = parts[1].toLowerCase();
  const stateCode =
    US_STATE_CODES.has(stateRaw.toUpperCase()) ? stateRaw.toUpperCase() :
    US_STATE_ABBREV[stateRaw] ?? null;
  if (!stateCode) return query;
  return `${city},${stateCode},US`;
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  // OpenWeather expects "City,STATE,US" (no spaces, ISO state code) for US lookups.
  // Normalize inputs like "Greenville, PA" or "Greenville, Pennsylvania" into that format.
  const normalizedQuery = normalizeUSQuery(query);

  const { data, error } = await supabase.functions.invoke("weather-proxy", {
    body: {
      endpoint: "geo/1.0/direct",
      params: { q: normalizedQuery, limit: 10 },
    },
  });

  if (error || data?.error) return [];

  const results: GeocodingResult[] = data.map((item: any) => ({
    name: item.name,
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon,
  }));

  // If query mentions a US state (full or abbrev), prioritize that exact state.
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const tokens = q.split(/[\s,]+/).filter(Boolean);

  const US_STATE_NAMES: Record<string, string> = {
     al:"alabama", ak:"alaska", az:"arizona", ar:"arkansas", ca:"california",
     co:"colorado", ct:"connecticut", de:"delaware", fl:"florida", ga:"georgia",
     hi:"hawaii", id:"idaho", il:"illinois", in:"indiana", ia:"iowa",
     ks:"kansas", ky:"kentucky", la:"louisiana", me:"maine", md:"maryland",
     ma:"massachusetts", mi:"michigan", mn:"minnesota", ms:"mississippi", mo:"missouri",
     mt:"montana", ne:"nebraska", nv:"nevada", nh:"new hampshire", nj:"new jersey",
     nm:"new mexico", ny:"new york", nc:"north carolina", nd:"north dakota", oh:"ohio",
     ok:"oklahoma", or:"oregon", pa:"pennsylvania", ri:"rhode island", sc:"south carolina",
     sd:"south dakota", tn:"tennessee", tx:"texas", ut:"utah", vt:"vermont",
     va:"virginia", wa:"washington", wv:"west virginia", wi:"wisconsin", wy:"wyoming",
     dc:"district of columbia",
  };

  // Identify any state mentioned in the query (full name or abbrev).
  let targetState: string | null = null;
  for (const tok of tokens) {
    if (US_STATE_NAMES[tok]) { targetState = US_STATE_NAMES[tok]; break; }
  }
  if (!targetState) {
    for (const fullName of Object.values(US_STATE_NAMES)) {
      if (q.includes(fullName)) { targetState = fullName; break; }
    }
  }

  return results.sort((a, b) => {
    if (targetState) {
      const aMatch = a.country === "US" && (a.state ?? "").toLowerCase() === targetState ? 1 : 0;
      const bMatch = b.country === "US" && (b.state ?? "").toLowerCase() === targetState ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
    }
    // Otherwise prefer US results slightly so eg "Greenville" surfaces US ones.
    const aUS = a.country === "US" ? 1 : 0;
    const bUS = b.country === "US" ? 1 : 0;
    return bUS - aUS;
  });
}
