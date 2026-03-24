import { City } from "@/data/cities";
import { getWeatherIconUrl } from "@/services/weatherService";
import { useNavigate } from "react-router-dom";
import { MapPin, Thermometer, ChevronRight } from "lucide-react";

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
      className="group w-full text-left bg-card glow-border hud-corners rounded-md p-4 hover:border-primary/50 transition-all duration-300 animate-fade-in relative overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Status + City Name */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary status-online shrink-0" />
            <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
              {city.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2 ml-3.5">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{city.country}</span>
          </div>

          {/* Connection type tag */}
          <div className="ml-3.5 mb-2">
            <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary/80 border border-primary/20">
              {city.connection.type === "person" ? "Personnel" : "Station"}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground line-clamp-2 ml-3.5 leading-relaxed">
            {city.connection.type === "person"
              ? city.connection.tagline
              : city.connection.description.slice(0, 80) + "..."}
          </p>
        </div>

        {/* Weather telemetry */}
        {weather ? (
          <div className="flex flex-col items-center ml-3 shrink-0 bg-secondary/50 rounded-sm p-2 border border-border/50">
            <img
              src={getWeatherIconUrl(weather.icon)}
              alt={weather.description}
              className="w-10 h-10"
            />
            <span className="font-mono font-bold text-base text-primary">
              {weather.temp}°F
            </span>
            <span className="font-mono text-[8px] text-muted-foreground capitalize tracking-wider">
              {weather.description}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-muted-foreground ml-3">
            <Thermometer className="w-4 h-4 animate-pulse text-primary/50" />
          </div>
        )}
      </div>

      {/* Bottom action hint */}
      <div className="relative z-10 flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="font-mono text-[9px] text-primary/60 uppercase tracking-wider flex items-center gap-1">
          Access Data <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
}
