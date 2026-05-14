"use client";

import { beforeAfter } from "@/data/integral-security";

export function BeforeAfterComparison() {
  return (
    <section className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 max-w-3xl">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
            <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
            Antes vs. Con ARS
          </div>
          <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
            La diferencia entre vigilar
            <br />
            <span className="text-foreground/80">y operar con inteligencia.</span>
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Antes */}
          <div className="border border-border/40 bg-background/30 p-6 backdrop-blur md:p-8">
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/45">
              <span className="size-1.5 bg-foreground/40" />
              Antes de ARS
            </div>
            <ul className="mt-5 space-y-3 font-mono text-[12px] leading-relaxed text-foreground/55">
              {beforeAfter.before.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-foreground/30">✕</span>
                  <span className="line-through decoration-foreground/20 decoration-1">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Con ARS */}
          <div className="relative border border-accent bg-secondary/40 p-6 backdrop-blur md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 90% 10%, rgba(35,72,212,0.18), transparent 60%)",
              }}
            />
            <div className="relative flex items-center gap-3 border-b border-accent/40 pb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              <span className="size-1.5 bg-accent" />
              Con ARS Intelligence
            </div>
            <ul className="relative mt-5 space-y-3 font-mono text-[12px] leading-relaxed text-foreground/85">
              {beforeAfter.after.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Result strip */}
        <div className="mt-10 grid gap-4 border-y border-border/40 py-6 md:grid-cols-3">
          <ResultMetric value="< 1s" label="latencia de alertas" />
          <ResultMetric value="100%" label="trazabilidad por evento" />
          <ResultMetric value="48h" label="despliegue sobre tu infraestructura" />
        </div>
      </div>
    </section>
  );
}

function ResultMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline justify-center gap-3 text-center md:flex-col md:items-center md:gap-1">
      <span className="font-heading text-2xl font-black tracking-tight text-accent md:text-3xl">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
        {label}
      </span>
    </div>
  );
}
