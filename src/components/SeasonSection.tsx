"use client";

import { useRef } from "react";
import { seasons } from "@/data/site";
import { ScrollReveal, StaggerReveal, StaggerChild } from "./ScrollReveal";
import { AdaptiveVideo } from "./AdaptiveVideo";

export function SeasonSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  return (
    <section id="season" className="relative">
      {/* Video background */}
      <div ref={parallaxRef} className="relative h-[80dvh] md:h-[100dvh] overflow-hidden">
        <AdaptiveVideo
          src4k="/videos/season-4k.mp4"
          src1080="/videos/season-1080p.mp4"
          src720="/videos/season-720p.mp4"
          src480="/videos/season-480p.mp4"
          poster="/videos/season-poster.jpg?v=2"
          posterAlt="Orca pod swimming in the Sea of Cortez near La Ventana"
          description="Footage of an orca pod swimming through the Sea of Cortez. Peak season for marine megafauna encounters runs January through April."
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-deep/18" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <ScrollReveal>
            <p className="text-teal-light/80 text-xs font-body tracking-[0.4em] uppercase mb-4">November through July</p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="text-display text-warm-white text-5xl md:text-7xl tracking-wide mb-6">When Is the Best Time to Visit?</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-warm-white/60 text-base md:text-lg font-body max-w-2xl leading-relaxed">
              The best time for marine wildlife encounters in the Sea of Cortez runs from November through July, with each month offering a different signature species. December through March is peak season for humpback whales returning from their Alaskan summer grounds, with sighting rates above 90% in protected waters near Cerralvo Island. January through April is prime orca season — pods of 4 to 12 individuals are commonly observed hunting mobula rays and dolphins. May through July brings massive mobula ray aggregations, often numbering in the thousands, alongside year-round residents like California sea lions, bottlenose dolphins, sea turtles, and over 800 species of reef fish documented in the Gulf of California (Source: CONABIO, Mexico&apos;s National Commission for the Knowledge and Use of Biodiversity).
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Season cards — LIGHT PANEL for readability */}
      <div className="light-panel py-24 md:py-32 px-6">
        <StaggerReveal className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 md:gap-16" staggerDelay={0.2}>
          {seasons.map((season) => (
            <StaggerChild key={season.name}>
              <div className="text-center group">
                <span className="text-teal-light text-xs font-body tracking-[0.3em] uppercase">{season.months}</span>
                <h3 className="text-display text-navy text-2xl md:text-3xl mt-4 mb-5">{season.name}</h3>
                <p className="text-navy/60 text-sm font-body leading-relaxed mb-6">{season.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {season.wildlife.map((animal) => (
                    <span key={animal} className="text-xs font-body text-navy/40 border border-navy/10 px-3 py-1 tracking-widest uppercase transition-colors duration-300 group-hover:border-teal-light/30 group-hover:text-teal-light/60">
                      {animal}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerChild>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
