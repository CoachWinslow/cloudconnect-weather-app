import { useParams, useNavigate } from "react-router-dom";
import { cities } from "@/data/cities";
import { useCityWeather, useCityForecast } from "@/hooks/useWeatherData";
import { getWeatherIconUrl } from "@/services/weatherService";
import Header from "@/components/Header";
import { ArrowLeft, Droplets, Wind, Thermometer, User, BookOpen, Lightbulb } from "lucide-react";

export default function CityDetail() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const city = cities.find((c) => c.id === cityId);

  if (!city) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">City not found</h2>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">
            ← Back to map
          </button>
        </div>
      </div>
    );
  }

  const { data: weather, isLoading: weatherLoading } = useCityWeather(city.lat, city.lng);
  const { data: forecast, isLoading: forecastLoading } = useCityForecast(city.lat, city.lng);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to map</span>
        </button>

        {/* City Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">{city.connection.emoji}</span>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {city.name}
              </h2>
              <p className="text-muted-foreground">{city.country}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Weather */}
          <div className="bg-card border border-border rounded-lg p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-primary" />
              Current Weather
            </h3>
            {weatherLoading || !weather ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Loading weather...
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getWeatherIconUrl(weather.icon)}
                    alt={weather.description}
                    className="w-20 h-20"
                  />
                  <div>
                    <div className="font-display text-5xl font-bold text-foreground">
                      {weather.temp}°F
                    </div>
                    <div className="text-muted-foreground capitalize">{weather.description}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary rounded-md p-3 text-center">
                    <Thermometer className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Feels Like</div>
                    <div className="font-display font-semibold text-foreground">{weather.feelsLike}°F</div>
                  </div>
                  <div className="bg-secondary rounded-md p-3 text-center">
                    <Droplets className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Humidity</div>
                    <div className="font-display font-semibold text-foreground">{weather.humidity}%</div>
                  </div>
                  <div className="bg-secondary rounded-md p-3 text-center">
                    <Wind className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">Wind</div>
                    <div className="font-display font-semibold text-foreground">{weather.windSpeed} mph</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Connection */}
          <div className="bg-card border border-border rounded-lg p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              {city.connection.type === "person" ? (
                <User className="w-4 h-4 text-primary" />
              ) : (
                <BookOpen className="w-4 h-4 text-primary" />
              )}
              {city.connection.type === "person" ? "Tech Connection" : "Tech Story"}
            </h3>
            <div>
              {city.connection.name && (
                <div className="mb-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-2">
                    {city.connection.emoji}
                  </div>
                  <h4 className="font-display font-semibold text-lg text-foreground">
                    {city.connection.name}
                  </h4>
                  {city.connection.tagline && (
                    <p className="text-sm text-primary font-medium">{city.connection.tagline}</p>
                  )}
                </div>
              )}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {city.connection.description}
              </p>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-card border border-border rounded-lg p-6 mt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h3 className="font-display font-semibold text-foreground mb-4">5-Day Forecast</h3>
          {forecastLoading || !forecast ? (
            <div className="text-muted-foreground text-center py-8">Loading forecast...</div>
          ) : (
            <div className="grid grid-cols-5 gap-2 md:gap-4">
              {forecast.map((day) => (
                <div key={day.date} className="text-center bg-secondary rounded-md p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">{day.dayName}</div>
                  <img
                    src={getWeatherIconUrl(day.icon)}
                    alt={day.description}
                    className="w-10 h-10 mx-auto"
                  />
                  <div className="font-display font-semibold text-sm text-foreground">
                    {day.tempMax}°
                  </div>
                  <div className="text-xs text-muted-foreground">{day.tempMin}°</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fun Fact */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 mt-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm mb-1">Fun Fact</h4>
              <p className="text-muted-foreground text-sm">{city.funFact}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground mt-10">
        <p>CloudConnect Weather — Built with ❤️ and Lovable</p>
      </footer>
    </div>
  );
}
