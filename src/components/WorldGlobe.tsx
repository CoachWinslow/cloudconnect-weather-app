import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as topojson from "topojson-client";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import type { City } from "@/data/cities";

interface WorldGlobeProps {
  cities: City[];
  weatherData: Record<string, { temp: number; icon: string } | undefined>;
}

interface CountryFeature {
  type: "Feature";
  properties: { name: string };
  geometry: any;
}

const WORLD_ATLAS = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function WorldGlobe({ cities, weatherData }: WorldGlobeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const navigate = useNavigate();
  const { formatTemp } = useSettings();
  const [size, setSize] = useState({ w: 800, h: 550 });
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);

  // Resize observer
  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load country polygons
  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_ATLAS)
      .then((r) => r.json())
      .then((world: any) => {
        if (cancelled) return;
        const fc = topojson.feature(world, world.objects.countries) as any;
        setCountries(fc.features as CountryFeature[]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const DEFAULT_POV = { lat: 25, lng: -60, altitude: 1.8 } as const;

  // Initial camera + controls
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView(DEFAULT_POV, 0);
    const controls: any = g.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableZoom = true;
      controls.minDistance = 180;
      controls.maxDistance = 600;
      controls.rotateSpeed = 0.6;
      // Clamp vertical drag so the user can't flip past the poles into empty space
      controls.minPolarAngle = 0.35; // ~20° from top
      controls.maxPolarAngle = Math.PI - 0.35; // ~20° from bottom
    }
  }, [size.w, size.h]);

  const handleReset = () => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView(DEFAULT_POV, 900);
  };

  const handleZoom = (factor: number) => {
    const g = globeRef.current;
    if (!g) return;
    const pov = g.pointOfView();
    const next = Math.min(4, Math.max(0.5, (pov.altitude ?? 1.8) * factor));
    g.pointOfView({ altitude: next }, 350);
  };

  const points = useMemo(
    () =>
      cities.map((c) => ({
        ...c,
        weather: weatherData[c.id],
      })),
    [cities, weatherData]
  );

  return (
    <div
      ref={wrapperRef}
      className="w-full h-[600px] md:h-[800px] rounded-md glow-border overflow-hidden bg-card relative"
    >
      <Globe
        ref={globeRef as any}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#00e0c6"
        atmosphereAltitude={0.18}
        // Solid dark globe (no texture) — matches Carto dark aesthetic
        globeMaterial={
          {
            color: "#0a1419",
            emissive: "#03161a",
            shininess: 4,
          } as any
        }
        // Country polygons — cyan outline + dark fill
        polygonsData={countries}
        polygonCapColor={() => "rgba(15, 30, 38, 0.85)"}
        polygonSideColor={() => "rgba(0, 224, 198, 0.05)"}
        polygonStrokeColor={() => "rgba(0, 224, 198, 0.45)"}
        polygonAltitude={0.005}
        // Glowing pulse markers for cities
        ringsData={points}
        ringLat={(d: any) => d.lat}
        ringLng={(d: any) => d.lng}
        ringMaxRadius={2.2}
        ringPropagationSpeed={1.4}
        ringRepeatPeriod={1600}
        ringColor={() => (t: number) => `rgba(0, 224, 198, ${1 - t})`}
        // Solid core dot for each city
        pointsData={points}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointColor={() => "#00e0c6"}
        pointAltitude={0.01}
        pointRadius={0.4}
        pointResolution={12}
        onPointClick={(d: any) => {
          const g = globeRef.current;
          if (g) {
            g.pointOfView(
              { lat: d.lat, lng: d.lng, altitude: 0.8 },
              900
            );
          }
          window.setTimeout(() => navigate(`/city/${d.id}`), 950);
        }}
        onPointHover={(d: any) => setHoveredCity(d ?? null)}
        pointLabel={(d: any) => {
          const c = d as City & { weather?: { temp: number; icon: string } };
          const tempBlock = c.weather
            ? `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
                 <img src="https://openweathermap.org/img/wn/${c.weather.icon}.png" width="28" height="28" />
                 <span style="font-size:18px;font-weight:700;font-family:JetBrains Mono,monospace;color:hsl(170,100%,45%);">${formatTemp(c.weather.temp)}</span>
               </div>`
            : `<span style="color:#666;font-size:10px;font-family:JetBrains Mono,monospace;">ACQUIRING...</span>`;
          const emoji =
            c.connection.emoji.startsWith("/assets/") || c.connection.emoji.startsWith("http")
              ? `<img src="${c.connection.emoji}" width="20" height="20" style="display:inline-block;vertical-align:middle;margin-right:4px;" />`
              : c.connection.emoji;
          return `
            <div style="background:hsl(200 30% 8%);border:1px solid hsl(170 100% 45% / 0.4);border-radius:4px;padding:10px 12px;min-width:160px;font-family:Space Grotesk,sans-serif;color:hsl(180,20%,90%);box-shadow:0 0 18px hsl(170 100% 45% / 0.25);">
              <div style="font-weight:600;font-size:13px;">${emoji} ${c.name}</div>
              <div style="font-size:10px;color:hsl(200,15%,50%);margin-top:2px;font-family:JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:0.05em;">${c.country}</div>
              ${tempBlock}
              <div style="font-size:9px;color:hsl(170,100%,45%);margin-top:8px;font-weight:500;font-family:JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:0.1em;">Click to access →</div>
            </div>`;
        }}
      />
      {hoveredCity && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-sm bg-background/80 border border-border pointer-events-none">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">
            Tracking: {hoveredCity.name}
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={handleReset}
        className="absolute top-2 right-2 px-2.5 py-1 rounded-sm bg-background/80 border border-primary/40 hover:border-primary hover:bg-background text-primary font-mono text-[10px] uppercase tracking-wider transition-colors"
        aria-label="Reset globe view"
      >
        ⟲ Reset View
      </button>
    </div>
  );
}
