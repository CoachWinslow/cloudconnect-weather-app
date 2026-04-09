import Header from "@/components/Header";
import WorldMap from "@/components/WorldMap";
import CityCard from "@/components/CityCard";
import { cities } from "@/data/cities";
import { useAllCitiesWeather } from "@/hooks/useWeatherData";
import { Radar, Database, Globe } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";

const Index = () => {
  const { data: weatherData } = useAllCitiesWeather();
  const { language } = useSettings();

  const onlineCount = weatherData ? Object.keys(weatherData).length : 0;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  return (
    <div className="min-h-screen bg-background grid-bg relative">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Mission Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/20 mb-3">
            <Radar className="w-3 h-3 text-primary telemetry-pulse" />
            <span className="font-mono text-[10px] text-primary uppercase tracking-[0.15em]">
              {t(language, "globalTelemetryActive")}
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-glow mb-2">
            {t(language, "infrastructureCommandCenter")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            {t(language, "indexSubtitle")}
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-sm bg-card border border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                {t(language, "nodes")}: <span className="text-foreground">{cities.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase">
                {t(language, "online")}: <span className="text-primary">{onlineCount}</span>
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:block">
            {timestamp}
          </span>
        </div>

        {/* Map */}
        <div className="mb-8 relative">
          <div className="absolute -top-px left-4 px-2 py-0.5 bg-background border border-border border-b-0 rounded-t-sm z-10">
            <span className="font-mono text-[9px] text-primary/70 uppercase tracking-wider">
              {t(language, "satelliteOverlay")}
            </span>
          </div>
          <WorldMap weatherData={weatherData || {}} />
        </div>

        {/* City Cards */}
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-display text-base font-semibold text-foreground uppercase tracking-wider">
            {t(language, "monitoredLocations")}
          </h3>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[10px] text-muted-foreground">
            {cities.length} {t(language, "stations")}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cities.map((city, i) => (
            <CityCard
              key={city.id}
              city={city}
              weather={weatherData?.[city.id]}
              index={i}
            />
          ))}
        </div>
      </div>

      <footer className="border-t border-border py-4 text-center mt-10">
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          {t(language, "footer")}
        </p>
      </footer>
    </div>
  );
};

export default Index;
