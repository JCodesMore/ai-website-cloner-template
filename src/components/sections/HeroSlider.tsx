"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRatingIcon } from "@/components/icons";

const AUTOPLAY_INTERVAL_MS = 6000;

interface Slide {
  id: string;
  heading: [string, string, string]; // [before italic, italic phrase, after italic]
  subtext: string;
  cta: string;
}

const slides: Slide[] = [
  {
    id: "slide-1",
    heading: ["Et si votre bien-être tenait en ", "un seul verre", " ?"],
    subtext: "Rejoignez +5000 abonnés",
    cta: "Offre de juin : 15€ de réduction",
  },
  {
    id: "slide-2",
    heading: ["Enfin un complément qui suit ", "votre rythme", ""],
    subtext:
      "Votre vie n'est pas simple. Alors votre complément devrait l'être.",
    cta: "Je profite de 15€ offerts",
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    clearAutoplay();
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);
  }, [clearAutoplay]);

  useEffect(() => {
    if (!isHovered) {
      startAutoplay();
    } else {
      clearAutoplay();
    }
    return clearAutoplay;
  }, [isHovered, startAutoplay, clearAutoplay, activeIndex]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  return (
    <section
      className="relative min-h-[700px] h-screen w-full overflow-hidden bg-onday-green"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Présentation Onday"
    >
      {/* Slide 1: video background */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          activeIndex === 0 ? "opacity-100 z-[1]" : "opacity-0 z-0"
        )}
        aria-hidden={activeIndex !== 0}
      >
        <video
          className="hidden md:block h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/onday/66f2d2c28870466eae358b3516f57eb6.thumbnail.0000000000.jpg"
        >
          <source
            src="/videos/onday/66f2d2c28870466eae358b3516f57eb6.HD-1080p-7.2Mbps-77993130.mp4"
            type="video/mp4"
          />
        </video>
        <video
          className="block md:hidden h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/onday/de9997efe0724c9792f0da671514477d.thumbnail.0000000000.jpg"
        >
          <source
            src="/videos/onday/de9997efe0724c9792f0da671514477d.HD-1080p-7.2Mbps-77839928.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Slide 2: static image background */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          activeIndex === 1 ? "opacity-100 z-[1]" : "opacity-0 z-0"
        )}
        aria-hidden={activeIndex !== 1}
      >
        <Image
          src="/images/onday/1200628_Gamme_face.png"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Dark gradient overlay for legibility */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Prev/Next arrow buttons */}
      <div className="absolute right-6 top-6 z-10 flex gap-2 md:right-16 md:top-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Diapositive précédente"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-onday-green shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Diapositive suivante"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-onday-green shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex h-full w-full items-end">
        <div className="w-full max-w-[640px] px-6 pb-16 md:px-16 md:pb-24">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "transition-opacity duration-500 ease-in-out",
                index === activeIndex
                  ? "opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              )}
              aria-hidden={index !== activeIndex}
            >
              <h1 className="font-heading text-[28px] leading-[1.1] font-normal text-white md:text-[40px]">
                {slide.heading[0]}
                <em className="italic">{slide.heading[1]}</em>
                {slide.heading[2]}
              </h1>

              <p className="mt-4 text-base text-white">{slide.subtext}</p>

              <button
                type="button"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-onday-green py-3.5 pl-6 pr-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{slide.cta}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-onday-lime text-onday-green">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>

              <div className="mt-6 flex items-center gap-2">
                <StarRatingIcon className="h-4 w-auto" aria-hidden="true" />
                <span className="text-sm text-white">
                  4.7/5 | Excellent sur Trustpilot
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot pagination */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 md:bottom-8 md:left-16">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
            aria-current={index === activeIndex}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === activeIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  );
}
