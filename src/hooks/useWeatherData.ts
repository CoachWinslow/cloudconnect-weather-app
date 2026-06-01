import { useQuery } from "@tanstack/react-query";
import { useCities } from "@/hooks/useCities";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchHourlyForecast,
  WeatherActivatingError,
  WeatherData,
  ForecastDay,
  HourlyForecast,
} from "@/services/weatherService";

// While the OpenWeatherMap key is still activating upstream we retry every minute
// instead of waiting the full 15-min cycle, so the app self-heals quickly.
const ACTIVATING_REFETCH_MS = 60 * 1000;
const NORMAL_REFETCH_MS = 15 * 60 * 1000;
const DETAIL_REFETCH_MS = 10 * 60 * 1000;

export function useAllCitiesWeather(lang: string = "en") {
  const { data: cities } = useCities();
  const query = useQuery({
    queryKey: ["all-cities-weather", lang, cities?.map(c => c.id).join(",")],
    queryFn: async () => {
      if (!cities) return { results: {}, failedCount: 0, total: 0, activating: false };
      const results: Record<string, { temp: number; icon: string; description: string }> = {};
      let failedCount = 0;

      const coords = cities.map((c) => ({ id: c.id, lat: c.lat, lon: c.lng }));
      const { data, error } = await supabase.functions.invoke("weather-proxy", {
        body: { endpoint: "bulk", params: { coords, units: "imperial", lang } },
      });
      if (error) throw new Error(error.message || "Weather proxy error");

      const activating: boolean = data?.activating === true;
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

      // If every city failed AND it's not just the activation window, surface a hard error.
      if (cities.length > 0 && failedCount === cities.length && !activating) {
        throw new Error("Weather telemetry unavailable for all stations");
      }

      return { results, failedCount, total: cities.length, activating };
    },
    enabled: !!cities && cities.length > 0,
    staleTime: 10 * 60 * 1000,
    refetchInterval: (q) =>
      q.state.data?.activating ? ACTIVATING_REFETCH_MS : NORMAL_REFETCH_MS,
    refetchOnWindowFocus: true,
  });
  return query;
}

export function useCityWeather(lat: number, lng: number, lang: string = "en", enabled: boolean = true) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lng, lang],
    queryFn: () => fetchCurrentWeather(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
    enabled,
    refetchInterval: DETAIL_REFETCH_MS,
    refetchOnWindowFocus: true,
    retry: (failureCount, err) =>
      err instanceof WeatherActivatingError ? failureCount < 5 : failureCount < 2,
    retryDelay: (attempt, err) =>
      err instanceof WeatherActivatingError ? 30_000 : Math.min(1000 * 2 ** attempt, 30_000),
  });
}

export function useCityForecast(lat: number, lng: number, lang: string = "en", enabled: boolean = true) {
  return useQuery<ForecastDay[]>({
    queryKey: ["forecast", lat, lng, lang],
    queryFn: () => fetchForecast(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
    enabled,
    refetchInterval: DETAIL_REFETCH_MS,
    refetchOnWindowFocus: true,
    retry: (failureCount, err) =>
      err instanceof WeatherActivatingError ? failureCount < 5 : failureCount < 2,
    retryDelay: (attempt, err) =>
      err instanceof WeatherActivatingError ? 30_000 : Math.min(1000 * 2 ** attempt, 30_000),
  });
}

export function useHourlyForecast(lat: number, lng: number, lang: string = "en", enabled: boolean = true) {
  return useQuery<HourlyForecast[]>({
    queryKey: ["hourly", lat, lng, lang],
    queryFn: () => fetchHourlyForecast(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
    enabled,
    refetchInterval: DETAIL_REFETCH_MS,
    refetchOnWindowFocus: true,
    retry: (failureCount, err) =>
      err instanceof WeatherActivatingError ? failureCount < 5 : failureCount < 2,
    retryDelay: (attempt, err) =>
      err instanceof WeatherActivatingError ? 30_000 : Math.min(1000 * 2 ** attempt, 30_000),
  });
}
