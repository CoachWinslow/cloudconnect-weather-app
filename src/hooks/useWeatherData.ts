import { useQuery } from "@tanstack/react-query";
import { useCities } from "@/hooks/useCities";
import { supabase } from "@/integrations/supabase/client";
import { fetchCurrentWeather, fetchForecast, fetchHourlyForecast, WeatherData, ForecastDay, HourlyForecast } from "@/services/weatherService";

export function useAllCitiesWeather(lang: string = "en") {
  const { data: cities } = useCities();
  return useQuery({
    queryKey: ["all-cities-weather", lang, cities?.map(c => c.id).join(",")],
    queryFn: async () => {
      if (!cities) return { results: {}, failedCount: 0, total: 0 };
      const results: Record<string, { temp: number; icon: string; description: string }> = {};
      let failedCount = 0;

      const coords = cities.map((c) => ({ id: c.id, lat: c.lat, lon: c.lng }));
      const { data, error } = await supabase.functions.invoke("weather-proxy", {
        body: { endpoint: "bulk", params: { coords, units: "imperial", lang } },
      });
      if (error) throw new Error(error.message || "Weather proxy error");

      const raw = (data?.results ?? {}) as Record<string, any>;
      for (const city of cities) {
        const entry = raw[city.id];
        if (entry && entry.main && entry.weather?.[0]) {
          results[city.id] = {
            temp: Math.round(entry.main.temp),
            icon: entry.weather[0].icon,
            description: entry.weather[0].description,
          };
        } else {
          failedCount += 1;
        }
      }

      // If every city failed, treat as a hard failure so React Query surfaces it.
      if (cities.length > 0 && failedCount === cities.length) {
        throw new Error("Weather telemetry unavailable for all stations");
      }

      return { results, failedCount, total: cities.length };
    },
    enabled: !!cities && cities.length > 0,
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useCityWeather(lat: number, lng: number, lang: string = "en", enabled: boolean = true) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lng, lang],
    queryFn: () => fetchCurrentWeather(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

export function useCityForecast(lat: number, lng: number, lang: string = "en", enabled: boolean = true) {
  return useQuery<ForecastDay[]>({
    queryKey: ["forecast", lat, lng, lang],
    queryFn: () => fetchForecast(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

export function useHourlyForecast(lat: number, lng: number, lang: string = "en", enabled: boolean = true) {
  return useQuery<HourlyForecast[]>({
    queryKey: ["hourly", lat, lng, lang],
    queryFn: () => fetchHourlyForecast(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}
