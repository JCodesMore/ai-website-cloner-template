"use client";

import { flowSteps } from "@/data/integral-security";

export function IntegrationFlow() {
  return (
    <section className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
            <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
            Cómo se integra todo
          </div>
          <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
            Una secuencia coordinada,
            <br />
            <span className="text-foreground/80">desde el turno hasta el reporte.</span>
          </h2>
        </header>

        {/* Long-form prose explaining the flow */}
        <div className="mb-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
            Cuando un guarda inicia turno, ARS registra su asignación, ubicación, estado y
            tareas. Durante la operación ejecuta rondas, completa formularios, reporta
            novedades, se comunica por PTT y genera evidencia.{" "}
            <span className="text-foreground">
              Al mismo tiempo, la central observa cámaras, alertas IA, mapa, eventos y
              estado del personal en vivo.
            </span>{" "}
            Cada acción queda trazada y se convierte en reportes para supervisión y
            gerencia.
          </p>
          <aside className="border border-accent/40 bg-secondary/40 p-5 backdrop-blur">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Resultado
            </div>
            <p className="mt-2 font-heading text-base font-bold uppercase leading-tight tracking-tight">
              Cero desconexión entre operación humana, IA y supervisión.
            </p>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-foreground/65">
              Trazabilidad total. Cada evento con contexto. Cada decisión con evidencia.
            </p>
          </aside>
        </div>

        {/* Timeline */}
        <ol className="relative space-y-6 border-l border-border/50 pl-8 md:space-y-4 md:pl-12">
          {flowSteps.map((step, i) => (
            <li key={step.title} className="relative">
              {/* Marker */}
              <span
                className="absolute -left-[37px] grid size-6 place-items-center border border-accent bg-background font-mono text-[10px] font-bold tracking-[0.1em] text-accent md:-left-[49px] md:size-8 md:text-[11px]"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Card */}
              <div className="border border-border/50 bg-background/40 p-4 backdrop-blur md:p-5">
                <h3 className="font-heading text-base font-bold uppercase leading-tight tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 font-mono text-[12px] leading-relaxed text-foreground/65">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
