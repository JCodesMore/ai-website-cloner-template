"use client";

import { RevealOnScroll } from "./RevealOnScroll";

/**
 * Strip de logos de clientes — placeholders.
 *
 * Los slots están renderizados como bloques con el nombre de un sector.
 * Cuando tengas los logos reales (con autorización del cliente), reemplazá
 * los slots por <Image src="/images/logos/clients/cliente-x.png" />.
 *
 * Mantenemos opacidad neutra (escala de grises + 60% opacity con hover a
 * 100%) para que el strip no compita con el branding ARS.
 */

const slots = [
  { label: "Empresa de seguridad" },
  { label: "Conjunto residencial" },
  { label: "Universidad" },
  { label: "Centro logístico" },
  { label: "Parque industrial" },
  { label: "Edificio corporativo" },
];

export function ClientLogos() {
  return (
    <section className="relative border-b border-border/40 px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/45">
            Operamos con empresas de seguridad y clientes corporativos en LATAM
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {slots.map((s, i) => (
              <li
                key={i}
                className="group flex aspect-[3/2] items-center justify-center border border-border/40 bg-background/40 px-4 py-6 backdrop-blur transition-colors hover:border-accent/60 hover:bg-secondary/40"
              >
                <div className="text-center">
                  {/* Replace this <div> with <Image src="..." /> when logos are ready */}
                  <div className="mx-auto mb-2 size-10 border border-border/40 bg-secondary/40 transition-colors group-hover:border-accent/60" />
                  <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/45 transition-colors group-hover:text-foreground/75">
                    {s.label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            ◇ Slots para logos reales · reemplazables en{" "}
            <code className="text-foreground/60">src/components/integral/ClientLogos.tsx</code>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
