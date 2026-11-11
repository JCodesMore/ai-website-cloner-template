"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { placeName } from "./subpage-parts";

type Props = { locations: Record<string, [number, number]> };

/**
 * map.js from the source: grayscale OSM tiles centred on Sri Lanka, a marker per stop and
 * a closed loop of blue route segments, each ending in an arrowhead.
 */
export function TourMap({ locations }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    (async () => {
      const L = (await import("leaflet")).default;
      (window as unknown as { L: typeof L }).L = L;
      await import("leaflet-polylinedecorator");
      if (cancelled || !ref.current) return;

      const map = L.map(ref.current).setView([7.8731, 80.7718], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "Map data &copy; <span>Vidura Vishwanath Hemawansa</span>",
      }).addTo(map);

      const icon = L.icon({
        iconUrl: "/sites/showlanka/images/location-dot-solid.svg",
        iconSize: [28, 28],
        iconAnchor: [19, 28],
        popupAnchor: [0, -28],
      });
      const keys = Object.keys(locations);
      for (const key of keys) {
        L.marker(locations[key], { icon }).addTo(map).bindPopup(placeName(key));
      }
      keys.forEach((key, i) => {
        const route = [locations[key], locations[keys[(i + 1) % keys.length]]];
        const line = L.polyline(route, { color: "#1b78ce" }).addTo(map);
        L.polylineDecorator(line, {
          patterns: [
            {
              offset: "100%",
              repeat: 0,
              symbol: L.Symbol.arrowHead({ pixelSize: 12, polygon: false, pathOptions: { stroke: true, color: "#1b78ce" } }),
            },
          ],
        }).addTo(map);
      });
      cleanup = () => map.remove();
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [locations]);

  return <div id="map" ref={ref} />;
}
