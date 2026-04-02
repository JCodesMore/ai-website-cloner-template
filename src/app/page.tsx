import Link from 'next/link';

export default function Page() {
  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#101010', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
      {/* Grid background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(2,79,253,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(2,79,253,0.07) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'rgba(2,79,253,0.08)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', maxWidth: 860 }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🦁</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(2,79,253,0.12)', border: '1px solid rgba(2,79,253,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#024ffd' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.1em' }}>GLOBAL SALES CONSULTING</span>
        </div>
        <h1 style={{ fontSize: 58, fontWeight: 800, color: '#efefef', lineHeight: 1.1, marginBottom: 16, letterSpacing: '0.01em' }}>
          Tu Aliado en<br /><span style={{ color: '#024ffd' }}>Inversiones Inmobiliarias</span>
        </h1>
        <p style={{ fontSize: 16, color: '#024ffd', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 20 }}>
          CONSULTORÍA • ASESORAMIENTO • OPORTUNIDADES GLOBALES
        </p>
        <p style={{ fontSize: 15, color: 'rgba(239,239,239,0.7)', lineHeight: 1.8, maxWidth: 640, margin: '0 auto 48px' }}>
          Conectamos inversores con las mejores oportunidades inmobiliarias en América, Europa y Asia. Con presencia en 12 países, ofrecemos soluciones personalizadas para maximizar tus ganancias.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/nuevas-construcciones" style={{ background: '#024ffd', color: '#101010', padding: '13px 36px', fontSize: 13, fontWeight: 800, borderRadius: 4, textDecoration: 'none', letterSpacing: '0.08em' }}>
            VER PROYECTOS
          </Link>
          <Link href="/contacto" style={{ background: 'transparent', color: '#024ffd', padding: '13px 36px', fontSize: 13, fontWeight: 800, border: '2px solid #024ffd', borderRadius: 4, textDecoration: 'none', letterSpacing: '0.08em' }}>
            CONTACTAR AHORA
          </Link>
        </div>
      </div>
    </main>
  );
}
