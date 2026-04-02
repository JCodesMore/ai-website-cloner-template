'use client';

import { useEffect, useRef } from 'react';

interface Project {
  id: number;
  name: string;
  city: string;
  country: string;
  type: string;
  price: string;
  status: string;
  statusColor: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  projects: Project[];
  selectedProject: Project;
  onSelect: (project: Project) => void;
}

export default function MapView({ projects, selectedProject, onSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current || mapInstanceRef.current) return;

      // Custom marker icon
      const createIcon = (color: string, isSelected: boolean) =>
        L.divIcon({
          className: '',
          html: `<div style="
            width: ${isSelected ? 36 : 28}px;
            height: ${isSelected ? 36 : 28}px;
            background: ${color};
            border: 3px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.5)'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            transition: all 0.2s;
          "></div>`,
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 36 : 28],
        });

      const map = L.map(mapRef.current, {
        center: [selectedProject.lat, selectedProject.lng],
        zoom: 5,
        zoomControl: true,
        attributionControl: false,
      });

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      projects.forEach((p) => {
        const isSelected = p.id === selectedProject.id;
        const marker = L.marker([p.lat, p.lng], {
          icon: createIcon(isSelected ? '#024ffd' : 'rgba(2,79,253,0.6)', isSelected),
        })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: Helvetica, sans-serif; min-width: 160px;">
              <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${p.name}</div>
              <div style="font-size: 12px; color: #666; margin-bottom: 6px;">📍 ${p.city}, ${p.country}</div>
              <div style="font-size: 12px; font-weight: 700; color: #024ffd;">${p.price}</div>
            </div>
          `, { closeButton: false });

        marker.on('click', () => onSelect(p));
        markersRef.current.push(marker);
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan to selected project when it changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current as { flyTo: (latlng: [number, number], zoom: number) => void };
    map.flyTo([selectedProject.lat, selectedProject.lng], 8);
  }, [selectedProject]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#0d0d1a' }} />
  );
}
