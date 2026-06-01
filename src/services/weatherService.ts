import { supabase } from "@/integrations/supabase/client";

export class WeatherActivatingError extends Error {
  constructor() {
    super("Weather telemetry activating");
    this.name = "WeatherActivatingError";
  }
}

export class WeatherRateLimitedError extends Error {
  constructor() {
    super("Weather telemetry rate-limited");
    this.name = "WeatherRateLimitedError";
  }
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  tempMin: number;
  tempMax: number;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  description: string;
}

async function callWeatherProxy(endpoint: string, params: Record<string, string | number>) {
  const { data, error } = await supabase.functions.invoke("weather-proxy", {
    body: { endpoint, params },
  });
  if (error) throw new Error(error.message || "Weather proxy error");
  if (data?.activating) throw new WeatherActivatingError();
  if (data?.rateLimited) throw new WeatherRateLimitedError();
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function fetchCurrentWeather(lat: number, lng: number, lang: string = "en"): Promise<WeatherData> {
  const data = await callWeatherProxy("weather", { lat, lon: lng, units: "imperial", lang });
  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
  };
}

export async function fetchForecast(lat: number, lng: number, lang: string = "en"): Promise<ForecastDay[]> {
  const data = await callWeatherProxy("forecast", { lat, lon: lng, units: "imperial", lang });

  const days = new Map<string, ForecastDay>();

  for (const item of data.list) {
    const date = item.dt_txt.split(" ")[0];
    if (days.has(date)) {
      const existing = days.get(date)!;
      existing.tempMin = Math.min(existing.tempMin, Math.round(item.main.temp_min));
      existing.tempMax = Math.max(existing.tempMax, Math.round(item.main.temp_max));
    } else {
      const d = new Date(item.dt * 1000);
      days.set(date, {
        date,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      });
    }
  }

  return Array.from(days.values()).slice(0, 5);
}

export async function fetchHourlyForecast(lat: number, lng: number, lang: string = "en"): Promise<HourlyForecast[]> {
  const data = await callWeatherProxy("forecast", { lat, lon: lng, units: "imperial", lang });

  return data.list.slice(0, 4).map((item: any) => {
    const d = new Date(item.dt * 1000);
    const hour = d.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return {
      time: `${h} ${ampm}`,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    };
  });
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
