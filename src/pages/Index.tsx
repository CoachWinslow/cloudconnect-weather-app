import { useState, useMemo } from "react";
import Header from "@/components/Header";
import WorldMap from "@/components/WorldMap";
import CityCard from "@/components/CityCard";
import CitySearch from "@/components/CitySearch";
import { useCities } from "@/hooks/useCities";
import { useAllCitiesWeather } from "@/hooks/useWeatherData";
import { Radar, Database, Globe, Activity, ChevronDown } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";
import { groupCitiesByRegion, type RegionKey } from "@/utils/regionGroups";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Index = () => {
  const { language } = useSettings();
  const apiLang = language === "es" ? "es" : "en";
  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: weatherData } = useAllCitiesWeather(apiLang);
  const [openRegions, setOpenRegions] = useState<Record<RegionKey, boolean>>({
    'north-america': true,
    'central-south-america': true,
    'europe': true,
    'middle-east-africa': true,
    'asia-pacific': true,
  });

  const regionGroups = useMemo(() => {
    if (!cities) return [];
    return groupCitiesByRegion(cities);
  }, [cities]);

  const onlineCount = weatherData ? Object.keys(weatherData).length : 0;
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  if (citiesLoading || !cities) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Activity className="w-5 h-5 animate-pulse text-primary mr-2" />
          <span className="font-mono text-sm text-muted-foreground">Initializing stations...</span>
        </div>
      </div>
    );
  }

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
          <div className="mt-4">
            <CitySearch />
          </div>
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
          <WorldMap cities={cities} weatherData={weatherData || {}} />
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

      <footer className="border-t border-border py-6 mt-10">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-5">
            <a href="https://x.com/coach_winslow" target="_blank" rel="noopener noreferrer" className="group" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/coachwinslow" target="_blank" rel="noopener noreferrer" className="group" aria-label="Instagram">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/coachwinslow" target="_blank" rel="noopener noreferrer" className="group" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            {t(language, "footer")}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
