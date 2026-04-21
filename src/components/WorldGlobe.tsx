import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as topojson from "topojson-client";
import * as THREE from "three";
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
// Admin-1 (states/provinces) — Natural Earth via simplified GeoJSON CDN
const ADMIN1_GEOJSON =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson";

export default function WorldGlobe({ cities, weatherData }: WorldGlobeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const navigate = useNavigate();
  const { formatTemp } = useSettings();
  const [size, setSize] = useState({ w: 800, h: 550 });
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [admin1, setAdmin1] = useState<any[]>([]);
  const [altitude, setAltitude] = useState<number>(1.8);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);

  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: "#0a1419",
        emissive: "#03161a",
        shininess: 4,
      }),
    []
  );

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

  // Load admin-1 (states/provinces) — only fetched once
  useEffect(() => {
    let cancelled = false;
    fetch(ADMIN1_GEOJSON)
      .then((r) => r.json())
      .then((geo: any) => {
        if (cancelled) return;
        setAdmin1(geo.features ?? []);
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
    // Track altitude so we can toggle layers/labels based on zoom
    let raf = 0;
    const tick = () => {
      const pov = g.pointOfView();
      if (pov?.altitude != null) setAltitude(pov.altitude);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

  // Merge country + admin-1 polygons. Admin-1 only included when zoomed in.
  const showAdmin1 = altitude < 1.4;
  const polygons = useMemo(() => {
    const tagged = countries.map((c) => ({ ...c, __kind: "country" }));
    if (!showAdmin1) return tagged;
    const states = admin1.map((s) => ({ ...s, __kind: "admin1" }));
    return [...tagged, ...states];
  }, [countries, admin1, showAdmin1]);

  // Label data: country names always; state names when zoomed in.
  const labels = useMemo(() => {
    const countryLabels = countries
      .filter((c: any) => c.properties?.name)
      .map((c: any) => {
        // Use first coord of first polygon ring as a rough centroid
        const geom = c.geometry;
        const coords =
          geom?.type === "Polygon"
            ? geom.coordinates?.[0]
            : geom?.coordinates?.[0]?.[0];
        if (!coords?.length) return null;
        let lng = 0;
        let lat = 0;
        for (const [x, y] of coords) {
          lng += x;
          lat += y;
        }
        lng /= coords.length;
        lat /= coords.length;
        return {
          lat,
          lng,
          text: String(c.properties.name).toUpperCase(),
          kind: "country" as const,
        };
      })
      .filter(Boolean) as Array<{ lat: number; lng: number; text: string; kind: "country" | "admin1" }>;

    if (altitude > 1.0) return countryLabels;

    const stateLabels = admin1
      .filter((s: any) => s.properties?.name && s.properties?.latitude && s.properties?.longitude)
      .map((s: any) => ({
        lat: Number(s.properties.latitude),
        lng: Number(s.properties.longitude),
        text: String(s.properties.name),
        kind: "admin1" as const,
      }));
    return [...countryLabels, ...stateLabels];
  }, [countries, admin1, altitude]);

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
        globeMaterial={globeMaterial}
        // Country + admin-1 polygons — cyan outlines, dark fill
        polygonsData={polygons}
        polygonCapColor={(d: any) =>
          d.__kind === "admin1" ? "rgba(15, 30, 38, 0)" : "rgba(15, 30, 38, 0.85)"
        }
        polygonSideColor={() => "rgba(0, 224, 198, 0.05)"}
        polygonStrokeColor={(d: any) =>
          d.__kind === "admin1"
            ? "rgba(0, 224, 198, 0.35)"
            : "rgba(0, 224, 198, 0.55)"
        }
        polygonAltitude={(d: any) => (d.__kind === "admin1" ? 0.006 : 0.005)}
        // Country / state labels — country always, state when zoomed in
        labelsData={labels}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => d.text}
        labelSize={(d: any) => (d.kind === "country" ? 0.55 : 0.32)}
        labelDotRadius={0}
        labelColor={(d: any) =>
          d.kind === "country" ? "rgba(0, 224, 198, 0.85)" : "rgba(180, 230, 230, 0.7)"
        }
        labelResolution={2}
        labelAltitude={0.012}
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
        <div className="absolute top-2 left-20 px-2 py-1 rounded-sm bg-background/80 border border-border pointer-events-none">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">
            Tracking: {hoveredCity.name}
          </span>
        </div>
      )}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => handleZoom(0.7)}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-background/80 border border-primary/40 hover:border-primary hover:bg-background text-primary font-mono text-base leading-none transition-colors"
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => handleZoom(1.4)}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-background/80 border border-primary/40 hover:border-primary hover:bg-background text-primary font-mono text-base leading-none transition-colors"
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
      </div>
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
