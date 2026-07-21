"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide, AnimeCardData } from "@/types/anime";
import { useOverlay } from "@/components/overlay/OverlayProvider";

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const { openDetail } = useOverlay();
  const [idx, setIdx] = useState(0);
  const count = slides.length;

  const go = useCallback((n: number) => setIdx((p) => (n + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % count), 7000);
    return () => clearInterval(t);
  }, [count]);

  const slide = slides[idx];

  const slideCard: AnimeCardData = {
    id: slide.id,
    slug: slide.slug,
    title: slide.title,
    poster: slide.thumbnail ?? slide.backdrop,
    score: slide.score,
    format: slide.format,
  };

  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
      {/* Backdrops */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <Image
            src={s.backdrop}
            alt={s.title}
            fill
            priority={i === 0}
            className="object-cover object-top"
          />
        </div>
      ))}
      {/* Scrims */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full max-w-[900px] flex-col justify-end gap-4 px-6 pb-24 md:pl-[92px]">
        <h1 className="font-heading text-5xl font-extrabold tracking-tight md:text-7xl">
          {slide.title}
        </h1>
        {slide.genres && (
          <div className="flex flex-wrap gap-2">
            {slide.genres.map((g) => (
              <span
                key={g}
                className="rounded-md border border-accent/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent"
              >
                {g}
              </span>
            ))}
          </div>
        )}
        <p className="max-w-[560px] text-sm leading-relaxed text-slate-300 line-clamp-3 md:text-base">
          {slide.synopsis}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={() => openDetail(slideCard)}
            className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-[var(--accent-foreground)] transition-transform hover:scale-[1.03]"
          >
            <Play className="size-4 fill-current" /> Watch Now
          </button>
          <button
            onClick={() => openDetail(slideCard)}
            className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/5 px-6 py-2.5 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <Info className="size-4" /> More Info
          </button>
        </div>
      </div>

      {/* Slide selector: compact arrows + counter, bottom-left (matches reference) */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 md:pl-[68px]">
        <button
          onClick={() => go(idx - 1)}
          aria-label="Previous"
          className="flex size-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white/5 backdrop-blur transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-xs font-semibold tabular-nums text-slate-400">
          {String(idx + 1).padStart(2, "0")}
          <span className="text-slate-600"> / {String(count).padStart(2, "0")}</span>
        </span>
        <button
          onClick={() => go(idx + 1)}
          aria-label="Next"
          className="flex size-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-white/5 backdrop-blur transition-colors hover:bg-white/10"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
