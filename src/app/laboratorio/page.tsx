"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Scramble } from "@/components/Scramble";
import { DemoOverlay } from "@/components/DemoOverlay";
import { CameraStream } from "@/components/CameraStream";
import { VideoUpload } from "@/components/VideoUpload";
import { useI18n } from "@/lib/i18n/context";
import {
  aiCapabilities,
  categoryLabels,
  type AICapability,
} from "@/data/ai-capabilities";

type Tab = "showcase" | "camera" | "upload";

export default function LaboratorioPage() {
  const { t, locale } = useI18n();
  const [selectedId, setSelectedId] = useState<string>(aiCapabilities[0].id);
  const [tab, setTab] = useState<Tab>("showcase");
  const [filter, setFilter] = useState<AICapability["category"] | "ALL">("ALL");

  const selected = aiCapabilities.find((c) => c.id === selectedId) ?? aiCapabilities[0];
  const filtered = filter === "ALL" ? aiCapabilities : aiCapabilities.filter((c) => c.category === filter);

  const isES = locale === "es";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Decorative bg */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div
          className="glow-blob absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(35,72,212,0.22), transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky inset-x-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logos/horizontal-blanco.png"
              alt="ARS Intelligence"
              width={160}
              height={36}
              priority
              className="h-9 w-auto"
              style={{ height: "auto", width: "auto", maxHeight: "36px" }}
            />
          </Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/plataforma"
              className="bevel-btn group hidden items-center gap-2 border border-accent/60 bg-accent/15 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-foreground backdrop-blur transition-colors hover:bg-accent/25 sm:flex"
            >
              <span className="text-accent">◇</span> Plataforma
            </Link>
            <Link
              href="/proyectos"
              className="bevel-btn group hidden items-center gap-2 border border-border bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur transition-colors hover:bg-background/70 hover:text-foreground sm:flex"
            >
              <span className="text-accent">▣</span>{" "}
              <Scramble text={t.nav.projects} trigger={locale} />
            </Link>
            <Link
              href="/"
              className="bevel-btn group flex items-center gap-2 border border-border bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur transition-colors hover:bg-background/70 hover:text-foreground"
            >
              <span className="text-accent">◀</span>{" "}
              <Scramble text={t.nav.home} trigger={locale} />
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 pb-32 pt-12 md:px-10">
        {/* Hero */}
        <section className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
              <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
              <Scramble text="Laboratorio · Modelos de IA" trigger={locale} />
            </div>
            <h1 className="mt-5 font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl">
              <Scramble as="span" text="Probá la IA" trigger={`${locale}-1`} />
              <br />
              <span className="brand-gradient-text">
                <Scramble as="span" text="con tus propios ojos." trigger={`${locale}-2`} delayMs={200} />
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {isES
                ? "Cada modelo que ofrecemos en ARS Intelligence se puede ver acá en acción. Mirá cómo el sistema detecta personas, lee placas, verifica EPP, identifica caídas, intrusión, fuego, aglomeración y más. Activá tu cámara o subí un video para ver el patrón con tu propio contenido."
                : "Every model we offer at ARS Intelligence can be seen here in action. Watch how the system detects people, reads plates, verifies PPE, identifies falls, intrusion, fire, crowds and more. Turn on your camera or upload a video to see the pattern on your own content."}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {(["ALL", "people", "vehicle", "industrial", "perimeter", "ops"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                    filter === c
                      ? "border-accent bg-accent/25 text-foreground"
                      : "border-border/60 bg-background/40 text-foreground/55 hover:bg-secondary"
                  }`}
                >
                  {c === "ALL" ? (isES ? "Todas" : "All") : categoryLabels[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="bevel-card relative overflow-hidden border border-border/60 bg-background/40 p-6 backdrop-blur">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              {isES ? "Capacidades activas" : "Active capabilities"}
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-heading text-6xl font-black tracking-tight">
                {aiCapabilities.length}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/55">
                {isES ? "modelos de IA" : "AI models"}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {(["people", "vehicle", "industrial", "perimeter", "ops"] as const).map((c) => {
                const count = aiCapabilities.filter((cap) => cap.category === c).length;
                return (
                  <div
                    key={c}
                    className="border border-border/40 bg-secondary p-3"
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/55">
                      {categoryLabels[c]}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-heading text-2xl font-black">{count}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
                        {isES ? "modelos" : "models"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 font-serif text-sm italic text-foreground/55">
              {isES
                ? "Una sola plataforma. Todos los modelos. La forma simple de hacer que todo funcione."
                : "One platform. All models. The simple way to make everything work."}
            </p>
          </div>
        </section>

        {/* Capabilities grid */}
        <section className="mt-20">
          <h2 className="font-heading text-2xl font-black uppercase tracking-tight">
            <Scramble text={isES ? "Modelos disponibles" : "Available models"} trigger={locale} />
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((cap) => (
              <button
                key={cap.id}
                type="button"
                onClick={() => {
                  setSelectedId(cap.id);
                  setTab("showcase");
                  document.getElementById("demo-stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`group flex flex-col border bg-background/40 p-5 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-secondary/40 ${
                  selectedId === cap.id ? "border-accent" : "border-border/60"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/55">
                  <span>{categoryLabels[cap.category]}</span>
                  <span className="text-accent">{cap.metric.value}</span>
                </div>
                <h3 className="mt-3 font-heading text-base font-bold uppercase leading-tight tracking-tight text-foreground">
                  {cap.name}
                </h3>
                <p className="mt-2 flex-1 font-mono text-[11px] leading-relaxed text-foreground/55">
                  {cap.tagline}
                </p>
                <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55 group-hover:text-foreground">
                  <span>{cap.metric.label}</span>
                  <span className="text-accent">▸</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Demo stage */}
        <section id="demo-stage" className="mt-20 scroll-mt-24">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left: stage */}
            <div>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                    {isES ? "Demo en vivo" : "Live demo"}
                  </div>
                  <h2 className="mt-1 font-heading text-3xl font-black uppercase tracking-tight">
                    {selected.name}
                  </h2>
                </div>
                {/* Tabs */}
                <div className="flex">
                  {([
                    { id: "showcase", label: isES ? "Ejemplo" : "Sample" },
                    { id: "camera",   label: isES ? "Cámara en vivo" : "Live camera" },
                    { id: "upload",   label: isES ? "Subir video" : "Upload video" },
                  ] as const).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={`border-y border-r border-border/60 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors first:border-l ${
                        tab === t.id
                          ? "bg-accent/25 text-foreground"
                          : "bg-background/40 text-foreground/55 hover:bg-secondary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage content */}
              {tab === "showcase" && <ShowcaseStage capability={selected} />}
              {tab === "camera"   && <CameraStream demoType={selected.demoType} />}
              {tab === "upload"   && <VideoUpload  demoType={selected.demoType} />}

              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                {isES
                  ? "Las detecciones mostradas son una simulación visual del patrón. La detección real corre en el servidor ARS sobre las cámaras conectadas."
                  : "Detections shown are a visual simulation of the pattern. Real detection runs on the ARS server over connected cameras."}
              </p>
            </div>

            {/* Right: details */}
            <aside className="border border-border/60 bg-background/40 p-6 backdrop-blur">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {categoryLabels[selected.category]}
              </div>
              <h3 className="mt-2 font-heading text-2xl font-black uppercase leading-tight tracking-tight">
                {selected.name}
              </h3>
              <p className="mt-3 font-serif text-sm italic text-foreground/65">
                {selected.tagline}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-foreground/80">
                {selected.description}
              </p>

              <div className="mt-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  {isES ? "Casos de uso típicos" : "Typical use cases"}
                </div>
                <ul className="mt-3 space-y-2">
                  {selected.useCases.map((u) => (
                    <li
                      key={u}
                      className="flex items-start gap-3 border-l-2 border-accent/40 pl-3 font-mono text-[12px] text-foreground/75"
                    >
                      <span className="text-accent">▸</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/40 pt-6">
                <div className="border border-border/40 bg-secondary p-3">
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/55">
                    {selected.metric.label}
                  </div>
                  <div className="mt-1 font-heading text-2xl font-black tracking-tight text-accent">
                    {selected.metric.value}
                  </div>
                </div>
                <div className="border border-border/40 bg-secondary p-3">
                  <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/55">
                    {isES ? "Procesamiento" : "Processing"}
                  </div>
                  <div className="mt-1 font-heading text-2xl font-black tracking-tight text-accent">
                    Edge + Cloud
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* CTA */}
        <section className="brand-gradient relative mt-24 overflow-hidden">
          <div className="relative px-8 py-16 text-center text-white md:py-20">
            <h2 className="font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
              {isES ? "¿Querés probarlo sobre tus cámaras reales?" : "Want to try it on your real cameras?"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/85">
              {isES
                ? "Conectamos a tu infraestructura existente y activamos los modelos en menos de 48 horas. Sin reemplazar hardware."
                : "We connect to your existing infrastructure and activate the models in under 48 hours. No hardware replacement."}
            </p>
            <a
              href="mailto:afiliaciones.tuapo@gmail.com"
              className="bevel-btn mt-8 inline-flex items-center gap-3 bg-white px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary shadow-xl transition-all hover:bg-white/95"
            >
              <span>▸</span>
              {isES ? "Solicitar demo guiada" : "Request guided demo"}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

// ─────────────────────────── Showcase stage ───────────────────────────

function ShowcaseStage({ capability }: { capability: AICapability }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden border border-border/60 bg-deep">
      {/* Backdrop = product illustration with subtle dark overlay */}
      <Image
        src={capability.hero}
        alt=""
        fill
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-deep/30 via-transparent to-deep/60" />
      <div className="grid-bg absolute inset-0 opacity-30" />

      {/* Synthetic detection overlay */}
      <DemoOverlay demoType={capability.demoType} active />

      {/* HUD top */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/85">
        <div className="flex items-center gap-2 border border-accent/50 bg-deep/70 px-3 py-1.5 backdrop-blur">
          <span className="size-1.5 animate-pulse bg-red-500" />
          <span>SAMPLE · LOOP</span>
        </div>
        <div className="flex items-center gap-2 border border-border/40 bg-deep/70 px-3 py-1.5 backdrop-blur">
          <span className="text-accent">◉</span>
          <span>ARS · {capability.demoType.toUpperCase()}</span>
        </div>
      </div>

      {/* HUD bottom */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/65">
        <span>Cámara CCTV · 1920×1080 · 30 fps</span>
        <span className="text-accent">{capability.metric.label}: {capability.metric.value}</span>
      </div>
    </div>
  );
}
