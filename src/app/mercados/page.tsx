const markets = [
  { name: 'Argentina', region: 'América del Sur', flag: '🇦🇷', detail: 'Buenos Aires, Córdoba, Rosario' },
  { name: 'Brasil', region: 'América del Sur', flag: '🇧🇷', detail: 'São Paulo, Río de Janeiro, Florianópolis' },
  { name: 'Colombia', region: 'América del Sur', flag: '🇨🇴', detail: 'Bogotá, Medellín, Cartagena' },
  { name: 'Paraguay', region: 'América del Sur', flag: '🇵🇾', detail: 'Asunción, Ciudad del Este' },
  { name: 'USA', region: 'América del Norte', flag: '🇺🇸', detail: 'Miami, New York, Orlando' },
  { name: 'México', region: 'América del Norte', flag: '🇲🇽', detail: 'CDMX, Cancún, Monterrey' },
  { name: 'Panamá', region: 'América Central', flag: '🇵🇦', detail: 'Ciudad de Panamá' },
  { name: 'España', region: 'Europa', flag: '🇪🇸', detail: 'Madrid, Barcelona, Valencia' },
  { name: 'Portugal', region: 'Europa', flag: '🇵🇹', detail: 'Lisboa, Porto, Algarve' },
  { name: 'Italia', region: 'Europa', flag: '🇮🇹', detail: 'Milán, Roma, Florencia' },
  { name: 'Emiratos Árabes', region: 'Medio Oriente', flag: '🇦🇪', detail: 'Dubai, Abu Dhabi' },
  { name: 'Georgia', region: 'Asia / Europa', flag: '🇬🇪', detail: 'Tiflis, Batumi' },
];

const regions = ['Todos', 'América del Sur', 'América del Norte', 'América Central', 'Europa', 'Medio Oriente', 'Asia / Europa'];

export default function MercadosPage() {
  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#0d0d0d', minHeight: 'calc(100vh - 64px)', padding: '60px 32px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>PRESENCIA INTERNACIONAL</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#efefef' }}>Mercados Globales</h1>
          <div style={{ height: 3, width: 56, background: '#024ffd', marginTop: 12 }} />
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(239,239,239,0.5)', maxWidth: 580 }}>
            Presencia estratégica en 12 países con alianzas de brokers y desarrolladores de prestigio internacional.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 56 }}>
          {[
            { value: '12', label: 'Países' },
            { value: '4', label: 'Continentes' },
            { value: '340+', label: 'Proyectos' },
            { value: '94%', label: 'Retención' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 10, padding: '28px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 40, fontWeight: 800, color: '#024ffd', marginBottom: 6 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: 'rgba(239,239,239,0.5)', letterSpacing: '0.05em' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Market grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
          {markets.map((m) => (
            <div
              key={m.name}
              style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.15)', borderRadius: 10, padding: '24px 20px', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#024ffd'; e.currentTarget.style.background = 'rgba(2,79,253,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(2,79,253,0.15)'; e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{m.flag}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#efefef', marginBottom: 4 }}>{m.name}</h3>
              <p style={{ fontSize: 11, color: '#024ffd', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>{m.region}</p>
              <p style={{ fontSize: 12, color: 'rgba(239,239,239,0.45)', lineHeight: 1.5 }}>{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
