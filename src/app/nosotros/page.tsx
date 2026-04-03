import Link from 'next/link';

const values = [
  { icon: '⭐', title: 'Excelencia', desc: 'Brindamos servicios de consultoría de alta calidad que superan las expectativas de nuestros clientes.' },
  { icon: '🤝', title: 'Profesionalismo', desc: 'Actuamos con integridad, ética y respeto hacia clientes y socios en cada interacción.' },
  { icon: '🎯', title: 'Enfoque en el cliente', desc: 'Centramos las necesidades del cliente en todas nuestras acciones con soluciones a medida.' },
  { icon: '💡', title: 'Innovación', desc: 'Buscamos continuamente nuevas ideas para mejorar nuestros servicios y mantener el liderazgo.' },
  { icon: '🌐', title: 'Colaboración', desc: 'Fomentamos el trabajo en equipo internamente y con partners para construir relaciones sólidas.' },
];

export default function NosotrosPage() {
  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#101010', minHeight: 'calc(100vh - 64px)', padding: '60px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>QUIÉNES SOMOS</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#efefef' }}>Nosotros</h1>
          <div style={{ height: 3, width: 56, background: '#024ffd', marginTop: 12 }} />
        </div>

        {/* About + CEO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 72, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#efefef', marginBottom: 20, lineHeight: 1.2 }}>
              Consultoría comercial especializada en Real Estate
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(239,239,239,0.65)', lineHeight: 1.85, marginBottom: 16 }}>
              Lion Global Sales Consulting es una firma de consultoría comercial especializada en el mercado inmobiliario. Ofrecemos un conjunto completo de soluciones que responden a los desafíos y requerimientos de inversores y desarrolladores, respaldados por una amplia experiencia en el sector.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(239,239,239,0.65)', lineHeight: 1.85 }}>
              Nuestra presencia en más de 12 países de América, Europa y Asia nos permite conectar oportunidades globales con inversores locales, generando valor real en cada operación.
            </p>
          </div>

          {/* CEO Card */}
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.25)', borderRadius: 12, padding: 36 }}>
            <div style={{ width: 72, height: 72, background: 'rgba(2,79,253,0.15)', border: '2px solid #024ffd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 20 }}>
              👤
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#efefef', marginBottom: 4 }}>Alan Yorno</h3>
            <p style={{ fontSize: 12, color: '#024ffd', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>CEO & FUNDADOR</p>
            <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.6)', lineHeight: 1.75 }}>
              Más de 10 años de experiencia en Real Estate, habiendo asesorado a cientos de inversores y dirigido equipos comerciales internacionales para desarrolladores de prestigio. Lidera Lion Global con visión estratégica y profundo conocimiento del mercado global.
            </p>
          </div>
        </div>

        {/* Misión & Visión */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 72 }}>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 10, padding: 36 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🎯</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#024ffd', marginBottom: 12, letterSpacing: '0.06em' }}>MISIÓN</h3>
            <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.65)', lineHeight: 1.75 }}>
              Brindar servicios de consultoría comercial integrales en el mercado inmobiliario, ayudando a inversores y desarrolladores a alcanzar sus objetivos y maximizar el éxito en el sector.
            </p>
          </div>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 10, padding: 36 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🔭</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#024ffd', marginBottom: 12, letterSpacing: '0.06em' }}>VISIÓN</h3>
            <p style={{ fontSize: 13, color: 'rgba(239,239,239,0.65)', lineHeight: 1.75 }}>
              Ser la consultora comercial líder en Latinoamérica en el sector inmobiliario, brindando soluciones innovadoras y de calidad que generen un impacto positivo en nuestros clientes.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>LO QUE NOS DEFINE</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#efefef' }}>Nuestros valores</h2>
            <div style={{ height: 3, width: 48, background: '#024ffd', marginTop: 10 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.15)', borderRadius: 10, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{v.icon}</div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#024ffd', marginBottom: 8 }}>{v.title}</h4>
                <p style={{ fontSize: 12, color: 'rgba(239,239,239,0.5)', lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 32px', background: 'rgba(2,79,253,0.06)', border: '1px solid rgba(2,79,253,0.2)', borderRadius: 12 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#efefef', marginBottom: 12 }}>¿Querés trabajar con nosotros?</h2>
          <p style={{ fontSize: 14, color: 'rgba(239,239,239,0.5)', marginBottom: 28 }}>Contactanos y te asesoramos sin compromiso.</p>
          <Link href="/contacto" style={{ background: '#024ffd', color: '#101010', padding: '13px 36px', fontSize: 13, fontWeight: 800, borderRadius: 4, textDecoration: 'none', letterSpacing: '0.08em' }}>
            CONTACTAR AHORA
          </Link>
        </div>
      </div>
    </main>
  );
}
