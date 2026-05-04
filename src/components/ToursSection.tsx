"use client";

import { motion } from "framer-motion";
import { tours } from "@/data/site";
import { ScrollReveal, StaggerReveal, StaggerChild } from "./ScrollReveal";
import { AdaptiveVideo } from "./AdaptiveVideo";
import { LiquidButton } from "./ui/liquid-glass-button";
import { ToursCarouselMobile } from "./mobile/ToursCarouselMobile";

const tourSummaries: Record<string, string> = {
  "ocean-safari": "Day trip to Cerralvo Island for snorkeling with mobula rays, dolphins, and seasonal megafauna.",
  "blue-expedition": "Three water days, four nights, all-inclusive — boutique stay plus full marine itinerary.",
  "master-seafari": "Five immersive days on the water for serious nature lovers and ocean travelers.",
};

export function ToursSection() {
  return (
    <section id="tours" className="relative bg-deep">
      {/* Video header */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <AdaptiveVideo
          src4k="/videos/tours-4k.mp4"
          src1080="/videos/tours-1080p.mp4"
          src720="/videos/tours-720p.mp4"
          src480="/videos/tours-480p.mp4"
          poster="/videos/tours-poster.jpg?v=2"
          posterAlt="POV from a Bajablue expedition boat with orcas surfacing nearby"
          description="POV footage from a Bajablue expedition boat in the Sea of Cortez — orcas surfacing nearby during a wildlife encounter."
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-deep/18" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <ScrollReveal>
            <p className="text-teal-light text-xs font-body tracking-[0.4em] uppercase mb-4">Choose Your Adventure</p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="text-display text-warm-white text-4xl md:text-7xl tracking-wide">What Expeditions Does Bajablue Offer?</h2>
          </ScrollReveal>
        </div>
      </div>

      {/* Mobile — Embla swipe carousel */}
      <div className="py-12 md:hidden">
        <ToursCarouselMobile />
        <div className="text-center mt-8 px-5">
          <a
            href="/tours"
            className="inline-block w-full text-center bg-white/[0.04] border border-teal/20 text-warm-white py-4 text-xs font-body tracking-[0.2em] uppercase rounded-sm active:bg-white/[0.08]"
          >
            Compare All Expeditions
          </a>
        </div>
      </div>

      {/* Desktop — original grid layout */}
      <div className="hidden md:block max-w-6xl mx-auto py-24 md:py-32 px-6">

        <StaggerReveal className="grid md:grid-cols-3 gap-6 md:gap-10" staggerDelay={0.2}>
          {tours.map((tour) => (
            <StaggerChild key={tour.slug}>
              <motion.div className="group cursor-pointer"
                whileHover={{ y: -8 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img src={tour.image} alt={tour.imageAlt} width={800} height={600} loading="lazy" decoding="async" className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }} transition={{ duration: 0.7, ease: "easeOut" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/10 to-transparent transition-opacity duration-500 group-hover:from-deep/50" />
                  <span className="absolute top-4 left-4 bg-deep/80 backdrop-blur-sm text-warm-white text-xs font-body px-3 py-1.5 tracking-[0.2em] uppercase">{tour.season}</span>
                </div>

                <div className="pt-6">
                  <h3 className="text-display text-warm-white text-2xl md:text-3xl tracking-wide group-hover:text-teal-light transition-colors duration-500">{tour.name}</h3>
                  <p className="text-warm-white/30 text-xs font-body mt-1 tracking-[0.2em] uppercase">{tour.duration}</p>
                  <p className="text-warm-white/50 text-sm font-body leading-relaxed mt-4">{tourSummaries[tour.slug] ?? tour.tagline}</p>
                  <a href={`/tours/${tour.slug}`}
                    className="inline-flex items-center gap-2 mt-5 text-warm-white/40 hover:text-teal-light text-xs font-body tracking-[0.2em] uppercase transition-colors duration-300 group/link">
                    View Details
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </StaggerChild>
          ))}
        </StaggerReveal>

        <ScrollReveal className="text-center mt-16">
          <a href="/tours" className="inline-flex">
            <LiquidButton size="xl" className="text-warm-white font-body text-xs tracking-[0.2em] uppercase rounded-full">
              Compare All Expeditions
            </LiquidButton>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
