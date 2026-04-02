'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const projects = [
  { id: 1, name: 'One Park Tower', city: 'Buenos Aires', country: 'Argentina', type: 'Residencial Premium', price: 'USD 150,000', status: 'En Construcción', statusColor: '#024ffd', lat: -34.6037, lng: -58.3816 },
  { id: 2, name: 'Brickell Heights', city: 'Miami', country: 'USA', type: 'Residencial Lujo', price: 'USD 490,000', status: 'Pre-venta', statusColor: '#22c55e', lat: 25.7617, lng: -80.1918 },
  { id: 3, name: 'Bosque Real', city: 'Ciudad de México', country: 'México', type: 'Mixto', price: 'USD 210,000', status: 'En Construcción', statusColor: '#024ffd', lat: 19.4326, lng: -99.1332 },
  { id: 4, name: 'Smart Living Bogotá', city: 'Bogotá', country: 'Colombia', type: 'Residencial', price: 'USD 120,000', status: 'Pre-venta', statusColor: '#22c55e', lat: 4.711, lng: -74.0721 },
  { id: 5, name: 'Residencias Madrid', city: 'Madrid', country: 'España', type: 'Residencial', price: 'EUR 280,000', status: 'Entrega Inmediata', statusColor: '#f59e0b', lat: 40.4168, lng: -3.7038 },
  { id: 6, name: 'Porto Living', city: 'Porto', country: 'Portugal', type: 'Residencial', price: 'EUR 220,000', status: 'En Construcción', statusColor: '#024ffd', lat: 41.1579, lng: -8.6291 },
  { id: 7, name: 'Panama Bay Towers', city: 'Ciudad de Panamá', country: 'Panamá', type: 'Residencial Lujo', price: 'USD 180,000', status: 'Pre-venta', statusColor: '#22c55e', lat: 8.9936, lng: -79.5197 },
  { id: 8, name: 'Tbilisi Heights', city: 'Tiflis', country: 'Georgia', type: 'Residencial', price: 'USD 80,000', status: 'En Construcción', statusColor: '#024ffd', lat: 41.6938, lng: 44.8015 },
];

export default function NuevasConstruccionesPage() {
  const [selected, setSelected] = useState(projects[0]);

  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#0d0d0d', minHeight: 'calc(100vh - 64px)', padding: '60px 32px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>OPORTUNIDADES ACTIVAS</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#efefef', marginBottom: 0 }}>Nuevas Construcciones</h1>
          <div style={{ height: 3, width: 56, background: '#024ffd', marginTop: 12 }} />
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(239,239,239,0.5)', maxWidth: 600 }}>
            Seleccioná un proyecto para ver su ubicación en el mapa. Hacé click en los marcadores para más información.
          </p>
        </div>

        {/* Content: cards + map */}
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 620, overflowY: 'auto', paddingRight: 6 }}>
            {projects.map((p) => {
              const isSelected = selected.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  style={{
                    background: isSelected ? 'rgba(2,79,253,0.12)' : '#1a1a2e',
                    border: isSelected ? '1px solid #024ffd' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 8,
                    padding: '16px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#efefef', marginBottom: 3 }}>{p.name}</h3>
                      <p style={{ fontSize: 12, color: 'rgba(239,239,239,0.45)' }}>📍 {p.city}, {p.country}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: p.statusColor, background: `${p.statusColor}22`, border: `1px solid ${p.statusColor}44`, borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                      {p.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(239,239,239,0.35)', marginBottom: 2, letterSpacing: '0.05em' }}>TIPO</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#efefef' }}>{p.type}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: 'rgba(239,239,239,0.35)', marginBottom: 2, letterSpacing: '0.05em' }}>PRECIO INICIAL</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#024ffd' }}>{p.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map */}
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(2,79,253,0.3)', height: 620, position: 'sticky', top: 80 }}>
            <MapView projects={projects} selectedProject={selected} onSelect={setSelected} />
          </div>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #1a1a2e; }
        ::-webkit-scrollbar-thumb { background: #024ffd; border-radius: 3px; }
      `}</style>
    </main>
  );
}
