"use client";

import { Icon } from "./Icon";
import { cycleSteps } from "@/data/integral-security";

export function OperationCycle() {
  return (
    <section className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
            <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
            El ciclo completo de la operación
          </div>
          <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
            Del turno a la evidencia,
            <br />
            <span className="text-foreground/80">toda la operación conectada.</span>
          </h2>
        </header>

        {/* Desktop: horizontal flow with connecting lines */}
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {cycleSteps.map((step, i) => (
            <li
              key={step.num}
              className="group relative flex flex-col gap-3 border border-border/50 bg-background/40 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-secondary/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                  Paso {step.num}
                </span>
                <Icon path={step.icon} size={20} className="text-accent" />
              </div>
              <h3 className="font-heading text-base font-bold uppercase leading-tight tracking-tight">
                {step.title}
              </h3>
              <p className="font-mono text-[12px] leading-relaxed text-foreground/65">
                {step.body}
              </p>
              {/* Connector arrow on desktop (except last) */}
              {i < cycleSteps.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-accent lg:block"
                >
                  ▸
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
