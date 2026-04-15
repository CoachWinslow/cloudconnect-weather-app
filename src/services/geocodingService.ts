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
      params: { q: query, limit: 5 },
    },
  });

  if (error || data?.error) return [];

  return data.map((item: any) => ({
    name: item.name,
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon,
  }));
}
