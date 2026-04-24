import { useState, useMemo } from "react";
import Header from "@/components/Header";
import WorldMap from "@/components/WorldMap";
import CityCard from "@/components/CityCard";
import CitySearch from "@/components/CitySearch";
import { useCities } from "@/hooks/useCities";
import { useAllCitiesWeather } from "@/hooks/useWeatherData";
import { Radar, Database, Globe, Activity, ChevronDown, AlertTriangle, RefreshCw, X } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";
import { groupCitiesByRegion, type RegionKey } from "@/utils/regionGroups";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { language } = useSettings();
  const apiLang = language === "es" ? "es" : "en";
  const { data: cities, isLoading: citiesLoading } = useCities();
  const {
    data: weatherPayload,
    isError: weatherError,
    isFetching: weatherFetching,
    refetch: refetchWeather,
  } = useAllCitiesWeather(apiLang);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [openRegions, setOpenRegions] = useState<Record<RegionKey, boolean>>({
    'north-america': false,
    'central-south-america': false,
    'europe': false,
    'middle-east-africa': false,
    'asia-pacific': false,
    'australia-new-zealand': false,
  });

  const regionGroups = useMemo(() => {
    if (!cities) return [];
    return groupCitiesByRegion(cities);
  }, [cities]);

  const weatherData = weatherPayload?.results ?? {};
  const failedCount = weatherPayload?.failedCount ?? 0;
  const totalStations = weatherPayload?.total ?? 0;
  const onlineCount = Object.keys(weatherData).length;
  const showBanner =
    !bannerDismissed && (weatherError || (failedCount > 0 && totalStations > 0));
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const handleRetry = () => {
    setBannerDismissed(false);
    refetchWeather();
  };

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
        {/* Error banner */}
        {showBanner && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 px-3 py-3 rounded-sm bg-destructive/10 border border-destructive/40 animate-fade-in"
          >
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-xs font-semibold text-destructive uppercase tracking-wider">
                {t(language, "telemetryErrorTitle")}
              </p>
              <p className="text-xs text-foreground/80 mt-1">
                {weatherError
                  ? t(language, "telemetryErrorBody")
                  : t(language, "telemetryPartialBody")
                      .replace("{failed}", String(failedCount))
                      .replace("{total}", String(totalStations))}
              </p>
            </div>
            <button
              onClick={handleRetry}
              disabled={weatherFetching}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-destructive/20 hover:bg-destructive/30 border border-destructive/40 text-destructive text-[10px] font-mono uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label={t(language, "retry")}
            >
              <RefreshCw className={`w-3 h-3 ${weatherFetching ? "animate-spin" : ""}`} />
              {t(language, "retry")}
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label={t(language, "dismiss")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mission Header */}
        <div className="text-center mb-6 animate-fade-in relative z-50">
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

        {/* Share / Publish panel */}
        <div className="mb-4 px-3 py-3 rounded-sm bg-card border border-border flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Share2 className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="font-display text-xs font-semibold text-foreground uppercase tracking-wider">
                {language === "es" ? "Comparte esta misión" : "Share this mission"}
              </p>
              <a
                href={PUBLISHED_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors truncate block"
              >
                {PUBLISHED_URL}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/40 text-foreground text-[10px] font-mono uppercase tracking-wider transition-colors"
              aria-label={language === "es" ? "Copiar enlace" : "Copy link"}
            >
              {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-primary" />}
              {copied
                ? (language === "es" ? "Copiado" : "Copied")
                : (language === "es" ? "Copiar" : "Copy")}
            </button>
            <a
              href="https://docs.lovable.dev/features/deploy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-primary/15 hover:bg-primary/25 border border-primary/30 hover:border-primary/60 text-primary text-[10px] font-mono uppercase tracking-wider transition-colors"
              title={language === "es" ? "Publicar como público" : "Publish as Public"}
            >
              <Rocket className="w-3 h-3" />
              {language === "es" ? "Publicar" : "Publish"}
            </a>
            <button
              onClick={() => setVerifyOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/40 text-foreground text-[10px] font-mono uppercase tracking-wider transition-colors"
              title={language === "es" ? "Verificar perfil público" : "Verify profile is public"}
            >
              <UserCheck className="w-3 h-3 text-primary" />
              {language === "es" ? "Verificar perfil" : "Verify profile"}
            </button>
          </div>
        </div>

        <AlertDialog open={verifyOpen} onOpenChange={setVerifyOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                {language === "es" ? "Verifica tu perfil público" : "Verify your profile is public"}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3 text-sm">
                  <p>
                    {language === "es"
                      ? "Solo los perfiles públicos muestran proyectos publicados. Sigue estos pasos:"
                      : "Only public profiles list published projects. Follow these steps:"}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>
                      {language === "es"
                        ? "Abre la configuración de tu cuenta de Lovable."
                        : "Open your Lovable account settings."}
                    </li>
                    <li>
                      {language === "es"
                        ? "Busca \"Profile visibility\" (Visibilidad del perfil)."
                        : 'Find the "Profile visibility" section.'}
                    </li>
                    <li>
                      {language === "es"
                        ? "Asegúrate de que esté en \"Public\"."
                        : 'Make sure it\'s set to "Public".'}
                    </li>
                  </ol>
                  <p className="text-xs text-muted-foreground">
                    {language === "es"
                      ? "Lovable no expone esta configuración a la app, así que debes confirmarla manualmente."
                      : "Lovable doesn't expose this setting to the app, so you'll need to confirm it manually."}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {language === "es" ? "Cerrar" : "Close"}
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <a href={PROFILE_SETTINGS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {language === "es" ? "Abrir configuración" : "Open settings"}
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
        <div className="mb-8 relative z-0">
          <div className="absolute -top-px left-4 px-2 py-0.5 bg-background border border-border border-b-0 rounded-t-sm z-10">
            <span className="font-mono text-[9px] text-primary/70 uppercase tracking-wider">
              {t(language, "satelliteOverlay")}
            </span>
          </div>
          <WorldMap cities={cities} weatherData={weatherData} />
        </div>

        {/* City Cards by Region */}
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-display text-base font-semibold text-foreground uppercase tracking-wider">
            {t(language, "monitoredLocations")}
          </h3>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[10px] text-muted-foreground">
            {cities.length} {t(language, "stations")}
          </span>
        </div>

        <div className="space-y-4">
          {regionGroups.map((group) => (
            <Collapsible
              key={group.key}
              open={openRegions[group.key]}
              onOpenChange={(open) =>
                setOpenRegions((prev) => ({ ...prev, [group.key]: open }))
              }
            >
              <CollapsibleTrigger className="w-full group">
                <div className="flex items-center gap-3 px-3 py-2 rounded-sm bg-card border border-border hover:border-primary/30 transition-colors cursor-pointer">
                  <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-200 ${openRegions[group.key] ? '' : '-rotate-90'}`} />
                  <span className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                    {language === 'es' ? group.labelEs : group.label}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {group.cities.length} {group.cities.length === 1 ? 'station' : 'stations'}
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {group.cities.map((city, i) => (
                    <CityCard
                      key={city.id}
                      city={city}
                      weather={weatherData[city.id]}
                      index={i}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
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
