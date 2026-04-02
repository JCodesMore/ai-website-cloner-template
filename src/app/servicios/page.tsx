const services = [
  { icon: '💼', title: 'Asesoramiento en Inversiones', desc: 'Acceso a carteras diversificadas en mercados de América, Europa y Asia con rendimientos comprobados. Analizamos cada oportunidad para maximizar tu retorno.' },
  { icon: '📊', title: 'Consultoría Comercial', desc: 'Estrategias comerciales personalizadas para optimizar la gestión y acelerar las ventas de proyectos inmobiliarios en cualquier mercado.' },
  { icon: '👥', title: 'Capacitación de Equipos', desc: 'Formamos vendedores de alto rendimiento con herramientas avanzadas de comercialización, técnicas de negociación y conocimiento de mercado.' },
  { icon: '🎯', title: 'Comercialización Exclusiva', desc: 'Somos expertos en la venta de proyectos inmobiliarios con un equipo altamente calificado y amplia experiencia en el sector.' },
  { icon: '🌍', title: 'Expansión Internacional', desc: 'Acompañamos a desarrolladores y fondos de inversión en su expansión a nuevos mercados globales, gestionando alianzas y estrategias locales.' },
  { icon: '📋', title: 'Estructuración de Proyectos', desc: 'Ayudamos a estructurar proyectos inmobiliarios desde su concepción hasta su lanzamiento, optimizando cada etapa del proceso.' },
];

export default function ServiciosPage() {
  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#101010', minHeight: 'calc(100vh - 64px)', padding: '60px 32px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>LO QUE HACEMOS</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#efefef' }}>Nuestros Servicios</h1>
          <div style={{ height: 3, width: 56, background: '#024ffd', marginTop: 12 }} />
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(239,239,239,0.5)', maxWidth: 580 }}>
            Ofrecemos soluciones integrales para inversores, desarrolladores y equipos de ventas en los principales mercados inmobiliarios del mundo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {services.map((s, i) => (
            <div
              key={i}
              style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 10, padding: 36, transition: 'all 0.25s', cursor: 'default' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#024ffd'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.background = 'rgba(2,79,253,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(2,79,253,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1a1a2e'; }}
            >
              <div style={{ fontSize: 48, marginBottom: 20 }}>{s.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#024ffd', marginBottom: 12, letterSpacing: '0.02em' }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.65)', lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 72, textAlign: 'center', padding: '56px 32px', background: 'rgba(2,79,253,0.06)', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 12 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#efefef', marginBottom: 12 }}>¿Listo para empezar?</h2>
          <p style={{ fontSize: 14, color: 'rgba(239,239,239,0.55)', marginBottom: 28 }}>Contactanos y te asesoramos sin compromiso.</p>
          <a href="/contacto" style={{ background: '#024ffd', color: '#101010', padding: '13px 36px', fontSize: 13, fontWeight: 800, borderRadius: 4, textDecoration: 'none', letterSpacing: '0.08em' }}>
            CONTACTAR AHORA
          </a>
        </div>
      </div>
    </main>
  );
}
