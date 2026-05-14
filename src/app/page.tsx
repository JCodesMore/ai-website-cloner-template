"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CinematicCanvas, type SceneId } from "@/components/CinematicCanvas";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Scramble } from "@/components/Scramble";
import { ScrollScene } from "@/components/ScrollScene";
import { useI18n } from "@/lib/i18n/context";
import { sectionKeys, type SectionKey } from "@/lib/i18n/dictionaries";

/**
 * Scroll-cinema home — narrativa empresarial integral (8 escenas + cierre).
 *
 * Cada escena = sección ~3× viewport con sticky video en loop. Texto
 * encima en HTML/CSS con reveal escalonado (eyebrow → title → body → CTA).
 * Background global con CinematicCanvas que cambia su topología por escena.
 */

type SceneConfig = {
  key: SectionKey;
  videoSrc?: string;
  videoSrcMobile?: string;
  poster?: string;
  rampVh: number;
  placeholder: "city" | "cctv" | "data" | "control" | "alert" | "map";
  /** Variant del CinematicCanvas global */
  cinematic: SceneId;
  cta?: { label: string; href: string };
};

const scenes: SceneConfig[] = [
  // 01 — Seguridad integral, no solo cámaras
  {
    key: "integral",
    videoSrc: "/videos/01-physical-watch.mp4",
    videoSrcMobile: "/videos/01-physical-watch-mobile.mp4",
    poster: "/videos/01-physical-watch-poster.jpg",
    rampVh: 280,
    placeholder: "city",
    cinematic: "plataforma",
    cta: { label: "Conocer la plataforma", href: "#terreno" },
  },
  // 02 — Operación en campo
  {
    key: "terreno",
    // videoSrc: "/videos/02-field-ops.mp4",
    rampVh: 280,
    placeholder: "cctv",
    cinematic: "monitoreo",
    cta: { label: "Ver operación en campo", href: "#monitoreo" },
  },
  // 03 — Monitoreo inteligente
  {
    key: "monitoreo",
    // videoSrc: "/videos/03-control-room.mp4",
    rampVh: 300,
    placeholder: "control",
    cinematic: "monitoreo",
    cta: { label: "Ver capacidades", href: "#ia" },
  },
  // 04 — IA aplicada a la seguridad
  {
    key: "ia",
    // videoSrc: "/videos/04-ai-detection.mp4",
    rampVh: 300,
    placeholder: "data",
    cinematic: "inteligencia",
    cta: { label: "Ver capacidades de IA", href: "/plataforma#funcionalidades" },
  },
  // 05 — Alertas con evidencia
  {
    key: "alertas",
    // videoSrc: "/videos/05-alert-evidence.mp4",
    rampVh: 280,
    placeholder: "alert",
    cinematic: "decisiones",
    cta: { label: "Ver alertas en acción", href: "#respuesta" },
  },
  // 06 — Respuesta coordinada
  {
    key: "respuesta",
    // videoSrc: "/videos/06-response-flow.mp4",
    rampVh: 280,
    placeholder: "alert",
    cinematic: "decisiones",
    cta: { label: "Ver flujo de respuesta", href: "#control" },
  },
  // 07 — Control por clientes, zonas y sedes
  {
    key: "control",
    // videoSrc: "/videos/07-multisite.mp4",
    rampVh: 320,
    placeholder: "map",
    cinematic: "plataforma",
    cta: { label: "Ver arquitectura multisede", href: "/proyectos" },
  },
  // 08 — Decisiones, reportes y confianza
  {
    key: "decisiones",
    // videoSrc: "/videos/08-decisions-reports.mp4",
    rampVh: 320,
    placeholder: "data",
    cinematic: "decisiones",
    cta: { label: "Ver reportes ejecutivos", href: "#cierre" },
  },
];

export default function Home() {
  const { t, locale } = useI18n();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sections = scenes.map((s) => document.getElementById(s.key));
      const idx = sections.findIndex((el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2;
      });
      if (idx !== -1) setActiveIdx(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeScene: SceneId = scenes[activeIdx].cinematic;
  const isES = locale === "es";

  return (
    <div className="relative text-foreground">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          <Link href="#integral" className="flex items-center gap-2">
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
              <span className="text-accent">◇</span>{" "}
              <Scramble text="Plataforma" trigger={locale} />
            </Link>
            <Link
              href="/laboratorio"
              className="bevel-btn group hidden items-center gap-2 border border-border bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur transition-colors hover:bg-background/70 hover:text-foreground md:flex"
            >
              <span className="text-accent">◎</span>{" "}
              <Scramble text="Laboratorio" trigger={locale} />
            </Link>
            <Link
              href="/proyectos"
              className="bevel-btn group hidden items-center gap-2 border border-border bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur transition-colors hover:bg-background/70 hover:text-foreground sm:flex"
            >
              <span className="text-accent">▣</span>{" "}
              <Scramble text={t.nav.projects} trigger={locale} />
            </Link>
            <a
              href="#cierre"
              className="bevel-btn flex items-center gap-2 border border-border/60 bg-foreground px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-background"
            >
              <span>▸</span>{" "}
              <Scramble text={t.closing.ctaPrimary} trigger={locale} />
            </a>
          </nav>
        </div>
      </header>

      {/* SIDEBAR NAV */}
      <aside className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 md:left-10 md:block">
        <ul className="pointer-events-auto flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
          {scenes.map((scene, i) => {
            const sec = t.sections[scene.key];
            return (
              <li key={scene.key}>
                <a
                  href={`#${scene.key}`}
                  className={`flex items-center gap-3 transition-colors ${
                    i === activeIdx
                      ? "text-foreground"
                      : "text-foreground/35 hover:text-foreground/70"
                  }`}
                >
                  <span
                    className={`block size-[7px] transition-all ${
                      i === activeIdx
                        ? "bg-foreground"
                        : "bg-transparent border border-foreground/40"
                    }`}
                  />
                  <Scramble text={sec.label} trigger={`${locale}-${scene.key}`} />
                </a>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* CINEMATIC CANVAS background */}
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-background">
        <CinematicCanvas scene={activeScene} intensity={0.5} />
      </div>

      {/* SCENES */}
      <main className="relative">
        {scenes.map((scene, i) => (
          <ScrollScene
            key={scene.key}
            id={scene.key}
            videoSrc={scene.videoSrc}
            videoSrcMobile={scene.videoSrcMobile}
            poster={scene.poster}
            rampVh={scene.rampVh}
            placeholder={scene.placeholder}
          >
            {(progress) => (
              <SceneContent
                scene={scene}
                progress={progress}
                index={i}
                total={scenes.length}
                t={t}
                locale={locale}
              />
            )}
          </ScrollScene>
        ))}

        {/* CIERRE — CTA section */}
        <ClosingSection t={t} locale={locale} isES={isES} />

        {/* FOOTER */}
        <footer className="relative border-t border-border/60 bg-background py-12">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-10">
            <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">
              <Image
                src="/images/logos/horizontal-blanco.png"
                alt="ARS Intelligence"
                width={120}
                height={28}
                className="h-7 w-auto opacity-80"
                style={{ height: "auto", width: "auto", maxHeight: "28px" }}
              />
              <span className="hidden sm:inline">arsintelligence.com</span>
            </div>
            <p className="font-serif text-sm italic text-foreground/55">
              {t.footer.tagline}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
              © {new Date().getFullYear()} ARS Intelligence
            </p>
          </div>
        </footer>
      </main>

      {/* BOTTOM BAR */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-background/40 backdrop-blur">
        <div className="pointer-events-auto mx-auto flex max-w-[1800px] items-center justify-between px-6 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/65 md:px-10 md:text-[11px]">
          <button
            type="button"
            className="hidden items-center gap-2 transition-colors hover:text-foreground sm:flex"
          >
            <span className="opacity-70">🔇</span>{" "}
            <Scramble text={t.bottomBar.sound} trigger={locale} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-accent">↓</span>
            <span className="text-foreground/85 font-bold">
              {String(activeIdx + 1).padStart(2, "0")}
            </span>
            <span className="text-foreground/30">/</span>
            <span>{String(scenes.length).padStart(2, "0")}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">
              {t.sections[scenes[activeIdx].key].label}
            </span>
          </div>
          <a
            href="https://wa.me/"
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Scramble text={t.bottomBar.chat} trigger={locale} />{" "}
            <span className="text-accent">◇</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Scene content ───────────────────────────

function SceneContent({
  scene,
  progress,
  index,
  total,
  t,
  locale,
}: {
  scene: SceneConfig;
  progress: number;
  index: number;
  total: number;
  t: ReturnType<typeof useI18n>["t"];
  locale: string;
}) {
  const sec = t.sections[scene.key];

  // Reveal stages — eyebrow → title → body → CTA
  const eyebrowVis = stage(progress, 0.05, 0.8);
  const titleVis   = stage(progress, 0.15, 0.85);
  const bodyVis    = stage(progress, 0.32, 0.85);
  const ctaVis     = stage(progress, 0.5, 0.9);

  return (
    <div className="absolute inset-0 grid place-items-center px-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Eyebrow */}
        <div
          className="mb-6 font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/65 transition-all duration-700"
          style={{
            opacity: eyebrowVis,
            transform: `translateY(${(1 - eyebrowVis) * 16}px)`,
          }}
        >
          <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
          <span className="mr-2 text-accent">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          {sec.eyebrow.replace(/^\d+\s*\/\s*/, "")}
        </div>

        {/* Headline */}
        <h2
          className="font-heading text-3xl font-black uppercase leading-[1.05] tracking-tight md:text-5xl lg:text-[4.5rem] transition-all duration-700"
          style={{
            opacity: titleVis,
            transform: `translateY(${(1 - titleVis) * 32}px)`,
          }}
        >
          <Scramble
            as="span"
            text={sec.title1}
            trigger={`${locale}-${scene.key}-1`}
            durationMs={900}
          />
          <br />
          <span className="text-foreground/80">
            <Scramble
              as="span"
              text={sec.title2}
              trigger={`${locale}-${scene.key}-2`}
              durationMs={900}
              delayMs={200}
            />
          </span>
        </h2>

        {/* Body */}
        <p
          className="mt-8 max-w-3xl text-base leading-relaxed text-foreground/80 md:text-lg transition-all duration-700"
          style={{
            opacity: bodyVis,
            transform: `translateY(${(1 - bodyVis) * 24}px)`,
          }}
        >
          {sec.body}
        </p>

        {/* CTA */}
        {scene.cta && (
          <div
            className="mt-10 flex flex-wrap items-center gap-4 transition-all duration-700"
            style={{
              opacity: ctaVis,
              transform: `translateY(${(1 - ctaVis) * 24}px)`,
            }}
          >
            <a
              href={scene.cta.href}
              className="bevel-btn group inline-flex items-center gap-3 border border-border bg-background/40 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-foreground backdrop-blur transition-all hover:border-accent hover:bg-background/60"
            >
              <span className="text-accent transition-transform group-hover:translate-x-0.5">▸</span>
              <Scramble text={sec.cta} trigger={`${locale}-${scene.key}-cta`} />
            </a>
          </div>
        )}

        {/* Local progress bar */}
        <div className="mt-16 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div className="relative h-px flex-1 bg-foreground/15">
            <div
              className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-200"
              style={{ width: `${(progress * 100).toFixed(1)}%` }}
            />
          </div>
          <span>{(progress * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Closing section ───────────────────────────

function ClosingSection({
  t,
  locale,
  isES,
}: {
  t: ReturnType<typeof useI18n>["t"];
  locale: string;
  isES: boolean;
}) {
  return (
    <section
      id="cierre"
      className="relative isolate overflow-hidden border-t border-border/40 bg-background py-24 md:py-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="brand-gradient absolute inset-0 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(35,72,212,0.4),transparent_60%)]" />
        <div className="grid-bg absolute inset-0 opacity-15" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center text-white md:px-10">
        <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-white/70">
          <span className="mr-3 inline-block size-1.5 align-middle bg-white" />
          <Scramble text={t.closing.eyebrow} trigger={locale} />
        </div>

        <h2 className="mt-6 font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl">
          <Scramble as="span" text={t.closing.title1} trigger={`${locale}-c1`} durationMs={900} />
          <br />
          <span className="text-white/85">
            <Scramble as="span" text={t.closing.title2} trigger={`${locale}-c2`} durationMs={900} delayMs={200} />
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
          {t.closing.body}
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:afiliaciones.tuapo@gmail.com?subject=Solicitud de demo - ARS Intelligence"
            className="bevel-btn inline-flex items-center gap-3 bg-white px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-primary shadow-2xl transition-all hover:bg-white/95 hover:shadow-white/20"
          >
            <span>▸</span>
            <Scramble text={t.closing.ctaPrimary} trigger={locale} />
          </a>
          <Link
            href="/plataforma"
            className="bevel-btn inline-flex items-center gap-3 border border-white/40 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/10"
          >
            <span className="text-white/80">◇</span>
            <Scramble text={t.closing.ctaSecondary} trigger={locale} />
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 border-t border-white/20 pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 md:grid-cols-4">
          <TrustItem label={isES ? "Tiempo de despliegue" : "Deployment time"} value={isES ? "< 48h" : "< 48h"} />
          <TrustItem label={isES ? "Operación" : "Operation"} value="24/7" />
          <TrustItem label={isES ? "Cobertura" : "Coverage"} value="LATAM" />
          <TrustItem label={isES ? "Modelos IA" : "AI models"} value="12+" />
        </div>
      </div>
    </section>
  );
}

function TrustItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-heading text-2xl font-black tracking-tight text-white md:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[9px] tracking-[0.3em]">{label}</div>
    </div>
  );
}

/** Smooth reveal — `from` to `to` is the active range. Returns 0..1. */
function stage(p: number, from: number, to: number) {
  if (p < from) return 0;
  if (p > to) return 1;
  return (p - from) / (to - from);
}
