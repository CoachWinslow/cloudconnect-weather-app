import { useQuery } from "@tanstack/react-query";
import { cities } from "@/data/cities";
import { fetchCurrentWeather, fetchForecast, fetchHourlyForecast, WeatherData, ForecastDay, HourlyForecast } from "@/services/weatherService";

export function useAllCitiesWeather() {
  return useQuery({
    queryKey: ["all-cities-weather"],
    queryFn: async () => {
      const results: Record<string, { temp: number; icon: string; description: string }> = {};
      
      // Fetch in parallel but with small delays to respect rate limits
      const promises = cities.map(async (city, i) => {
        // Stagger requests slightly
        await new Promise((r) => setTimeout(r, i * 150));
        try {
          const data = await fetchCurrentWeather(city.lat, city.lng);
          results[city.id] = { temp: data.temp, icon: data.icon, description: data.description };
        } catch {
          // Skip failed cities
        }
      });

      await Promise.all(promises);
      return results;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
}

export function useCityWeather(lat: number, lng: number) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchCurrentWeather(lat, lng),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCityForecast(lat: number, lng: number) {
  return useQuery<ForecastDay[]>({
    queryKey: ["forecast", lat, lng],
    queryFn: () => fetchForecast(lat, lng),
    staleTime: 10 * 60 * 1000,
  });
}

export function useHourlyForecast(lat: number, lng: number) {
  return useQuery<HourlyForecast[]>({
    queryKey: ["hourly", lat, lng],
    queryFn: () => fetchHourlyForecast(lat, lng),
    staleTime: 10 * 60 * 1000,
  });
}
