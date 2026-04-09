import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchCities, GeocodingResult } from "@/services/geocodingService";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/i18n/translations";

export default function CitySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const { language } = useSettings();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchCities(query);
      setResults(data);
      setIsOpen(data.length > 0);
      setLoading(false);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-sm shadow-lg overflow-hidden">
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
      {isOpen && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-sm p-3 text-center">
          <span className="font-mono text-xs text-muted-foreground">{t(language, "searchNoResults")}</span>
        </div>
      )}
    </div>
  );
}
