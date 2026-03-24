import { useParams, useNavigate } from "react-router-dom";
import { cities } from "@/data/cities";
import { useCityWeather, useCityForecast } from "@/hooks/useWeatherData";
import { getWeatherIconUrl } from "@/services/weatherService";
import Header from "@/components/Header";
import { ArrowLeft, Droplets, Wind, Thermometer, User, BookOpen, Lightbulb, MapPin, Activity } from "lucide-react";

export default function CityDetail() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const city = cities.find((c) => c.id === cityId);

  if (!city) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Station Not Found</h2>
          <button onClick={() => navigate("/")} className="text-primary hover:underline font-mono text-sm">
            ← Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  const { data: weather, isLoading: weatherLoading } = useCityWeather(city.lat, city.lng);
  const { data: forecast, isLoading: forecastLoading } = useCityForecast(city.lat, city.lng);

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-mono text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Command Center</span>
        </button>

        {/* Station Header */}
        <div className="mb-6 animate-fade-in glow-border hud-corners rounded-md p-5 bg-card relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary status-online" />
              <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Station Active</span>
            </div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{city.connection.emoji}</span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-glow">
                  {city.name}
                </h2>
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
                Weather Telemetry
              </h3>
              {weatherLoading || !weather ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <Activity className="w-5 h-5 animate-pulse text-primary/50 mr-2" />
                  <span className="font-mono text-sm">Acquiring data...</span>
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
                        {weather.temp}°F
                      </div>
                      <div className="text-muted-foreground capitalize text-sm">{weather.description}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Thermometer, label: "Feels Like", value: `${weather.feelsLike}°F` },
                      { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
                      { icon: Wind, label: "Wind", value: `${weather.windSpeed} mph` },
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

          {/* Connection */}
          <div className="bg-card glow-border hud-corners rounded-md p-5 animate-fade-in relative overflow-hidden" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-display font-semibold text-sm text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                {city.connection.type === "person" ? (
                  <User className="w-4 h-4 text-accent" />
                ) : (
                  <BookOpen className="w-4 h-4 text-accent" />
                )}
                {city.connection.type === "person" ? "Personnel File" : "Station Log"}
              </h3>
              <div>
                {city.connection.name && (
                  <div className="mb-3">
                    <div className="w-12 h-12 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl mb-2">
                      {city.connection.emoji}
                    </div>
                    <h4 className="font-display font-semibold text-foreground">
                      {city.connection.name}
                    </h4>
                    {city.connection.tagline && (
                      <p className="text-xs text-accent font-mono">{city.connection.tagline}</p>
                    )}
                  </div>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {city.connection.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-card glow-border hud-corners rounded-md p-5 mt-4 animate-fade-in relative overflow-hidden" style={{ animationDelay: "300ms" }}>
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-display font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">
              5-Day Forecast Projection
            </h3>
            {forecastLoading || !forecast ? (
              <div className="text-muted-foreground text-center py-8 font-mono text-sm">
                <Activity className="w-5 h-5 animate-pulse text-primary/50 mx-auto mb-2" />
                Acquiring forecast telemetry...
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {forecast.map((day) => (
                  <div key={day.date} className="text-center bg-secondary/50 rounded-sm p-2.5 border border-border/50">
                    <div className="font-mono text-[10px] font-medium text-primary/70 mb-1 uppercase">{day.dayName}</div>
                    <img
                      src={getWeatherIconUrl(day.icon)}
                      alt={day.description}
                      className="w-9 h-9 mx-auto"
                    />
                    <div className="font-mono font-semibold text-sm text-foreground">
                      {day.tempMax}°
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">{day.tempMin}°</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fun Fact */}
        <div className="glow-border-accent hud-corners rounded-md p-4 mt-4 animate-fade-in bg-accent/5 relative overflow-hidden" style={{ animationDelay: "400ms" }}>
          <div className="relative z-10 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono font-semibold text-accent text-[10px] uppercase tracking-wider mb-1">
                Intel Report
              </h4>
              <p className="text-muted-foreground text-sm">{city.funFact}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-4 text-center mt-10">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          M3 CloudConnect — Mission Control Interface — Built with Lovable
        </p>
      </footer>
    </div>
  );
}
