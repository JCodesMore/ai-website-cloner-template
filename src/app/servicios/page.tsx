'use client';

import Link from 'next/link';

const investorServices = [
  {
    icon: '📈',
    title: 'Alternativas de inversión en Real Estate',
    desc: 'Acceso a un portafolio diversificado de oportunidades inmobiliarias en América, Europa y Asia. Analizamos cada proyecto para garantizar rendimientos seguros y competitivos adaptados a tu perfil inversor.',
  },
  {
    icon: '🏗️',
    title: 'Acompañamiento y formación de estructuras',
    desc: 'Te acompañamos en todo el proceso de estructuración de tu inversión: desde la selección del activo hasta la firma, con asesoramiento legal, financiero y comercial en cada etapa.',
  },
];

const developerServices = [
  {
    icon: '📋',
    title: 'Armado de un plan de negocios',
    desc: 'Desarrollamos estrategias comerciales personalizadas para tu proyecto inmobiliario: análisis de mercado, pricing, posicionamiento y plan de ventas para maximizar resultados.',
  },
  {
    icon: '👥',
    title: 'Capacitación para el equipo comercial',
    desc: 'Nos especializamos en formar equipos de alto rendimiento. Entrenamos a tus vendedores con técnicas avanzadas de negociación, conocimiento de producto y cierre de ventas en el sector inmobiliario.',
  },
  {
    icon: '🎯',
    title: 'Servicio de exclusividad de comercialización',
    desc: 'Gestionamos la comercialización exclusiva de tu proyecto inmobiliario. Nuestro equipo calificado se encarga de toda la estrategia de ventas, marketing y atención a compradores.',
  },
];

export default function ServiciosPage() {
  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#101010', minHeight: 'calc(100vh - 64px)', padding: '60px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>LO QUE HACEMOS</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#efefef' }}>Nuestros Servicios</h1>
          <div style={{ height: 3, width: 56, background: '#024ffd', marginTop: 12 }} />
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(239,239,239,0.5)', maxWidth: 580 }}>
            Asesoramiento para inversores y desarrolladores en Real Estate. Soluciones adaptadas a cada cliente en el mercado inmobiliario global.
          </p>
        </div>

        {/* Para Inversores */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ height: 2, width: 32, background: '#024ffd' }} />
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#024ffd', letterSpacing: '0.12em' }}>PARA INVERSORES</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {investorServices.map((s, i) => (
              <div key={i}
                style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 10, padding: 36, transition: 'all 0.25s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#024ffd'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.background = 'rgba(2,79,253,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(2,79,253,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1a1a2e'; }}>
                <div style={{ fontSize: 44, marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#024ffd', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.65)', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Para Desarrolladores */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ height: 2, width: 32, background: '#024ffd' }} />
            <h2 style={{ fontSize: 13, fontWeight: 700, color: '#024ffd', letterSpacing: '0.12em' }}>PARA DESARROLLADORES</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {developerServices.map((s, i) => (
              <div key={i}
                style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 10, padding: 36, transition: 'all 0.25s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#024ffd'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.background = 'rgba(2,79,253,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(2,79,253,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#1a1a2e'; }}>
                <div style={{ fontSize: 44, marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#024ffd', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.65)', lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '56px 32px', background: 'rgba(2,79,253,0.06)', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 12 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#efefef', marginBottom: 12 }}>¿Listo para empezar?</h2>
          <p style={{ fontSize: 14, color: 'rgba(239,239,239,0.55)', marginBottom: 28 }}>Contactanos y te asesoramos sin compromiso.</p>
          <Link href="/contacto" style={{ background: '#024ffd', color: '#101010', padding: '13px 36px', fontSize: 13, fontWeight: 800, borderRadius: 4, textDecoration: 'none', letterSpacing: '0.08em' }}>
            CONTACTAR AHORA
          </Link>
        </div>
      </div>
    </main>
  );
}
