"use client";

import { architectureLevels } from "@/data/integral-security";

export function OperationalArchitecture() {
  return (
    <section className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 max-w-3xl">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
            <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
            Arquitectura operativa
          </div>
          <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
            La estructura que conecta
            <br />
            <span className="text-foreground/80">cada nivel de la operación.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Una jerarquía clara para operar múltiples clientes, sedes, zonas, cámaras,
            guardas y servicios sin perder trazabilidad.
          </p>
        </header>

        {/* Vertical hierarchy diagram */}
        <ol className="relative">
          {/* Center spine */}
          <span
            aria-hidden
            className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-accent via-border/40 to-transparent md:left-1/2 md:-translate-x-1/2"
          />
          {architectureLevels.map((level, i) => {
            const isRoot = level.tier === "root";
            return (
              <li
                key={level.label}
                className="relative grid grid-cols-[auto_1fr] items-center gap-4 py-4 md:grid-cols-[1fr_auto_1fr]"
              >
                {/* Left rail / number on mobile */}
                <span
                  className={`relative z-10 grid size-12 place-items-center border font-mono text-[11px] font-bold uppercase tracking-[0.18em] backdrop-blur md:order-2 md:size-14 ${
                    isRoot
                      ? "border-accent bg-accent/25 text-foreground"
                      : "border-border/60 bg-background/80 text-foreground/65"
                  }`}
                >
                  {isRoot ? "ARS" : level.tier}
                </span>

                {/* Card */}
                <div
                  className={`border bg-background/40 p-4 backdrop-blur md:p-5 ${
                    isRoot ? "border-accent" : "border-border/50"
                  } ${i % 2 === 0 ? "md:order-1 md:text-right" : "md:order-3"}`}
                >
                  <div className="font-heading text-base font-bold uppercase leading-tight tracking-tight md:text-lg">
                    {level.label}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                    {level.sub}
                  </div>
                </div>

                {/* Spacer for balanced grid on desktop */}
                <span className={`hidden md:block ${i % 2 === 0 ? "md:order-3" : "md:order-1"}`} />

                {/* Connecting arrow between levels */}
                {i < architectureLevels.length - 1 && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-3 left-6 z-10 -translate-x-1/2 text-[10px] text-accent md:left-1/2"
                  >
                    ▼
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mx-auto mt-12 max-w-3xl border border-border/40 bg-secondary/40 p-5 text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-foreground/65 backdrop-blur">
          Organización → Cliente → Sede / Zona → Puesto → Cámara → Guarda → Turno → Ronda → Evento → Evidencia → Reporte
        </p>
      </div>
    </section>
  );
}
