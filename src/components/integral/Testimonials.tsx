"use client";

import { RevealOnScroll } from "./RevealOnScroll";

/**
 * Testimonios de clientes — placeholders editables.
 *
 * El array `testimonials` está pensado para que el usuario reemplace los
 * datos por testimonios reales (con autorización). Cada testimonio incluye:
 *  - quote (texto)
 *  - author (nombre)
 *  - role (cargo)
 *  - company (empresa o sector)
 *  - vertical (industria / categoría)
 */

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  vertical: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Pasamos de tener cinco sistemas distintos a una sola plataforma donde se ve todo: turnos, rondas, cámaras y novedades. Cambió la forma en que reportamos al cliente.",
    author: "[Nombre del referente]",
    role: "Gerente de Operaciones",
    company: "Empresa de seguridad multi-cliente",
    vertical: "Servicios de seguridad",
  },
  {
    quote:
      "Las alertas de IA llegan con video, ubicación y guarda asignado. Eso nos permitió responder mejor y reducir el tiempo de atención de incidentes.",
    author: "[Nombre del referente]",
    role: "Jefe de Seguridad",
    company: "Centro logístico",
    vertical: "Logística e industrial",
  },
  {
    quote:
      "La trazabilidad de rondas y formularios cambió la conversación con la administración. Hoy entregamos reportes que antes nos tomaban días.",
    author: "[Nombre del referente]",
    role: "Coordinador de Servicios",
    company: "Conjunto residencial",
    vertical: "Residencial",
  },
];

export function Testimonials() {
  return (
    <section className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <header className="mb-12 max-w-3xl">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
              <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
              Cómo lo viven nuestros clientes
            </div>
            <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
              Operaciones reales,
              <br />
              <span className="text-foreground/80">resultados medibles.</span>
            </h2>
          </header>
        </RevealOnScroll>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={i} delay={i * 100}>
              <article className="flex h-full flex-col border border-border/50 bg-background/40 p-6 backdrop-blur transition-colors hover:border-accent">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {t.vertical}
                </div>

                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-foreground/85 md:text-[15px]">
                  <span className="mr-1 align-top text-2xl text-accent/60">“</span>
                  {t.quote}
                  <span className="ml-1 align-baseline text-2xl text-accent/60">”</span>
                </blockquote>

                <footer className="mt-6 border-t border-border/40 pt-4 font-mono text-[11px] uppercase tracking-[0.2em]">
                  <div className="font-bold text-foreground">{t.author}</div>
                  <div className="mt-0.5 text-foreground/55">{t.role}</div>
                  <div className="mt-0.5 text-foreground/45">{t.company}</div>
                </footer>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={400}>
          <p className="mt-10 border-l-2 border-accent/60 pl-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-foreground/45">
            Los nombres y empresas mostrados son placeholders.<br />
            Reemplazá las entradas en <code>src/components/integral/Testimonials.tsx</code> con testimonios reales (con autorización).
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
