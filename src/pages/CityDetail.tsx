import { useParams, useNavigate } from "react-router-dom";
import { useCities } from "@/hooks/useCities";
import { useCityWeather, useCityForecast, useHourlyForecast } from "@/hooks/useWeatherData";
import { getWeatherIconUrl } from "@/services/weatherService";
import Header from "@/components/Header";
import { ArrowLeft, Droplets, Wind, Thermometer, CloudSun, Lightbulb, MapPin, Activity, Clock } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import CityEmoji from "@/components/CityEmoji";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";

export default function CityDetail() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const { formatTemp, convertWindSpeed, language } = useSettings();
  const { data: cities, isLoading: citiesLoading } = useCities();
  const city = cities?.find((c) => c.id === cityId);

  const apiLang = language === "es" ? "es" : "en";
  const { data: weather, isLoading: weatherLoading } = useCityWeather(city?.lat ?? 0, city?.lng ?? 0, apiLang, !!city);
  const { data: forecast, isLoading: forecastLoading } = useCityForecast(city?.lat ?? 0, city?.lng ?? 0, apiLang, !!city);
  const { data: hourly, isLoading: hourlyLoading } = useHourlyForecast(city?.lat ?? 0, city?.lng ?? 0, apiLang, !!city);

  if (citiesLoading) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Activity className="w-5 h-5 animate-pulse text-primary mr-2" />
          <span className="font-mono text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">{t(language, "stationNotFound")}</h2>
          <button onClick={() => navigate("/")} className="text-primary hover:underline font-mono text-sm">
            {t(language, "returnToCommandCenter")}
          </button>
        </div>
      </div>
    );
  }

  const dayLocale = language === "es" ? "es-CO" : "en-US";

  const getWeatherSummary = () => {
    if (!weather || !forecast) return null;
    const todayForecast = forecast[0];
    const tomorrowForecast = forecast[1];
    let summary = t(language, "conditionsSummary")
      .replace("{description}", weather.description)
      .replace("{temp}", formatTemp(weather.temp))
      .replace("{feelsLike}", formatTemp(weather.feelsLike));
    if (todayForecast) {
      summary += t(language, "conditionsToday")
        .replace("{high}", formatTemp(todayForecast.tempMax))
        .replace("{low}", formatTemp(todayForecast.tempMin));
    }
    if (tomorrowForecast) {
      summary += t(language, "conditionsTomorrow")
        .replace("{description}", tomorrowForecast.description);
    }
    return summary;
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />

      {/* Motto */}
      <div className="container mx-auto px-4 max-w-4xl pt-6 pb-2 text-center animate-fade-in">
        <p className="font-display text-2xl md:text-4xl italic text-primary/70 tracking-wide text-glow">
          Enveniam Viam
        </p>
      </div>

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-mono text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>{t(language, "commandCenter")}</span>
        </button>

        {/* Station Header */}
        <div className="mb-6 animate-fade-in glow-border hud-corners rounded-md p-5 bg-card relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary status-online" />
              <span className="font-mono text-[10px] text-primary uppercase tracking-wider">{t(language, "stationActive")}</span>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <CityEmoji emoji={city.connection.emoji} name={city.name} className="text-3xl" size={36} />
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-glow">
                    {city.name}
                  </h2>
                  <FavoriteButton cityId={city.id} cityName={city.name} lat={city.lat} lng={city.lng} />
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MapPin className="w-3 h-3" />
                  <span>{city.country}</span>
                  <span className="text-border mx-1">|</span>
                  <span className="font-mono text-[10px] text-primary/60">
                    {city.lat.toFixed(4)}°N, {Math.abs(city.lng).toFixed(4)}°{city.lng >= 0 ? 'E' : 'W'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Weather */}
          <div className="bg-card glow-border hud-corners rounded-md p-5 animate-fade-in relative overflow-hidden" style={{ animationDelay: "100ms" }}>
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-display font-semibold text-sm text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Thermometer className="w-4 h-4 text-primary" />
                {t(language, "weatherTelemetry")}
              </h3>
              {weatherLoading || !weather ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <Activity className="w-5 h-5 animate-pulse text-primary/50 mr-2" />
                  <span className="font-mono text-sm">{t(language, "acquiringData")}</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={getWeatherIconUrl(weather.icon)}
                      alt={weather.description}
                      className="w-16 h-16"
                    />
                    <div>
                      <div className="font-mono text-4xl font-bold text-primary text-glow">
                        {formatTemp(weather.temp)}
                      </div>
                      <div className="text-muted-foreground capitalize text-sm">{weather.description}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Thermometer, label: t(language, "feelsLike"), value: formatTemp(weather.feelsLike) },
                      { icon: Droplets, label: t(language, "humidity"), value: `${weather.humidity}%` },
                      { icon: Wind, label: t(language, "wind"), value: convertWindSpeed(weather.windSpeed) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-secondary/50 rounded-sm p-2.5 text-center border border-border/50">
                        <Icon className="w-3 h-3 text-primary mx-auto mb-1" />
                        <div className="font-mono text-[9px] text-muted-foreground uppercase">{label}</div>
                        <div className="font-mono font-semibold text-sm text-foreground">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current Conditions */}
          <div className="bg-card glow-border hud-corners rounded-md p-5 animate-fade-in relative overflow-hidden" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-display font-semibold text-sm text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                <CloudSun className="w-4 h-4 text-accent" />
                {t(language, "currentConditions")}
              </h3>
              {weatherLoading || !weather ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <Activity className="w-5 h-5 animate-pulse text-primary/50 mr-2" />
                  <span className="font-mono text-sm">{t(language, "acquiringData")}</span>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {getWeatherSummary()}
                  </p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="w-3 h-3 text-primary/70" />
                    <span className="font-mono text-[9px] text-primary/70 uppercase tracking-wider">{t(language, "nextHours")}</span>
                  </div>
                  {hourlyLoading || !hourly ? (
                    <div className="text-muted-foreground text-center py-4 font-mono text-xs">
                      <Activity className="w-4 h-4 animate-pulse text-primary/50 mx-auto mb-1" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5">
                      {hourly.map((h, i) => (
                        <div key={i} className="text-center bg-secondary/50 rounded-sm p-2 border border-border/50">
                          <div className="font-mono text-[10px] font-medium text-primary/70 mb-0.5">{h.time}</div>
                          <img src={getWeatherIconUrl(h.icon)} alt={h.description} className="w-8 h-8 mx-auto" />
                          <div className="font-mono font-semibold text-sm text-foreground">{formatTemp(h.temp)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-card glow-border hud-corners rounded-md p-5 mt-4 animate-fade-in relative overflow-hidden" style={{ animationDelay: "300ms" }}>
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-display font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
              {t(language, "forecastProjection")}
            </h3>
            {forecastLoading || !forecast ? (
              <div className="text-muted-foreground text-center py-8 font-mono text-sm">
                <Activity className="w-5 h-5 animate-pulse text-primary/50 mx-auto mb-2" />
                {t(language, "acquiringForecast")}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {forecast.map((day) => {
                  const localDay = new Date(day.date + "T12:00:00").toLocaleDateString(dayLocale, { weekday: "short" });
                  return (
                    <div key={day.date} className="text-center bg-secondary/50 rounded-sm p-2.5 border border-border/50">
                      <div className="font-mono text-[10px] font-medium text-primary/70 mb-1 uppercase">{localDay}</div>
                      <img
                        src={getWeatherIconUrl(day.icon)}
                        alt={day.description}
                        className="w-9 h-9 mx-auto"
                      />
                      <div className="font-mono font-semibold text-sm text-foreground">
                        {formatTemp(day.tempMax)}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">{formatTemp(day.tempMin)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Intel Report */}
        <div className="glow-border-accent hud-corners rounded-md p-4 mt-4 animate-fade-in bg-accent/5 relative overflow-hidden" style={{ animationDelay: "400ms" }}>
          <div className="relative z-10 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono font-semibold text-accent text-[10px] uppercase tracking-wider mb-1">
                {t(language, "intelReport")}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "es" && city.connection.description_es
                  ? city.connection.description_es
                  : city.connection.description}
              </p>
              {city.connection.url && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                  {city.connection.url.split(",").map((rawUrl) => {
                    const url = rawUrl.trim();
                    let label: string;
                    try {
                      label = new URL(url).hostname.replace("www.", "");
                    } catch {
                      label = url;
                    }
                    return (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-primary hover:text-primary/80 uppercase tracking-wider transition-colors"
                      >
                        {label} →
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-4 text-center mt-10">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          {t(language, "footer")}
        </p>
      </footer>
    </div>
  );
}
