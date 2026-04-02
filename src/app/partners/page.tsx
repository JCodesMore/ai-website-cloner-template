const partners = [
  { name: 'FSR', region: 'Argentina', desc: 'Desarrolladora líder en el mercado residencial premium de Buenos Aires.' },
  { name: 'Gesmar', region: 'Argentina', desc: 'Especialistas en comercialización y gestión de proyectos inmobiliarios.' },
  { name: 'Metro Cúbico', region: 'México', desc: 'Plataforma líder de búsqueda y venta de inmuebles en México.' },
  { name: 'Forest', region: 'Brasil', desc: 'Desarrolladora enfocada en proyectos sostenibles y de alto valor.' },
  { name: 'Floripa', region: 'Brasil', desc: 'Referente en el mercado inmobiliario de Florianópolis y Santa Catarina.' },
  { name: 'Q Group', region: 'Panamá', desc: 'Grupo desarrollador con proyectos residenciales y comerciales en Centroamérica.' },
  { name: 'Fortune', region: 'UAE', desc: 'Bróker internacional con presencia en los Emiratos Árabes y Asia.' },
  { name: 'American Homes', region: 'USA', desc: 'Agencia especializada en propiedades residenciales en el mercado americano.' },
  { name: 'Petra Urbana', region: 'España', desc: 'Promotora inmobiliaria con proyectos en las principales ciudades españolas.' },
];

export default function PartnersPage() {
  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#101010', minHeight: 'calc(100vh - 64px)', padding: '60px 32px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>ALIANZAS ESTRATÉGICAS</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#efefef' }}>Nuestros Partners</h1>
          <div style={{ height: 3, width: 56, background: '#024ffd', marginTop: 12 }} />
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(239,239,239,0.5)', maxWidth: 580 }}>
            Trabajamos con líderes internacionales del mercado inmobiliario para ofrecerte las mejores oportunidades.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {partners.map((p) => (
            <div
              key={p.name}
              style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.15)', borderRadius: 10, padding: '32px 28px', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#024ffd'; e.currentTarget.style.background = 'rgba(2,79,253,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(2,79,253,0.15)'; e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 48, height: 48, background: 'rgba(2,79,253,0.15)', border: '1px solid rgba(2,79,253,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#024ffd', letterSpacing: '0.05em' }}>{p.name.slice(0, 2)}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#efefef', marginBottom: 4 }}>{p.name}</h3>
              <p style={{ fontSize: 11, color: '#024ffd', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 12 }}>{p.region}</p>
              <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.5)', lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Become a partner CTA */}
        <div style={{ marginTop: 72, textAlign: 'center', padding: '56px 32px', background: 'rgba(2,79,253,0.06)', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 12 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#efefef', marginBottom: 12 }}>¿Querés ser nuestro partner?</h2>
          <p style={{ fontSize: 14, color: 'rgba(239,239,239,0.55)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Si sos desarrollador, bróker o inversora y querés sumar tu empresa a nuestra red global, contactanos.
          </p>
          <a href="/contacto" style={{ background: '#024ffd', color: '#101010', padding: '13px 36px', fontSize: 13, fontWeight: 800, borderRadius: 4, textDecoration: 'none', letterSpacing: '0.08em' }}>
            SUMATE A LA RED
          </a>
        </div>
      </div>
    </main>
  );
}
