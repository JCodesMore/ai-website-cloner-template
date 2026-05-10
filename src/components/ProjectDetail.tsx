"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project, IntegrationTag } from "@/data/projects";
import { Scramble } from "@/components/Scramble";
import { useI18n } from "@/lib/i18n/context";

const INTEGRATION_LABELS: Record<IntegrationTag, { es: string; en: string; icon: string }> = {
  facial:        { es: "Reconocimiento facial",    en: "Face recognition",  icon: "◉" },
  lpr:           { es: "LPR · placas vehiculares", en: "LPR · plates",      icon: "▦" },
  epp:           { es: "EPP · seguridad industrial",en: "PPE · industrial", icon: "◈" },
  intrusion:     { es: "Intrusión y cruce de línea",en: "Intrusion · line", icon: "✕" },
  behavior:      { es: "Análisis de comportamiento",en: "Behavior analysis",icon: "◊" },
  "people-count":{ es: "Conteo de personas",       en: "People counting",   icon: "▥" },
  thermal:       { es: "Visión térmica",           en: "Thermal imaging",   icon: "◐" },
  guard:         { es: "Vigilancia física 24/7",   en: "Physical guards 24/7",icon: "▲" },
  access:        { es: "Control de acceso",        en: "Access control",    icon: "◆" },
  perimeter:     { es: "Perímetro vigilado",       en: "Perimeter watch",   icon: "□" },
  alarm:         { es: "Alarmas y respuesta",      en: "Alarms · response", icon: "▼" },
  iot:           { es: "Sensores IoT integrados",  en: "Integrated IoT",    icon: "⌬" },
};

type Tab = "overview" | "gallery" | "analytics" | "integrations";

type Props = {
  project: Project | null;
  cityName: string;
  onClose: () => void;
};

export function ProjectDetail({ project, cityName, onClose }: Props) {
  const { locale, t } = useI18n();
  const [tab, setTab] = useState<Tab>("overview");
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => {
    if (project) {
      setTab("overview");
      setGalleryIdx(0);
    }
  }, [project?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (project) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  if (!project) return null;

  const tabs: Array<{ id: Tab; label: { es: string; en: string } }> = [
    { id: "overview",     label: { es: "Resumen",       en: "Overview" } },
    { id: "gallery",      label: { es: "Galería",       en: "Gallery" } },
    { id: "analytics",    label: { es: "Analíticas",    en: "Analytics" } },
    { id: "integrations", label: { es: "Integraciones", en: "Integrations" } },
  ];

  const stats = project.stats;
  const isES = locale === "es";

  const statLabels = isES
    ? {
        cameras: "Cámaras",
        aiModels: "Modelos de IA",
        eventsPerDay: "Eventos / día",
        uptimePct: "Uptime",
        avgResponseSec: "Respuesta media",
        physicalGuards: "Guardias en sitio",
        physical: "Vigilancia física",
        digital: "Vigilancia digital",
        unified: "Operación unificada",
      }
    : {
        cameras: "Cameras",
        aiModels: "AI models",
        eventsPerDay: "Events / day",
        uptimePct: "Uptime",
        avgResponseSec: "Avg response",
        physicalGuards: "On-site guards",
        physical: "Physical security",
        digital: "Digital security",
        unified: "Unified operation",
      };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="pointer-events-auto fixed inset-0 z-50 flex items-stretch justify-end"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-deep/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden border-l border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl">
        {/* Close + breadcrumb */}
        <div className="flex items-center justify-between border-b border-border/40 px-8 py-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
          <span>
            <span className="text-accent">▸</span> {cityName}
            <span className="px-2 text-foreground/25">/</span>
            <span>{project.vertical}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Hero */}
        <div className="relative h-64 shrink-0 overflow-hidden md:h-80">
          <Image
            src={project.hero}
            alt={project.name}
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="grid-bg absolute inset-0 opacity-20" />
          <div className="absolute inset-x-0 bottom-0 px-8 pb-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">
              <Scramble text={project.tagline} trigger={`${locale}-${project.id}-tag`} durationMs={800} />
            </div>
            <h2 className="mt-2 font-heading text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl">
              {project.name}
            </h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
              {project.address} · {String(project.lat.toFixed(3))}, {String(project.lng.toFixed(3))}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-border/40 px-8">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => setTab(tb.id)}
              className={`relative px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.22em] transition-colors ${
                tab === tb.id
                  ? "text-foreground"
                  : "text-foreground/45 hover:text-foreground/75"
              }`}
            >
              {tb.label[locale]}
              {tab === tb.id && (
                <span className="absolute inset-x-5 bottom-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {tab === "overview" && (
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  {isES ? "Descripción" : "Description"}
                </div>
                <p className="mt-3 text-base leading-relaxed text-foreground/85">
                  {project.description}
                </p>

                {/* Physical + Digital fusion visual */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <FusionTile
                    label={statLabels.physical}
                    value={`${stats.physicalGuards}`}
                    sub={isES ? "guardias" : "guards"}
                  />
                  <FusionTile
                    label={statLabels.digital}
                    value={`${stats.cameras}`}
                    sub={isES ? "cámaras" : "cameras"}
                  />
                  <FusionTile
                    label={statLabels.unified}
                    value={`${stats.eventsPerDay.toLocaleString()}`}
                    sub={isES ? "eventos / día" : "events / day"}
                    accent
                  />
                </div>
              </div>

              {/* Integrations preview */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  {isES ? "Capacidades activas" : "Active capabilities"}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.integrations.map((tag) => {
                    const meta = INTEGRATION_LABELS[tag];
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 border border-border/60 bg-secondary px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                      >
                        <span className="text-accent">{meta.icon}</span>
                        {meta[locale]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "gallery" && (
            <div className="space-y-6">
              <div className="relative aspect-video w-full overflow-hidden border border-border/60 bg-secondary">
                <Image
                  src={project.gallery[galleryIdx]}
                  alt={`${project.name} - ${galleryIdx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                  {String(galleryIdx + 1).padStart(2, "0")} /{" "}
                  {String(project.gallery.length).padStart(2, "0")}
                </div>
                <button
                  type="button"
                  onClick={() => setGalleryIdx((i) => (i - 1 + project.gallery.length) % project.gallery.length)}
                  aria-label="Prev"
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid size-10 place-items-center border border-border/60 bg-background/60 text-foreground/80 backdrop-blur transition-colors hover:bg-background/90"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryIdx((i) => (i + 1) % project.gallery.length)}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid size-10 place-items-center border border-border/60 bg-background/60 text-foreground/80 backdrop-blur transition-colors hover:bg-background/90"
                >
                  ▶
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2">
                {project.gallery.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGalleryIdx(i)}
                    className={`relative aspect-video overflow-hidden border transition-all ${
                      galleryIdx === i
                        ? "border-accent"
                        : "border-border/40 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Optional video placeholder */}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  {isES ? "Video del proyecto" : "Project video"}
                </div>
                <div className="mt-3 grid place-items-center aspect-video w-full border border-border/60 bg-secondary">
                  <div className="text-center font-mono text-xs uppercase tracking-[0.25em] text-foreground/40">
                    <div className="text-3xl text-foreground/55">▶</div>
                    <div className="mt-2">
                      {isES
                        ? "Video disponible bajo demanda"
                        : "Video available on request"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "analytics" && (
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                label={statLabels.cameras}
                value={stats.cameras.toLocaleString()}
                hint={isES ? "instaladas y activas" : "installed and active"}
              />
              <StatCard
                label={statLabels.aiModels}
                value={String(stats.aiModels)}
                hint={isES ? "ejecutando en paralelo" : "running in parallel"}
              />
              <StatCard
                label={statLabels.eventsPerDay}
                value={stats.eventsPerDay.toLocaleString()}
                hint={isES ? "promedio últimos 30d" : "30d average"}
              />
              <StatCard
                label={statLabels.uptimePct}
                value={`${stats.uptimePct}%`}
                hint={isES ? "últimos 90 días" : "last 90 days"}
              />
              <StatCard
                label={statLabels.avgResponseSec}
                value={`${stats.avgResponseSec}s`}
                hint={isES ? "alerta → operador" : "alert → operator"}
              />
              <StatCard
                label={statLabels.physicalGuards}
                value={String(stats.physicalGuards)}
                hint={isES ? "operación 24/7" : "24/7 operation"}
              />

              {/* Integration ratio bar */}
              <div className="md:col-span-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  {isES ? "Composición de la operación" : "Operation composition"}
                </div>
                <div className="mt-3 flex h-3 w-full overflow-hidden border border-border/40">
                  <div
                    className="bg-accent"
                    style={{
                      width: `${
                        (stats.cameras /
                          (stats.cameras + stats.physicalGuards * 8)) *
                        100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-foreground/40"
                    style={{
                      width: `${
                        (stats.physicalGuards * 8 /
                          (stats.cameras + stats.physicalGuards * 8)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                  <span><span className="mr-2 inline-block size-2 bg-accent align-middle" />{statLabels.digital}</span>
                  <span>{statLabels.physical}<span className="ml-2 inline-block size-2 bg-foreground/40 align-middle" /></span>
                </div>
              </div>
            </div>
          )}

          {tab === "integrations" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {project.integrations.map((tag) => {
                const meta = INTEGRATION_LABELS[tag];
                return (
                  <div
                    key={tag}
                    className="flex items-start gap-4 border border-border/60 bg-secondary p-4"
                  >
                    <div className="grid size-10 shrink-0 place-items-center border border-border/60 text-lg text-accent">
                      {meta.icon}
                    </div>
                    <div>
                      <div className="font-heading text-sm font-bold uppercase tracking-tight">
                        {meta[locale]}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                        {tag === "guard" || tag === "perimeter" || tag === "iot"
                          ? isES ? "Capa física" : "Physical layer"
                          : isES ? "Capa digital · IA" : "Digital · AI layer"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FusionTile({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`border p-4 ${
        accent ? "border-accent/60 bg-accent/10" : "border-border/60 bg-secondary"
      }`}
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/55">
        {label}
      </div>
      <div className="mt-1 font-heading text-2xl font-black tracking-tight">
        {value}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
        {sub}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="border border-border/60 bg-secondary p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
        {label}
      </div>
      <div className="mt-2 font-heading text-3xl font-black tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
        {hint}
      </div>
    </div>
  );
}
