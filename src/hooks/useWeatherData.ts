import { useQuery } from "@tanstack/react-query";
import { cities } from "@/data/cities";
import { fetchCurrentWeather, fetchForecast, fetchHourlyForecast, WeatherData, ForecastDay, HourlyForecast } from "@/services/weatherService";

export function useAllCitiesWeather(lang: string = "en") {
  return useQuery({
    queryKey: ["all-cities-weather", lang],
    queryFn: async () => {
      const results: Record<string, { temp: number; icon: string; description: string }> = {};
      
      const promises = cities.map(async (city, i) => {
        await new Promise((r) => setTimeout(r, i * 150));
        try {
          const data = await fetchCurrentWeather(city.lat, city.lng, lang);
          results[city.id] = { temp: data.temp, icon: data.icon, description: data.description };
        } catch {
          // Skip failed cities
        }
      });

      await Promise.all(promises);
      return results;
    },
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useCityWeather(lat: number, lng: number, lang: string = "en") {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lng, lang],
    queryFn: () => fetchCurrentWeather(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCityForecast(lat: number, lng: number, lang: string = "en") {
  return useQuery<ForecastDay[]>({
    queryKey: ["forecast", lat, lng, lang],
    queryFn: () => fetchForecast(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
  });
}

export function useHourlyForecast(lat: number, lng: number, lang: string = "en") {
  return useQuery<HourlyForecast[]>({
    queryKey: ["hourly", lat, lng, lang],
    queryFn: () => fetchHourlyForecast(lat, lng, lang),
    staleTime: 10 * 60 * 1000,
  });
}
