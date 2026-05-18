"use client";

import { useCallback, useEffect, useRef } from "react";

const HERO_VIDEO = "/videos/95382adb8d674929153e2bf1b15d8793e2e2a275.mp4";
const HERO_POSTER = "/images/realisations/real_0_cover.webp";

/**
 * Hero + scroll-scrubbed video reveal in one section.
 *
 *  scrollY 0%   -> dark hero with directional motion blur,
 *                  video visible ONLY through monogram shape (clear, no blur)
 *  scrollY 35%  -> overlay fades out, full video bleeds through
 *  scrollY 55%+ -> "Outdoor Agency" reveal text fades in over the video
 *
 *  The monogram "window" is achieved by applying an INVERSE mask to the dark
 *  overlay: a white (opaque) rectangle with black (transparent) monogram paths
 *  punched through it. This uses a single video — no sync issues.
 *
 *  Motion blur is achieved via an SVG feGaussianBlur filter with asymmetric
 *  stdDeviation (stronger horizontal than vertical) for a cinematic look.
 *
 *  Section is 3 viewports tall so the inner sticky child has scroll runway.
 */

/* 4 filled monogram paths extracted from the original site's #indexLogo clipPath.
   These use objectBoundingBox coordinates (0-1 range). */
const MONOGRAM_PATHS = [
  "M0 0.5C0 0.5 0 0.5001 0 0.5002H0.217H0.217C0.217 0.5002 0.217 0.5001 0.217 0.5C0.217 0.343 0.343 0.217 0.5 0.217V0C0.223 0 0 0.223 0 0.5Z",
  "M1 0.001C1 0.001 1 0.0009 1 0.0008H0.782H0.782C0.782 0.0008 0.782 0.0009 0.782 0.001C0.782 0.157 0.657 0.282 0.5 0.282V0.5C0.777 0.5 1 0.277 1 0.001Z",
  "M0 1C0 1 0 0.9999 0 0.9998H0.217H0.217C0.217 0.9998 0.217 0.9999 0.217 1C0.217 0.843 0.343 0.717 0.5 0.717V0.5C0.223 0.5 0 0.723 0 1Z",
  "M1 0.5C1 0.5 1 0.5001 1 0.5002H0.782H0.782C0.782 0.5002 0.782 0.5001 0.782 0.5C0.782 0.657 0.657 0.782 0.5 0.782V1C0.777 1 1 0.777 1 0.5Z",
];

/** Build an SVG data-URI mask that's white everywhere except the centered monogram. */
function buildOverlayMask(vw: number, vh: number): string {
  const size = Math.min(vw, vh) * 0.52;
  const cx = (vw - size) / 2;
  const cy = (vh - size) / 2 - 40;
  const paths = MONOGRAM_PATHS.map((d) => `<path d='${d}' fill='black'/>`).join("");
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${vw}' height='${vh}'>` +
    `<rect width='${vw}' height='${vh}' fill='white'/>` +
    `<g transform='translate(${cx},${cy}) scale(${size})'>${paths}</g>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const videoTextRef = useRef<HTMLDivElement>(null);

  /** Apply the inverse-monogram mask to the overlay (viewport-dependent). */
  const applyMask = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mask = buildOverlayMask(vw, vh);
    overlay.style.maskImage = mask;
    overlay.style.webkitMaskImage = mask;
    overlay.style.maskSize = "100% 100%";
    overlay.style.maskMode = "luminance";
    (overlay.style as unknown as Record<string, string>).webkitMaskSize = "100% 100%";
    (overlay.style as unknown as Record<string, string>).webkitMaskMode = "luminance";
  }, []);

  /* Scroll-driven animation */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const fadePhase = Math.min(1, progress / 0.35);
      const revealPhase = Math.max(0, (progress - 0.55) / 0.45);

      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(1 - fadePhase);
      }
      if (heroTextRef.current) {
        heroTextRef.current.style.opacity = String(1 - fadePhase);
      }
      if (videoTextRef.current) {
        videoTextRef.current.style.opacity = String(Math.min(1, revealPhase * 1.4));
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    applyMask();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      applyMask();
      onScroll();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [applyMask]);

  return (
    <section ref={sectionRef} className="relative z-[1] h-[300vh] w-full">
      {/* SVG filter for directional motion blur */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="motionBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18 6" />
          </filter>
        </defs>
      </svg>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 1: Background video -- plays from first paint */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        {/* Layer 2: Motion-blur layer — blurs the video directionally.
            Separate from the dark overlay so blur + mask + opacity all compose. */}
        <div
          ref={overlayRef}
          aria-hidden
          className="absolute inset-0"
        >
          {/* Sub-layer A: directional motion blur on the video */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "url(#motionBlur)",
              WebkitBackdropFilter: "url(#motionBlur)",
            }}
          />
          {/* Sub-layer B: dark tint at 40% */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(17,18,29,0.40)",
            }}
          />
        </div>

        {/* Layer 3: Hero content (headline + scroll indicator) */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-between px-6 pb-14 pt-32 text-white"
        >
          <div className="flex-1" />

          <h1
            className="relative z-10 max-w-[1180px] text-center font-display font-bold leading-[1.02] tracking-[-0.018em]"
            style={{ fontSize: "clamp(40px, 7vw, 104px)" }}
          >
            <span className="block opacity-95">Together we shape the</span>
            <span className="block opacity-95">success of your season</span>
          </h1>

          <div className="relative z-10 mt-12 flex flex-col items-center gap-2.5 text-white">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-[radar-pulse_2.4s_ease-out_infinite] rounded-full bg-white/30" />
              <span className="relative h-3 w-3 rounded-full border border-white/85" />
            </span>
            <span className="font-mono-display text-[10px] font-bold tracking-[0.22em] opacity-85">
              SCROLL&nbsp;DOWN
            </span>
          </div>
        </div>

        {/* Layer 4: "Outdoor Agency" reveal */}
        <div
          ref={videoTextRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"
          style={{ opacity: 0 }}
        >
          <h2
            className="font-display font-bold leading-[0.94] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(72px, 12vw, 180px)",
              textShadow: "0 4px 60px rgba(0,0,0,0.35)",
            }}
          >
            <span className="block">Outdoor</span>
            <span className="block">Agency</span>
          </h2>
          <p
            className="mt-10 max-w-[640px] font-display leading-[1.55] text-white/95"
            style={{
              fontSize: "clamp(15px, 1.2vw, 19px)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            For more than three decades, Aurora Agency has partnered with luxury
            hotels and upscale campsites to craft communication that inspires.
            With 40+ creative experts and over 300 projects completed, our
            agency delivers design, digital strategy, film, print, and
            consulting that blend elegance with innovation.
          </p>
        </div>

        {/* Layer 5: Bottom gradient for smooth transition to next section */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[25vh]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(17,18,29,0.6) 60%, #11121d 100%)",
          }}
        />
      </div>
    </section>
  );
}
