import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cities, City } from "@/data/cities";
import { useNavigate } from "react-router-dom";

interface WorldMapProps {
  weatherData: Record<string, { temp: number; icon: string } | undefined>;
}

export default function WorldMap({ weatherData }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, -40],
      zoom: 3,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    cities.forEach((city) => {
      const marker = L.marker([city.lat, city.lng], {
        icon: L.divIcon({
          className: "city-marker pulse",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(map);

      marker.on("click", () => {
        navigate(`/city/${city.id}`);
      });

      // Create popup
      const updatePopup = () => {
        const w = weatherData[city.id];
        const tempHtml = w
          ? `<div style="display:flex;align-items:center;gap:4px;margin-top:4px;">
              <img src="https://openweathermap.org/img/wn/${w.icon}.png" width="30" height="30" />
              <span style="font-size:18px;font-weight:600;font-family:Space Grotesk,sans-serif;">${w.temp}°F</span>
            </div>`
          : `<span style="color:#999;font-size:12px;">Loading...</span>`;

        marker.bindPopup(
          `<div style="padding:12px 14px;min-width:140px;">
            <div style="font-family:Space Grotesk,sans-serif;font-weight:600;font-size:14px;">${city.connection.emoji} ${city.name}</div>
            <div style="font-size:11px;color:#888;margin-top:2px;">${city.country}</div>
            ${tempHtml}
            <div style="font-size:11px;color:hsl(187,70%,38%);margin-top:6px;cursor:pointer;font-weight:500;">Click to explore →</div>
          </div>`,
          { closeButton: false, offset: [0, -4] }
        );
      };

      updatePopup();
      marker.on("mouseover", () => {
        updatePopup();
        marker.openPopup();
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [navigate, weatherData]);

  // Update popups when weather data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    // Popups will update on next hover
  }, [weatherData]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] md:h-[600px] rounded-lg border border-border shadow-lg"
    />
  );
}
