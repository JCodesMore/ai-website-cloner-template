"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { HERO_SLIDES } from "@/lib/content";

const AUTO_ADVANCE_MS = 7000;

export function HeroBanner() {
  const slideCount = HERO_SLIDES.length;
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slideCount);
    }, AUTO_ADVANCE_MS);
  }, [clearTimer, slideCount]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const step = useCallback(
    (dir: 1 | -1) => {
      setActive((prev) => (prev + slideCount + dir) % slideCount);
      startTimer();
    },
    [slideCount, startTimer],
  );

  return (
    <section className="relative h-[750px] lg:h-[750px] overflow-hidden bg-black">
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === active;
        return (
          <div
            key={slide.bg}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.bg}
              alt=""
              fill
              priority={idx === 0}
              loading={idx === 0 ? undefined : "lazy"}
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Left dark overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 from-30% via-black/40 via-60% to-transparent" />

            {/* Content */}
            <div className="yo-container relative z-10 flex h-full items-center">
              <div className="max-w-[700px]">
                <h1 className="yo-headline-split text-white text-[40px] md:text-[56px] lg:text-[80px] mb-[30.4px]">
                  {slide.heading}{" "}
                  <span className="light">{slide.highlight}</span>
                </h1>
                <p className="hidden md:block text-white/80 text-[17.6px] leading-[1.7] mb-[35.2px] max-w-[560px]">
                  {slide.intro}
                </p>
                <div className="flex gap-3">
                  <a href="#read-more" className="yo-btn yo-btn-primary">
                    Read More
                  </a>
                  <a href="#contact" className="yo-btn yo-btn-outline-white">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Decorative shapes — right side, top */}
      <div
        className="yo-anim-y pointer-events-none absolute hidden xl:block"
        style={{
          width: 320,
          height: 270,
          top: 82.5,
          right: -112,
          background: "rgb(223, 3, 3)",
          borderRadius: 10,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          width: 420,
          height: 360,
          top: -22,
          right: -98,
          border: "2px solid rgba(225, 225, 225, 0.4)",
          borderRadius: 10,
        }}
        aria-hidden="true"
      />

      {/* Ambient decorations */}
      <span
        className="yo-deco-square yo-deco-square--red hidden sm:block"
        style={{ width: 40, height: 40, bottom: 128, left: 32 }}
        aria-hidden="true"
      />
      <span
        className="yo-deco-square yo-deco-square--outline"
        style={{ width: 40, height: 40, bottom: 48, left: 48 }}
        aria-hidden="true"
      />
      <span
        className="yo-deco-dot yo-anim-drift"
        style={{
          width: 16,
          height: 16,
          bottom: "25%",
          right: "18%",
          background: "var(--color-primary)",
        }}
        aria-hidden="true"
      />
      <span
        className="yo-deco-dot yo-anim-drift"
        style={{
          width: 16,
          height: 16,
          top: "20%",
          left: "15%",
          background: "#ffffff",
        }}
        aria-hidden="true"
      />

      {/* Arrow nav — xl+ only */}
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden xl:flex items-center justify-center size-12 rounded-full bg-primary/70 hover:bg-primary text-white transition-colors"
      >
        <ArrowLeftIcon className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden xl:flex items-center justify-center size-12 rounded-full bg-primary/70 hover:bg-primary text-white transition-colors"
      >
        <ArrowRightIcon className="size-5" />
      </button>
    </section>
  );
}
