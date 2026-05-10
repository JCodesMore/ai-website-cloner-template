"use client";

import Image from "next/image";
import { useState } from "react";
import { RevealOnScroll } from "./RevealOnScroll";

/**
 * Galería de capturas/visualizaciones del producto ARS.
 * Usa las ilustraciones existentes del manual (public/images/features/).
 * Permite seleccionar una capacidad y ver la captura asociada en grande
 * con descripción al lado.
 */

type Shot = {
  id: string;
  title: string;
  caption: string;
  src: string;
  highlights: string[];
};

const shots: Shot[] = [
  {
    id: "central",
    title: "Central de monitoreo",
    caption: "Tablero único con cámaras, alertas y mapa de operación en vivo.",
    src: "/images/features/02-central-monitoreo.png",
    highlights: [
      "Vista multipantalla configurable",
      "Priorización automática de eventos",
      "Asignación de operadores por turno",
    ],
  },
  {
    id: "ia",
    title: "IA por cámara",
    caption: "Activá modelos por cámara sin reemplazar tu hardware existente.",
    src: "/images/features/04-ia-por-camara.png",
    highlights: [
      "Reglas configurables por cámara",
      "Modelos múltiples sobre la misma fuente",
      "Edge + cloud según latencia requerida",
    ],
  },
  {
    id: "facial",
    title: "Reconocimiento facial",
    caption: "Listas de interés, búsqueda histórica y alertas en accesos.",
    src: "/images/features/06-reconocimiento-facial.png",
    highlights: [
      "Listas blancas y negras por sede",
      "Búsqueda forense por rostro",
      "Confidence configurable",
    ],
  },
  {
    id: "lpr",
    title: "Reconocimiento de placas",
    caption: "OCR de matrículas con cruce contra listas y registro automático.",
    src: "/images/features/07-lpr.png",
    highlights: [
      "Soporte para placas LATAM",
      "Integración con barreras",
      "Reportes por flota o cliente",
    ],
  },
  {
    id: "intrusion",
    title: "Intrusión y zonas ROI",
    caption: "Reglas perimetrales con áreas de interés precisas por cámara.",
    src: "/images/features/08-intrusion-roi.png",
    highlights: [
      "ROI poligonal o rectangular",
      "Cruce de línea con dirección",
      "Horarios de activación",
    ],
  },
  {
    id: "epp",
    title: "EPP industrial",
    caption: "Verificación automática del uso de elementos de protección personal.",
    src: "/images/features/09-epp.png",
    highlights: [
      "Casco, chaleco, guantes, gafas",
      "Reporte para auditoría SST",
      "Alertas a supervisores en tiempo real",
    ],
  },
  {
    id: "alerts",
    title: "Alertas con evidencia",
    caption: "Cada alerta llega con clip, snapshot, ubicación y trazabilidad.",
    src: "/images/features/10-alertas-evidencia.png",
    highlights: [
      "Snapshot + video clip asociado",
      "Estado de atención por operador",
      "Cierre con observaciones y firma",
    ],
  },
];

export function ScreenshotShowcase() {
  const [activeId, setActiveId] = useState(shots[0].id);
  const active = shots.find((s) => s.id === activeId) ?? shots[0];

  return (
    <section className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <header className="mb-12 max-w-3xl">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
              <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
              Capturas del producto
            </div>
            <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
              Cómo se ve la operación
              <br />
              <span className="text-foreground/80">desde adentro de ARS.</span>
            </h2>
          </header>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Active shot */}
          <RevealOnScroll>
            <div className="relative aspect-video w-full overflow-hidden border border-border/60 bg-secondary">
              <Image
                key={active.src}
                src={active.src}
                alt={active.title}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-deep/30" />
              {/* HUD */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/85">
                <span className="border border-accent/50 bg-deep/70 px-3 py-1.5 backdrop-blur">
                  ◉ ARS · {active.id.toUpperCase()}
                </span>
                <span className="border border-border/40 bg-deep/70 px-3 py-1.5 backdrop-blur">
                  {String(shots.findIndex((s) => s.id === active.id) + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
                </span>
              </div>
              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <h3 className="font-heading text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-2 max-w-xl font-mono text-[11px] leading-relaxed text-foreground/80 md:text-sm">
                  {active.caption}
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* List of shots */}
          <RevealOnScroll delay={120}>
            <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {shots.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    className={`flex w-full items-center gap-3 border p-3 text-left transition-colors ${
                      activeId === s.id
                        ? "border-accent bg-secondary text-foreground"
                        : "border-border/50 bg-background/40 text-foreground/65 hover:border-border hover:bg-secondary/40"
                    }`}
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden border border-border/40">
                      <Image src={s.src} alt="" fill sizes="48px" className="object-cover opacity-80" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-heading text-sm font-bold uppercase tracking-tight">
                        {s.title}
                      </div>
                      <div className="mt-0.5 hidden truncate font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45 sm:block">
                        {s.caption}
                      </div>
                    </div>
                    {activeId === s.id && (
                      <span className="text-accent">▸</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>

        {/* Highlights of active */}
        <RevealOnScroll delay={200}>
          <ul className="mt-6 grid gap-3 border-t border-border/40 pt-6 sm:grid-cols-3">
            {active.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 border border-border/40 bg-background/40 p-4 font-mono text-[11px] leading-relaxed text-foreground/75 backdrop-blur"
              >
                <span className="mt-0.5 text-accent">▸</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  );
}
