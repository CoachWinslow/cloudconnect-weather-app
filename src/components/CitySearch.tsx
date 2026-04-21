import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Loader2, Radio } from "lucide-react";
import { searchCities, GeocodingResult } from "@/services/geocodingService";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";
import { useCities } from "@/hooks/useCities";
import type { City } from "@/data/cities";

const US_STATES: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
  KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
  MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri",
  MT: "montana", NE: "nebraska", NV: "nevada", NH: "new hampshire", NJ: "new jersey",
  NM: "new mexico", NY: "new york", NC: "north carolina", ND: "north dakota", OH: "ohio",
  OK: "oklahoma", OR: "oregon", PA: "pennsylvania", RI: "rhode island", SC: "south carolina",
  SD: "south dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
  VA: "virginia", WA: "washington", WV: "west virginia", WI: "wisconsin", WY: "wyoming",
  DC: "district of columbia",
};

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();
}

function expandQueryTokens(q: string): string {
  // Replace any 2-letter US state abbrev tokens with their full name for matching
  const norm = normalize(q);
  return norm
    .split(" ")
    .map((tok) => {
      const upper = tok.toUpperCase();
      if (US_STATES[upper]) return US_STATES[upper];
      return tok;
    })
    .join(" ");
}

function cityMatchScore(city: City, query: string): number {
  const q = expandQueryTokens(query);
  if (!q) return 0;
  const cityName = normalize(city.name); // e.g. "pittsburgh  pa" -> "pittsburgh pa"
  const cityNameExpanded = expandQueryTokens(city.name);
  const country = normalize(city.country);
  const haystack = `${cityNameExpanded} ${country}`;

  // Pull the first word as the "base" city name (before comma/state)
  const baseCity = cityNameExpanded.split(" ")[0];
  const qBase = q.split(" ")[0];

  if (cityNameExpanded === q) return 100;
  if (cityNameExpanded.startsWith(q)) return 90;
  if (haystack.includes(q)) return 80;
  // Multi-token: every query token must appear in haystack
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => haystack.includes(t))) return 70;
  if (baseCity === qBase && q.length >= 3) return 60;
  if (baseCity.startsWith(qBase) && qBase.length >= 3) return 50;
  return 0;
}

export default function CitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [localMatches, setLocalMatches] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const { language } = useSettings();
  const { data: cities } = useCities();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      setLocalMatches([]);
      setIsOpen(false);
      return;
    }

    // Local DB matches (instant)
    const matches = (cities ?? [])
      .map((c) => ({ city: c, score: cityMatchScore(c, query) }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((m) => m.city);
    setLocalMatches(matches);
    if (matches.length > 0) setIsOpen(true);

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchCities(query);
      setResults(data);
      setIsOpen(data.length > 0 || matches.length > 0);
      setLoading(false);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, cities]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    setQuery("");
    setIsOpen(false);
    const label = result.state
      ? `${result.name}, ${result.state}, ${result.country}`
      : `${result.name}, ${result.country}`;
    navigate(`/search?lat=${result.lat}&lng=${result.lon}&name=${encodeURIComponent(label)}`);
  };

  const handleSelectLocal = (city: City) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/city/${city.id}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60 animate-spin" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(language, "searchPlaceholder")}
          className="w-full h-10 pl-10 pr-10 rounded-sm bg-card border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute z-[9999] top-full mt-1 w-full bg-card border border-border rounded-sm shadow-lg overflow-hidden">
          {localMatches.length > 0 && (
            <>
              <div className="px-3 py-1.5 bg-primary/5 border-b border-border/50">
                <span className="font-mono text-[9px] text-primary uppercase tracking-wider">
                  {t(language, "monitoredStations")}
                </span>
              </div>
              {localMatches.map((c) => (
                <button
                  key={`local-${c.id}`}
                  onClick={() => handleSelectLocal(c)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-primary/10 transition-colors border-b border-border/50"
                >
                  <Radio className="w-3 h-3 text-primary shrink-0" />
                  <span className="font-mono text-sm text-foreground truncate">{c.name}</span>
                  <span className="font-mono text-[10px] text-primary/70 ml-auto shrink-0">{c.country}</span>
                </button>
              ))}
              <div className="px-3 py-1.5 bg-secondary/30 border-b border-border/50">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                  {t(language, "otherResults")}
                </span>
              </div>
            </>
          )}
          {results.map((r, i) => {
            const label = r.state ? `${r.name}, ${r.state}` : r.name;
            return (
              <button
                key={`${r.lat}-${r.lon}-${i}`}
                onClick={() => handleSelect(r)}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-primary/10 transition-colors border-b border-border/50 last:border-b-0"
              >
                <MapPin className="w-3 h-3 text-primary shrink-0" />
                <span className="font-mono text-sm text-foreground truncate">{label}</span>
                <span className="font-mono text-[10px] text-muted-foreground ml-auto shrink-0">{r.country}</span>
              </button>
            );
          })}
        </div>
      )}
      {isOpen && results.length === 0 && localMatches.length > 0 && (
        <div className="absolute z-[9999] top-full mt-1 w-full bg-card border border-border rounded-sm shadow-lg overflow-hidden">
          <div className="px-3 py-1.5 bg-primary/5 border-b border-border/50">
            <span className="font-mono text-[9px] text-primary uppercase tracking-wider">
              {t(language, "monitoredStations")}
            </span>
          </div>
          {localMatches.map((c) => (
            <button
              key={`local-only-${c.id}`}
              onClick={() => handleSelectLocal(c)}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-primary/10 transition-colors border-b border-border/50 last:border-b-0"
            >
              <Radio className="w-3 h-3 text-primary shrink-0" />
              <span className="font-mono text-sm text-foreground truncate">{c.name}</span>
              <span className="font-mono text-[10px] text-primary/70 ml-auto shrink-0">{c.country}</span>
            </button>
          ))}
        </div>
      )}
      {isOpen && results.length === 0 && localMatches.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-[9999] top-full mt-1 w-full bg-card border border-border rounded-sm p-3 text-center">
          <span className="font-mono text-xs text-muted-foreground">{t(language, "searchNoResults")}</span>
        </div>
      )}
    </div>
  );
}
