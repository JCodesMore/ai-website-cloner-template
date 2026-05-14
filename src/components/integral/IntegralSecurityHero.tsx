"use client";

import Link from "next/link";
import { Scramble } from "@/components/Scramble";
import { guidingPhrase, operatingVerbs } from "@/data/integral-security";

export function IntegralSecurityHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/40 px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-44">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(35,72,212,0.35), transparent 55%)," +
              "radial-gradient(circle at 75% 70%, rgba(34,211,238,0.18), transparent 55%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        {/* Left — copy */}
        <div>
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/65">
            <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
            <Scramble text="Módulo · Seguridad integral" />
          </div>

          <h1 className="mt-6 font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl lg:text-[5rem]">
            <Scramble as="span" text="Seguridad integral" durationMs={900} />
            <br />
            <span className="text-foreground/85">
              <Scramble as="span" text="en una sola plataforma." durationMs={900} delayMs={200} />
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
            ARS conecta turnos, personal, rondas, cámaras, IA, alertas, comunicación,
            formularios, mapas y reportes para transformar la operación de seguridad
            en un sistema trazable, inteligente y en tiempo real.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="mailto:afiliaciones.tuapo@gmail.com?subject=Solicitud de demo - ARS Intelligence"
              className="bevel-btn group inline-flex items-center gap-3 border border-border bg-foreground px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-background shadow-xl transition-opacity hover:opacity-90"
            >
              <span>▸</span>
              <Scramble text="Solicitar demo" />
            </a>
            <Link
              href="#funcionalidades"
              className="bevel-btn group inline-flex items-center gap-3 border border-border bg-background/40 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-foreground backdrop-blur transition-colors hover:border-accent hover:bg-background/60"
            >
              <span className="text-accent">◎</span>
              <Scramble text="Ver funcionalidades" />
            </Link>
          </div>

          {/* Operating verbs strip */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/45">
            {operatingVerbs.map((v, i) => (
              <li key={v} className="flex items-center gap-2">
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — abstract dashboard */}
        <DashboardSketch />
      </div>

      {/* Guiding phrase */}
      <div className="mx-auto mt-20 max-w-4xl border-y border-border/40 py-8 text-center md:mt-28">
        <p className="font-serif text-base italic text-foreground/70 md:text-xl">
          “{guidingPhrase}”
        </p>
      </div>
    </section>
  );
}

// Abstract dashboard graphic — connected nodes (no library, just SVG)
function DashboardSketch() {
  // 8 nodes laid out in a soft constellation around a center brain
  const nodes = [
    { x: 50, y: 50, label: "ARS",        size: 18, kind: "core"   },
    { x: 18, y: 22, label: "Cámaras",    size: 7,  kind: "leaf"   },
    { x: 80, y: 18, label: "Operadores", size: 7,  kind: "leaf"   },
    { x: 82, y: 50, label: "IA",         size: 7,  kind: "leaf"   },
    { x: 86, y: 80, label: "Reportes",   size: 7,  kind: "leaf"   },
    { x: 50, y: 88, label: "Mapa",       size: 7,  kind: "leaf"   },
    { x: 18, y: 80, label: "Turnos",     size: 7,  kind: "leaf"   },
    { x: 12, y: 50, label: "Rondas",     size: 7,  kind: "leaf"   },
    { x: 50, y: 18, label: "Alertas",    size: 7,  kind: "leaf"   },
  ];
  const core = nodes[0];
  const leaves = nodes.slice(1);

  return (
    <div className="relative aspect-square w-full max-w-[520px] justify-self-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(213,224,255,0.95)" />
            <stop offset="40%" stopColor="rgba(35,72,212,0.55)" />
            <stop offset="100%" stopColor="rgba(35,72,212,0)" />
          </radialGradient>
        </defs>

        {/* Connecting curves */}
        {leaves.map((leaf, i) => {
          const cx = (core.x + leaf.x) / 2 + (Math.sin(i) * 8);
          const cy = (core.y + leaf.y) / 2 + (Math.cos(i) * 8);
          return (
            <path
              key={i}
              d={`M ${core.x} ${core.y} Q ${cx} ${cy} ${leaf.x} ${leaf.y}`}
              fill="none"
              stroke="rgba(35, 72, 212, 0.55)"
              strokeWidth="0.25"
              strokeDasharray="0.8 0.6"
              vectorEffect="non-scaling-stroke"
              style={{ animation: `dash-flow ${4 + i * 0.3}s linear infinite` }}
            />
          );
        })}

        {/* Core */}
        <circle cx={core.x} cy={core.y} r="14" fill="url(#hero-glow)" />
        <circle cx={core.x} cy={core.y} r="3.5" fill="rgba(213, 224, 255, 0.95)" />
        <circle cx={core.x} cy={core.y} r="6" fill="none" stroke="rgba(35, 72, 212, 0.7)" strokeWidth="0.2" />

        {/* Leaves */}
        {leaves.map((leaf, i) => (
          <g key={i} transform={`translate(${leaf.x},${leaf.y})`}>
            <circle r="3.5" fill="rgba(35, 72, 212, 0.35)" />
            <circle r="1.6" fill="rgba(213, 224, 255, 0.95)" />
            <circle
              r="6"
              fill="rgba(35, 72, 212, 0.18)"
              style={{ animation: `pulse-glow ${2 + (i % 4) * 0.5}s ease-in-out infinite` }}
            />
          </g>
        ))}

        {/* Labels */}
        {nodes.map((n) => (
          <text
            key={n.label}
            x={n.x}
            y={n.y + (n.kind === "core" ? -6 : (n.y < 50 ? -5 : 7))}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={n.kind === "core" ? "2.6" : "1.8"}
            fontWeight={n.kind === "core" ? 800 : 600}
            letterSpacing="0.16em"
            fill={n.kind === "core" ? "rgba(213,224,255,0.95)" : "rgba(213,224,255,0.6)"}
            style={{ textTransform: "uppercase" }}
          >
            {n.label}
          </text>
        ))}
      </svg>

      {/* Subtle corner annotations */}
      <div className="absolute left-0 top-0 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">
        REAL · TIME
      </div>
      <div className="absolute bottom-0 right-0 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">
        24/7 · LATAM
      </div>
    </div>
  );
}
