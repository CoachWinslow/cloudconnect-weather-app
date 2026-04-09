import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import type { City } from "@/data/cities";

interface WorldMapProps {
  cities: City[];
  weatherData: Record<string, { temp: number; icon: string } | undefined>;
}

export default function WorldMap({ cities, weatherData }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const { formatTemp } = useSettings();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [25, -60],
      zoom: 3,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    const darkLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    });

    const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });

    let switchedToOsm = false;
    darkLayer.on("tileerror", () => {
      if (switchedToOsm) return;
      switchedToOsm = true;
      map.removeLayer(darkLayer);
      osmLayer.addTo(map);
    });

    darkLayer.addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Expose navigate for popup onclick
  useEffect(() => {
    (window as any).__navigateToCity = (cityId: string) => {
      navigate(`/city/${cityId}`);
    };
    return () => { delete (window as any).__navigateToCity; };
  }, [navigate]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !cities.length) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    const markerIcon = L.divIcon({
      className: "city-marker pulse",
      html: '<span class="city-marker__core" aria-hidden="true"></span>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    cities.forEach((city) => {
      const marker = L.marker([city.lat, city.lng], {
        icon: markerIcon,
      }).addTo(map);

      marker.on("click", () => {
        navigate(`/city/${city.id}`);
      });

      const w = weatherData[city.id];
      const tempHtml = w
        ? `<div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
            <img src="https://openweathermap.org/img/wn/${w.icon}.png" width="28" height="28" />
            <span style="font-size:18px;font-weight:700;font-family:JetBrains Mono,monospace;color:hsl(170,100%,45%);">${formatTemp(w.temp)}</span>
          </div>`
        : `<span style="color:#666;font-size:10px;font-family:JetBrains Mono,monospace;">ACQUIRING...</span>`;

      marker.bindPopup(
        `<div style="padding:10px 12px;min-width:150px;cursor:pointer;" onclick="window.__navigateToCity('${city.id}')">
          <div style="font-family:Space Grotesk,sans-serif;font-weight:600;font-size:13px;color:hsl(180,20%,90%);">${city.connection.emoji} ${city.name}</div>
          <div style="font-size:10px;color:hsl(200,15%,50%);margin-top:2px;font-family:JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:0.05em;">${city.country}</div>
          ${tempHtml}
          <div style="font-size:9px;color:hsl(170,100%,45%);margin-top:8px;cursor:pointer;font-weight:500;font-family:JetBrains Mono,monospace;text-transform:uppercase;letter-spacing:0.1em;">Access Data →</div>
        </div>`,
        { closeButton: false, offset: [0, -14] }
      );

      marker.on("mouseover", () => marker.openPopup());
    });
  }, [cities, weatherData, navigate, formatTemp]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[450px] md:h-[550px] rounded-md glow-border"
    />
  );
}
