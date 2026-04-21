import { supabase } from "@/integrations/supabase/client";

export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase.functions.invoke("weather-proxy", {
    body: {
      endpoint: "geo/1.0/direct",
      params: { q: query, limit: 10 },
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
