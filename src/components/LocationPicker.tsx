"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

/**
 * Interactive map for picking lat/lng. Uses Leaflet + OpenStreetMap.
 *
 *  - Marker is draggable; releasing the drag fires `onChange(lat, lng)`.
 *  - Clicking on the map also moves the marker.
 *  - When `lat`/`lng` change externally (e.g. user types into the inputs),
 *    the marker re-centers.
 *
 * Uses a custom div icon so we don't need to ship Leaflet's default PNGs.
 */

// Cyber-themed custom marker — pulsing blue dot
const customIcon = L.divIcon({
  className: "ars-pin",
  html: `
    <div style="
      width: 20px;
      height: 20px;
      transform: translate(-50%, -50%);
      position: relative;
    ">
      <div style="
        position: absolute;
        inset: -10px;
        border-radius: 50%;
        background: radial-gradient(closest-side, rgba(35,72,212,0.45), transparent 70%);
        animation: ars-pin-pulse 1.6s ease-in-out infinite;
      "></div>
      <div style="
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: rgba(213, 224, 255, 0.95);
        border: 2px solid rgba(35, 72, 212, 0.9);
        box-shadow: 0 0 8px rgba(35, 72, 212, 0.7);
      "></div>
      <div style="
        position: absolute;
        left: 50%;
        top: 50%;
        width: 4px;
        height: 4px;
        transform: translate(-50%, -50%);
        background: rgba(2, 10, 24, 0.9);
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

export default function LocationPicker({ lat, lng, onChange }: Props) {
  // Re-mount the map if initial position is wildly different (rare)
  const initialCenter = useMemo<[number, number]>(() => [lat, lng], []);

  return (
    <div
      style={{
        position: "relative",
        height: 280,
        border: "1px solid rgba(213, 224, 255, 0.25)",
        background: "#020a18",
      }}
    >
      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        <DraggableMarker lat={lat} lng={lng} onChange={onChange} />
        <ClickToMove onChange={onChange} />
        <Recenter lat={lat} lng={lng} />
      </MapContainer>

      <div
        style={{
          position: "absolute",
          left: 8,
          bottom: 8,
          padding: "4px 8px",
          background: "rgba(2, 10, 24, 0.85)",
          border: "1px solid rgba(213, 224, 255, 0.2)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "rgba(213, 224, 255, 0.7)",
          pointerEvents: "none",
        }}
      >
        Arrastrá el pin · {lat.toFixed(5)}, {lng.toFixed(5)}
      </div>

      <style jsx global>{`
        @keyframes ars-pin-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        .leaflet-container {
          background: #020a18 !important;
          font-family: var(--font-mono) !important;
        }
        .leaflet-control-attribution {
          background: rgba(2, 10, 24, 0.8) !important;
          color: rgba(213, 224, 255, 0.5) !important;
          font-size: 9px !important;
          padding: 2px 6px !important;
          border: 1px solid rgba(213, 224, 255, 0.15) !important;
        }
        .leaflet-control-attribution a {
          color: rgba(35, 72, 212, 0.9) !important;
        }
      `}</style>
    </div>
  );
}

function DraggableMarker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);
  return (
    <Marker
      position={[lat, lng]}
      draggable
      icon={customIcon}
      ref={markerRef}
      eventHandlers={{
        dragend: () => {
          const m = markerRef.current;
          if (!m) return;
          const pos = m.getLatLng();
          onChange(pos.lat, pos.lng);
        },
      }}
    />
  );
}

function ClickToMove({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => onChange(e.latlng.lat, e.latlng.lng);
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onChange]);
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const last = useRef<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    if (
      !last.current ||
      Math.abs(last.current.lat - lat) > 0.0001 ||
      Math.abs(last.current.lng - lng) > 0.0001
    ) {
      const center = map.getCenter();
      const dist = map.distance(center, [lat, lng]);
      // Only fly if user-driven change is large (e.g. typed coords) to avoid
      // jitter while dragging.
      if (dist > 400) {
        map.setView([lat, lng], map.getZoom(), { animate: true });
      }
      last.current = { lat, lng };
    }
  }, [lat, lng, map]);
  return null;
}
