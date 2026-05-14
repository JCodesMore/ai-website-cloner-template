"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven cinematic scene.
 *
 * Layout:
 *   <section min-h-[ramp]vh>        ← scroll "ramp" — taller than viewport
 *     <div sticky top-0 h-screen>   ← pinned visual (video + overlay)
 *       <video loop autoplay muted playsinline />
 *       <copy overlays positioned with reveal stages />
 *     </div>
 *   </section>
 *
 * Behavior:
 *   - Video plays in loop, always — never stops, never seeks. The user
 *     sees continuous motion regardless of how fast/slow they scroll.
 *   - As the user scrolls, the section's content "stays" thanks to the
 *     sticky child. Local scroll progress (0..1) is exposed so children
 *     can reveal themselves in stages.
 *   - When scroll reaches the bottom of the section, the sticky child
 *     un-pins and the next scene takes over.
 *
 * Cross-fade between scenes happens automatically because each scene's
 * sticky `<video>` has its own opacity tied to local progress edges.
 */

type Props = {
  /** Video URL (mp4 H.264). If omitted, renders a CSS placeholder. */
  videoSrc?: string;
  /** Optional smaller mobile version (served on viewports < 768px). */
  videoSrcMobile?: string;
  /** Optional poster (first frame) shown while the video loads. */
  poster?: string;
  /** Height of the scroll ramp, in vh. Default 300vh. */
  rampVh?: number;
  /** Optional id for in-page anchors. */
  id?: string;
  /** Children get a `progress` prop (0..1) and can reveal in stages. */
  children?: (progress: number) => React.ReactNode;
  /** Visual fallback when no video is provided. */
  placeholder?: "city" | "cctv" | "data" | "control" | "alert" | "map";
};

export function ScrollScene({
  videoSrc,
  videoSrcMobile,
  poster,
  rampVh = 300,
  id,
  children,
  placeholder = "city",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const handle = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) {
          setProgress(0);
          return;
        }
        const p = -rect.top / total;
        setProgress(Math.max(0, Math.min(1, p)));
      });
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  // Opacity envelope: fade in 0→0.1, hold 0.1→0.85, fade out 0.85→1
  const sceneOpacity =
    progress < 0.1
      ? progress / 0.1
      : progress > 0.85
      ? Math.max(0, 1 - (progress - 0.85) / 0.15)
      : 1;

  return (
    <section
      ref={sectionRef}
      id={id}
      style={{ minHeight: `${rampVh}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Visual layer — video or placeholder */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: sceneOpacity }}
        >
          {videoSrc ? (
            <video
              key={videoSrc}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="size-full object-cover"
            >
              {videoSrcMobile && (
                <source src={videoSrcMobile} type="video/mp4" media="(max-width: 768px)" />
              )}
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <ScenePlaceholder kind={placeholder} progress={progress} />
          )}
          {/* Vignette + gradient on top so text reads */}
          <div className="absolute inset-0 bg-gradient-to-b from-deep/30 via-transparent to-deep/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,10,24,0.7)_100%)]" />
          <div className="grid-bg absolute inset-0 opacity-25" />
        </div>

        {/* Copy layer — sits above visuals */}
        <div className="relative z-10 size-full">{children?.(progress)}</div>

        {/* Scroll cue at the bottom of the first scene area */}
        {progress < 0.05 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/50">
              <span className="mr-2 inline-block animate-bounce text-accent">↓</span>
              Scroll para explorar
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────── Placeholder visuals ───────────────────────────

function ScenePlaceholder({
  kind,
  progress,
}: {
  kind: "city" | "cctv" | "data" | "control" | "alert" | "map";
  progress: number;
}) {
  return (
    <div className="absolute inset-0 bg-deep">
      {/* Animated gradient based on kind */}
      <div
        className="glow-blob glow-drift absolute inset-0"
        style={{
          background:
            kind === "alert"
              ? "radial-gradient(circle at 50% 50%, rgba(239,68,68,0.35), transparent 60%)"
              : kind === "control"
              ? "radial-gradient(circle at 50% 50%, rgba(35,72,212,0.45), transparent 65%)"
              : kind === "data"
              ? "radial-gradient(circle at 50% 30%, rgba(107,138,255,0.5), transparent 60%)"
              : kind === "map"
              ? "radial-gradient(circle at 30% 60%, rgba(35,72,212,0.4), transparent 60%), radial-gradient(circle at 75% 40%, rgba(107,138,255,0.35), transparent 60%)"
              : kind === "cctv"
              ? "radial-gradient(circle at 50% 70%, rgba(35,72,212,0.3), transparent 65%)"
              : "radial-gradient(circle at 50% 50%, rgba(20,38,100,0.5), transparent 70%)",
        }}
      />
      {/* Particle drift */}
      <ParticleField kind={kind} progress={progress} />
      {/* Scan line */}
      <div
        className="absolute inset-x-0 h-px"
        style={{
          top: `${(progress * 100).toFixed(2)}%`,
          background:
            "linear-gradient(90deg, transparent, rgba(35,72,212,0.7), transparent)",
        }}
      />
      {/* "Placeholder" label so user knows where to drop the video */}
      <div className="absolute right-6 top-6 border border-border/60 bg-background/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50 backdrop-blur">
        ◇ placeholder · {kind}
      </div>
    </div>
  );
}

function ParticleField({
  kind,
  progress,
}: {
  kind: string;
  progress: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const count = kind === "map" ? 80 : kind === "data" ? 120 : 50;
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      size: 0.5 + Math.random() * 1.5,
      alpha: 0.3 + Math.random() * 0.6,
    }));

    const start = performance.now();
    const tick = (now: number) => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      const t = (now - start) / 1000;
      for (const p of particles) {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        const x = p.x * w;
        const y = p.y * h + Math.sin(t * 0.5 + p.x * 10) * 4;
        ctx.fillStyle = `rgba(213, 224, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(35, 72, 212, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [kind]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 size-full"
      style={{ opacity: 0.6 + progress * 0.2 }}
    />
  );
}
