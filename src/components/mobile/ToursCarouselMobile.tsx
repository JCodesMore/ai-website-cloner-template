"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { tours } from "@/data/site";

const tourSummaries: Record<string, string> = {
  "ocean-safari": "Day trip to Cerralvo Island for snorkeling with mobula rays, dolphins, and seasonal megafauna.",
  "blue-expedition": "Three water days, four nights, all-inclusive. Boutique stay plus full marine itinerary.",
  "master-seafari": "Five immersive days on the water for serious nature lovers and ocean travelers.",
};

export function ToursCarouselMobile() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    duration: 22,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Initial state matches Embla's default startIndex (0); subsequent updates
    // come from the "select" listener so we never call setState in the effect body.
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  function scrollTo(index: number) {
    emblaApi?.scrollTo(index);
  }

  return (
    <div className="md:hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {tours.map((tour, idx) => (
            <a
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className={`flex-[0_0_85%] min-w-0 px-2 ${idx === 0 ? "pl-5" : ""} ${idx === tours.length - 1 ? "pr-5" : ""} active:opacity-90 transition-opacity`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <img
                  src={tour.image}
                  alt={tour.imageAlt}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/30 to-transparent" />
                <span className="absolute top-4 left-4 bg-deep/80 backdrop-blur-sm text-warm-white text-[10px] font-body px-3 py-1.5 tracking-[0.2em] uppercase">
                  {tour.season}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-warm-white/40 text-[9px] font-body tracking-[0.3em] uppercase mb-1">
                    {tour.duration}
                  </p>
                  <h3 className="text-display text-warm-white text-2xl tracking-wide leading-tight">{tour.name}</h3>
                  <p className="text-warm-white/70 text-sm font-body leading-relaxed mt-3 line-clamp-2">
                    {tourSummaries[tour.slug] ?? tour.tagline}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-teal-light text-sm font-body tabular-nums">{tour.pricePerPerson}</span>
                    <span className="text-warm-white/50 text-[10px] font-body tracking-[0.2em] uppercase">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {tours.map((tour, i) => (
          <button
            key={tour.slug}
            onClick={() => scrollTo(i)}
            aria-label={`Go to ${tour.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              selectedIndex === i ? "w-8 bg-teal-light" : "w-1.5 bg-warm-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
