import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { City } from "@/data/cities";

export interface DbCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  connection_type: string;
  connection_name: string | null;
  connection_tagline: string | null;
  connection_description: string;
  connection_description_es: string | null;
  connection_emoji: string;
  connection_url: string | null;
  fun_fact: string;
  fun_fact_es: string | null;
  sort_order: number;
}

function dbCityToCity(db: DbCity): City {
  return {
    id: db.id,
    name: db.name,
    country: db.country,
    lat: db.lat,
    lng: db.lng,
    connection: {
      type: db.connection_type as "person" | "story",
      name: db.connection_name ?? undefined,
      tagline: db.connection_tagline ?? undefined,
      description: db.connection_description,
      description_es: db.connection_description_es ?? undefined,
      emoji: db.connection_emoji,
      url: db.connection_url ?? undefined,
    },
    funFact: db.fun_fact,
    funFact_es: db.fun_fact_es ?? undefined,
  };
}

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as DbCity[]).map(dbCityToCity);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDbCities() {
  return useQuery({
    queryKey: ["cities-raw"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as DbCity[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
