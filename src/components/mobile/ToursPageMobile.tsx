"use client";

import { motion } from "framer-motion";
import { tours, siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";
import { AdaptiveVideo } from "../AdaptiveVideo";

const tourBgGradients: Record<string, string> = {
  "ocean-safari": "from-teal/40 to-deep",
  "blue-expedition": "from-navy/60 to-deep",
  "master-seafari": "from-copper/40 to-deep",
};

export function ToursPageMobile() {
  return (
    <div className="md:hidden bg-deep min-h-[100dvh] flex flex-col">
      {/* Expedition hero */}
      <section className="relative h-[58svh] min-h-[430px] max-h-[620px] overflow-hidden flex-shrink-0">
        <AdaptiveVideo
          src4k="/videos/mobile/master-seafari-4k.mp4"
          src1080="/videos/mobile/master-seafari-1080.mp4"
          src720="/videos/mobile/master-seafari-720.mp4"
          poster="/videos/mobile/master-seafari-poster.jpg"
          posterAlt="Orcas and a Bajablue expedition boat in the Sea of Cortez"
          className="absolute inset-0 w-full h-full"
          objectPosition="center 45%"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/72 via-deep/14 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 text-center px-6 pb-10 z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-teal-light/80 text-[10px] font-body tracking-[0.3em] uppercase mb-2"
          >
            Choose your adventure
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-display text-warm-white text-3xl tracking-wide leading-tight"
          >
            OUR EXPEDITIONS
          </motion.h1>
        </div>
      </section>

      {/* 3 stacked tour cards — all visible in one screen */}
      <section className="flex-1 px-4 py-4 flex flex-col gap-3">
        {tours.map((tour, i) => (
          <motion.a
            key={tour.slug}
            href={`/tours/${tour.slug}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            className="relative flex-1 min-h-0 overflow-hidden rounded-sm border border-teal/15 active:scale-[0.99] transition-transform"
          >
            <img
              src={tour.image}
              alt={tour.imageAlt}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${tourBgGradients[tour.slug] ?? "from-deep/60 to-deep/90"}`} />
            <div className="relative h-full p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-warm-white/50 text-[9px] font-body tracking-[0.3em] uppercase mb-1">
                  {tour.duration}
                </p>
                <h2 className="text-display text-warm-white text-xl tracking-wide leading-tight mb-1">
                  {tour.name}
                </h2>
                <p className="text-warm-white/65 text-xs font-body leading-snug line-clamp-2">
                  {tour.tagline}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-teal-light text-sm font-body font-medium tabular-nums leading-tight">
                  {tour.pricePerPerson.replace("Mexican Pesos", "MXN")}
                </p>
                <p className="text-warm-white/35 text-[9px] font-body tracking-widest uppercase mt-0.5">
                  {tour.season.length > 12 ? tour.season.split(" ")[0] : tour.season}
                </p>
                <span className="inline-block mt-2 text-coral text-[10px] font-body tracking-[0.2em] uppercase">
                  Details →
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </section>

      {/* Sticky compare CTA */}
      <section className="px-4 pb-4 flex-shrink-0">
        <a
          href={`${siteConfig.whatsappLink}?text=${encodeURIComponent("Hi! I have a question about which expedition is right for me.")}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => events.whatsappClick("tours-page-mobile-compare")}
          className="block w-full text-center bg-white/[0.04] border border-teal/20 text-warm-white py-3 text-[11px] font-body tracking-[0.2em] uppercase rounded-sm active:bg-white/[0.08]"
        >
          Not sure? Ask on WhatsApp
        </a>
      </section>
    </div>
  );
}
