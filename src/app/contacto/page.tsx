'use client';

export default function ContactoPage() {
  return (
    <main style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#0d0d0d', minHeight: 'calc(100vh - 64px)', padding: '60px 32px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#024ffd', letterSpacing: '0.15em', marginBottom: 8 }}>HABLEMOS</p>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: '#efefef' }}>Contáctanos</h1>
          <div style={{ height: 3, width: 56, background: '#024ffd', marginTop: 12 }} />
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(239,239,239,0.5)', maxWidth: 520 }}>
            Nuestro equipo está listo para asesorarte sobre las mejores oportunidades de inversión inmobiliaria.
          </p>
        </div>

        {/* Contact cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { icon: '💬', title: 'WhatsApp', value: '+54 9 11 7611-9732', href: 'http://wa.me/541176119732', sub: 'Respuesta inmediata' },
            { icon: '✉️', title: 'Email', value: 'info@liongsc.com', href: 'mailto:info@liongsc.com', sub: 'Respondemos en 24hs' },
            { icon: '📍', title: 'Oficina', value: 'Pico 1671 4° D, CABA', href: 'https://maps.app.goo.gl/ejEfA9MV8MGtcYeH9', sub: 'Buenos Aires, Argentina' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', padding: 28, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#024ffd', marginBottom: 6, letterSpacing: '0.06em' }}>{item.title}</h3>
              <a href={item.href} style={{ color: 'rgba(239,239,239,0.85)', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 4 }}>{item.value}</a>
              <p style={{ fontSize: 11, color: 'rgba(239,239,239,0.35)' }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: '#1a1a2e', border: '1px solid rgba(2,79,253,0.2)', padding: 40, borderRadius: 10 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#024ffd', marginBottom: 28, textAlign: 'center', letterSpacing: '0.06em' }}>FORMULARIO DE CONTACTO</h2>
          <form style={{ display: 'grid', gap: 16 }} onSubmit={(e) => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input type="text" placeholder="Nombre" style={{ background: '#101010', border: '1px solid rgba(2,79,253,0.3)', color: '#efefef', padding: '12px 14px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
              <input type="email" placeholder="Email" style={{ background: '#101010', border: '1px solid rgba(2,79,253,0.3)', color: '#efefef', padding: '12px 14px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <input type="text" placeholder="Teléfono" style={{ background: '#101010', border: '1px solid rgba(2,79,253,0.3)', color: '#efefef', padding: '12px 14px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            <select style={{ background: '#101010', border: '1px solid rgba(2,79,253,0.3)', color: '#efefef', padding: '12px 14px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', outline: 'none' }}>
              <option value="">Seleccionar tipo de servicio</option>
              <option value="inversiones">Inversiones en Real Estate</option>
              <option value="consultoria">Consultoría Comercial</option>
              <option value="capacitacion">Capacitación de Equipos</option>
              <option value="comercializacion">Comercialización Exclusiva</option>
            </select>
            <textarea placeholder="Mensaje" rows={5} style={{ background: '#101010', border: '1px solid rgba(2,79,253,0.3)', color: '#efefef', padding: '12px 14px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none' }} />
            <button type="submit" style={{ background: '#024ffd', color: '#101010', padding: '13px 32px', fontSize: 13, fontWeight: 800, border: 'none', borderRadius: 4, cursor: 'pointer', letterSpacing: '0.08em' }}>
              ENVIAR MENSAJE
            </button>
          </form>
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(239,239,239,0.3); }
      `}</style>
    </main>
  );
}
