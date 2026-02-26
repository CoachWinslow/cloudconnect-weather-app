import { City } from "@/data/cities";
import { getWeatherIconUrl } from "@/services/weatherService";
import { useNavigate } from "react-router-dom";
import { MapPin, Thermometer } from "lucide-react";

interface CityCardProps {
  city: City;
  weather?: { temp: number; icon: string; description: string };
  index: number;
}

export default function CityCard({ city, weather, index }: CityCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/city/${city.id}`)}
      className="group w-full text-left bg-card border border-border rounded-lg p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{city.connection.emoji}</span>
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              {city.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-3 h-3" />
            <span>{city.country}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {city.connection.type === "person"
              ? city.connection.tagline
              : city.connection.description.slice(0, 80) + "..."}
          </p>
        </div>
        {weather ? (
          <div className="flex flex-col items-center ml-3 shrink-0">
            <img
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.description}
              className="w-12 h-12"
            />
            <span className="font-display font-bold text-lg text-foreground">
              {weather.temp}°F
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {weather.description}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground ml-3">
            <Thermometer className="w-4 h-4 animate-pulse" />
          </div>
        )}
      </div>
    </button>
  );
}
