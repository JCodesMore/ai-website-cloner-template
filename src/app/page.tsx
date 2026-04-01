'use client';

import { useState } from 'react';

export default function Page() {
  const [activeSection, setActiveSection] = useState('inicio');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ fontFamily: 'Helvetica Now Display, Helvetica, Arial, sans-serif', color: '#efefef', background: '#101010', minHeight: '100vh' }}>
      {/* Header/Navigation */}
      <header style={{ background: '#101010', borderBottom: `2px solid #024ffd`, padding: '20px 32px', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => scrollToSection('inicio')}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#024ffd' }}>🦁</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#efefef', letterSpacing: '0.1em' }}>LION</div>
              <div style={{ fontSize: 10, color: '#024ffd', letterSpacing: '0.05em' }}>GLOBAL SALES CONSULTING</div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <button onClick={() => scrollToSection('inicio')} style={{ background: 'none', border: 'none', color: activeSection === 'inicio' ? '#024ffd' : '#efefef', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.08em', transition: 'color 0.3s' }}>INICIO</button>
            <button onClick={() => scrollToSection('servicios')} style={{ background: 'none', border: 'none', color: activeSection === 'servicios' ? '#024ffd' : '#efefef', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.08em', transition: 'color 0.3s' }}>SERVICIOS</button>
            <button onClick={() => scrollToSection('mercados')} style={{ background: 'none', border: 'none', color: activeSection === 'mercados' ? '#024ffd' : '#efefef', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.08em', transition: 'color 0.3s' }}>MERCADOS</button>
            <button onClick={() => scrollToSection('partners')} style={{ background: 'none', border: 'none', color: activeSection === 'partners' ? '#024ffd' : '#efefef', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.08em', transition: 'color 0.3s' }}>PARTNERS</button>
            <button onClick={() => scrollToSection('contacto')} style={{ background: '#024ffd', border: 'none', color: '#101010', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '8px 20px', borderRadius: 4, letterSpacing: '0.08em' }}>CONTACTO</button>
          </nav>
        </div>
      </header>

      {/* INICIO Section */}
      <section id="inicio" style={{ padding: '120px 32px', background: 'linear-gradient(135deg, #101010 0%, #1a1a2e 100%)', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 64, marginBottom: 24, animation: 'pulse 2s infinite' }}>🦁</div>
          <h1 style={{ fontSize: 56, fontWeight: 700, color: '#efefef', marginBottom: 16, letterSpacing: '0.02em', lineHeight: 1.2 }}>Tu Aliado en Inversiones Inmobiliarias</h1>
          <p style={{ fontSize: 18, color: '#024ffd', marginBottom: 32, letterSpacing: '0.05em' }}>CONSULTORÍA • ASESORAMIENTO • OPORTUNIDADES GLOBALES</p>
          <p style={{ fontSize: 14, color: '#efefef', marginBottom: 48, maxWidth: 700, margin: '0 auto 48px', lineHeight: 1.8, opacity: 0.9 }}>Conectamos inversores con las mejores oportunidades inmobiliarias en América, Europa y Asia. Con presencia en 12 países, ofrecemos soluciones personalizadas para maximizar tus ganancias.</p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => scrollToSection('servicios')} style={{ background: '#024ffd', color: '#101010', padding: '14px 40px', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 4, cursor: 'pointer', letterSpacing: '0.08em', transition: 'all 0.3s', transform: 'scale(1)' }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>VER SERVICIOS</button>
            <button onClick={() => scrollToSection('contacto')} style={{ background: 'transparent', color: '#024ffd', padding: '14px 40px', fontSize: 14, fontWeight: 700, border: '2px solid #024ffd', borderRadius: 4, cursor: 'pointer', letterSpacing: '0.08em', transition: 'all 0.3s' }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#024ffd'; (e.currentTarget as HTMLButtonElement).style.color = '#101010'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#024ffd'; }}>CONTACTAR AHORA</button>
          </div>
        </div>
      </section>

      {/* SERVICIOS Section */}
      <section id="servicios" style={{ padding: '100px 32px', background: '#101010' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: '#efefef', marginBottom: 16, textAlign: 'center', letterSpacing: '0.02em' }}>Nuestros Servicios</h2>
          <div style={{ height: 3, width: 60, background: '#024ffd', margin: '0 auto 60px' }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[
              { icon: '💼', title: 'Asesoramiento en Inversiones', desc: 'Acceso a carteras diversificadas en mercados de América, Europa y Asia con rendimientos comprobados.' },
              { icon: '📊', title: 'Consultoría Comercial', desc: 'Estrategias comerciales personalizadas para optimizar gestión y acelerar ventas de proyectos.' },
              { icon: '👥', title: 'Capacitación de Equipos', desc: 'Formamos vendedores de alto rendimiento con herramientas avanzadas de comercialización.' },
              { icon: '🎯', title: 'Comercialización Exclusiva', desc: 'Expertos en venta de proyectos inmobiliarios con equipo calificado y amplia experiencia.' }
            ].map((service, i) => (
              <div key={i} style={{ background: '#1a1a2e', border: `1px solid #024ffd`, borderRadius: 8, padding: 40, textAlign: 'center', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(2, 79, 253, 0.1)'; e.currentTarget.style.transform = 'translateY(-10px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>{service.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#024ffd', marginBottom: 12, letterSpacing: '0.05em' }}>{service.title}</h3>
                <p style={{ fontSize: 13, color: '#efefef', lineHeight: 1.7, opacity: 0.85 }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MERCADOS Section */}
      <section id="mercados" style={{ padding: '100px 32px', background: '#0f0f1a' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: '#efefef', marginBottom: 16, textAlign: 'center', letterSpacing: '0.02em' }}>Mercados Globales</h2>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#efefef', marginBottom: 60, opacity: 0.8, maxWidth: 700, margin: '16px auto 60px' }}>Presencia estratégica en 12 países con alianzas de brokers y desarrolladores de prestigio</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 24 }}>
            {['Argentina', 'Brasil', 'Colombia', 'USA', 'México', 'Panamá', 'España', 'Italia', 'Emiratos', 'Georgia', 'Paraguay', 'Portugal'].map((country) => (
              <div key={country} style={{ background: '#1a1a2e', border: '1px solid #024ffd', padding: 24, borderRadius: 8, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#024ffd'; e.currentTarget.style.color = '#101010'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.color = '#efefef'; }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌍</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#efefef', letterSpacing: '0.08em' }}>{country}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS Section */}
      <section id="partners" style={{ padding: '100px 32px', background: '#101010' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: '#efefef', marginBottom: 16, textAlign: 'center', letterSpacing: '0.02em' }}>Nuestros Partners</h2>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#efefef', marginBottom: 60, opacity: 0.8 }}>Alianzas con líderes internacionales del mercado inmobiliario</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
            {['FSR', 'Gesmar', 'Metro Cúbico', 'Forest', 'Floripa', 'Q Group', 'Fortune', 'American Homes', 'Petra Urbana'].map((partner) => (
              <div key={partner} style={{ background: '#1a1a2e', border: '1px solid #024ffd', padding: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120, textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(2, 79, 253, 0.15)'; e.currentTarget.style.borderColor = '#efefef'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#1a1a2e'; e.currentTarget.style.borderColor = '#024ffd'; }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#024ffd', letterSpacing: '0.05em' }}>{partner}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO Section */}
      <section id="contacto" style={{ padding: '100px 32px', background: '#0f0f1a' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 44, fontWeight: 700, color: '#efefef', marginBottom: 16, textAlign: 'center', letterSpacing: '0.02em' }}>Contáctanos</h2>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#efefef', marginBottom: 60, opacity: 0.8 }}>Nuestro equipo está listo para asesorarte sobre las mejores oportunidades de inversión</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 60 }}>
            <div style={{ background: '#1a1a2e', border: '1px solid #024ffd', padding: 32, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>💬</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#024ffd', marginBottom: 12 }}>WhatsApp</h3>
              <a href="http://wa.me/541176119732" style={{ color: '#efefef', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>+54 9 11 7611-9732</a>
            </div>

            <div style={{ background: '#1a1a2e', border: '1px solid #024ffd', padding: 32, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#024ffd', marginBottom: 12 }}>Email</h3>
              <a href="mailto:info@liongsc.com" style={{ color: '#efefef', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>info@liongsc.com</a>
            </div>

            <div style={{ background: '#1a1a2e', border: '1px solid #024ffd', padding: 32, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>📍</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#024ffd', marginBottom: 12 }}>Ubicación</h3>
              <a href="https://maps.app.goo.gl/ejEfA9MV8MGtcYeH9" style={{ color: '#efefef', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Pico 1671 4° D, CABA</a>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: '#1a1a2e', border: '1px solid #024ffd', padding: 40, borderRadius: 8 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#024ffd', marginBottom: 24, textAlign: 'center' }}>Formulario de Contacto</h3>
            <form style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input type="text" placeholder="Nombre" style={{ background: '#101010', border: '1px solid #024ffd', color: '#efefef', padding: '12px 16px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit' }} />
                <input type="email" placeholder="Email" style={{ background: '#101010', border: '1px solid #024ffd', color: '#efefef', padding: '12px 16px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit' }} />
              </div>
              <input type="text" placeholder="Teléfono" style={{ background: '#101010', border: '1px solid #024ffd', color: '#efefef', padding: '12px 16px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit' }} />
              <select style={{ background: '#101010', border: '1px solid #024ffd', color: '#efefef', padding: '12px 16px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit' }}>
                <option value="">Seleccionar tipo de servicio</option>
                <option value="inversiones">Inversiones en Real Estate</option>
                <option value="consultoría">Consultoría Comercial</option>
                <option value="capacitación">Capacitación de Equipos</option>
                <option value="comercialización">Comercialización Exclusiva</option>
              </select>
              <textarea placeholder="Mensaje" rows={5} style={{ background: '#101010', border: '1px solid #024ffd', color: '#efefef', padding: '12px 16px', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', resize: 'none' }}></textarea>
              <button type="submit" style={{ background: '#024ffd', color: '#101010', padding: '14px 32px', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 4, cursor: 'pointer', letterSpacing: '0.08em' }}>ENVIAR</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0a0f', borderTop: '1px solid #024ffd', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
            <a href="https://facebook.com" style={{ color: '#024ffd', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>Facebook</a>
            <a href="https://instagram.com" style={{ color: '#024ffd', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>Instagram</a>
            <a href="https://linkedin.com" style={{ color: '#024ffd', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>LinkedIn</a>
          </div>
          <p style={{ fontSize: 11, color: '#efefef', opacity: 0.6, marginBottom: 8 }}>© 2025 Lion Global Sales Consulting. Todos los derechos reservados.</p>
          <p style={{ fontSize: 11, color: '#efefef', opacity: 0.6 }}>Pico 1671 4° D, Ciudad Autónoma de Buenos Aires | +54 9 11 7611-9732</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Helvetica:wght@400;700&display=swap');

        * {
          box-sizing: border-box;
        }

        button:hover {
          cursor: pointer;
        }

        input, select, textarea {
          font-family: inherit;
        }

        input::placeholder, textarea::placeholder {
          color: #efefef;
          opacity: 0.5;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
