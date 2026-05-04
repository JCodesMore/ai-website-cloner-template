"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";
import { AdaptiveVideo } from "../AdaptiveVideo";
import type { Tour } from "@/types";

const TOUR_HIGHLIGHTS: Record<string, string[]> = {
  "ocean-safari": [
    "Snorkel with mobula rays",
    "Bilingual marine guide",
    "Lunch on board",
    "Full snorkel kit + fins",
  ],
  "blue-expedition": [
    "3 full water days",
    "Boutique hostel stay included",
    "All meals + airport transfer",
    "Maximum wildlife encounters",
  ],
  "master-seafari": [
    "5 immersive water days",
    "Private en-suite room",
    "Marine education program",
    "Pro photography included",
  ],
};

const TOUR_VIDEO: Record<string, { base: string; poster: string }> = {
  "ocean-safari": {
    base: "/videos/mobile/ocean-safari",
    poster: "/videos/mobile/ocean-safari-poster.jpg",
  },
  "blue-expedition": {
    base: "/videos/mobile/blue-expedition",
    poster: "/videos/mobile/blue-expedition-poster.jpg",
  },
  "master-seafari": {
    base: "/videos/mobile/master-seafari",
    poster: "/videos/mobile/master-seafari-poster.jpg",
  },
};

export function TourDetailPageMobile({ tour }: { tour: Tour }) {
  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in the ${tour.name} expedition.`);
  const highlights = TOUR_HIGHLIGHTS[tour.slug] ?? tour.includes.slice(0, 4);
  const video = TOUR_VIDEO[tour.slug];

  function buzz() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(20);
  }

  return (
    <div className="md:hidden bg-deep">
      {/* Hero — full-bleed portrait */}
      <section className="relative h-[60dvh] overflow-hidden">
        {video ? (
          <AdaptiveVideo
            src4k={`${video.base}-4k.mp4`}
            src1080={`${video.base}-1080.mp4`}
            src720={`${video.base}-720.mp4`}
            poster={video.poster}
            posterAlt={`${tour.name} expedition footage in the Sea of Cortez`}
            className="absolute inset-0 w-full h-full"
            priority
          />
        ) : (
          <img
            src={tour.image}
            alt={tour.imageAlt}
            width={1080}
            height={1920}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/74 via-deep/14 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-teal-light/80 text-[10px] font-body tracking-[0.35em] uppercase mb-2"
          >
            {tour.duration}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-display text-warm-white text-3xl tracking-wide leading-[1.05]"
          >
            {tour.name.toUpperCase()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-warm-white/65 text-sm font-body mt-2 leading-snug max-w-[85%]"
          >
            {tour.tagline}
          </motion.p>
        </div>
      </section>

      {/* Sticky price strip */}
      <section className="sticky top-0 z-30 bg-deep/95 backdrop-blur-md border-b border-teal/10">
        <div className="px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-warm-white/40 text-[9px] font-body tracking-[0.3em] uppercase">Starting from</p>
            <p className="text-teal-light text-lg font-body font-medium tabular-nums leading-tight">
              {tour.pricePerPerson}
            </p>
          </div>
          <a
            href={`${siteConfig.whatsappLink}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              buzz();
              events.whatsappClick(`tour-detail-mobile-sticky-${tour.slug}`);
            }}
            className="bg-coral text-deep px-5 py-2.5 text-[11px] font-body font-medium tracking-[0.2em] uppercase rounded-sm active:scale-95 transition-transform"
          >
            Book →
          </a>
        </div>
      </section>

      {/* Highlights — quick visual scan */}
      <section className="px-5 py-6">
        <div className="grid grid-cols-2 gap-2.5">
          {highlights.map((h) => (
            <div
              key={h}
              className="bg-white/[0.04] border border-teal/15 rounded-sm p-3"
            >
              <p className="text-warm-white text-xs font-body leading-snug">{h}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The experience — readable description */}
      <section className="px-5 pb-6">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-3">The experience</p>
        <p className="text-warm-white/75 text-sm font-body leading-relaxed">
          {tour.description}
        </p>
      </section>

      {/* What's included — full list */}
      <section className="px-5 pb-6">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-3">What&apos;s included</p>
        <ul className="space-y-1">
          {tour.includes.map((item) => (
            <li key={item} className="flex items-start gap-2.5 py-2 border-b border-white/[0.04] text-sm font-body text-warm-white/75">
              <span className="text-teal-light flex-shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick facts */}
      <section className="px-5 pb-6">
        <div className="bg-white/[0.03] border border-teal/15 rounded-sm divide-y divide-white/[0.05]">
          <Row label="Duration" value={tour.duration} />
          <Row label="Season" value={tour.season} />
          <Row label="Group size" value="Max 6 guests" />
          <Row label="Departure" value="La Ventana, BCS" />
          {tour.priceNote && <Row label="Note" value={tour.priceNote} />}
        </div>
      </section>

      {/* Booking policy */}
      <section className="px-5 pb-6">
        <div className="bg-teal/8 border border-teal/15 p-4 rounded-sm">
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">Booking</p>
          <p className="text-warm-white/70 text-xs font-body leading-relaxed">
            60% deposit confirms your reservation. Non-refundable but transferable to another date, guest, or tour within 12 months. Free reschedule if weather makes the ocean unsafe.
          </p>
        </div>
      </section>

      {/* Bottom CTAs */}
      <section className="px-5 pb-8 pt-2 space-y-3">
        <a
          href={`${siteConfig.whatsappLink}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            buzz();
            events.whatsappClick(`tour-detail-mobile-bottom-${tour.slug}`);
          }}
          className="block w-full text-center bg-coral text-deep py-4 text-xs font-body font-medium tracking-[0.2em] uppercase rounded-sm active:scale-[0.98] transition-transform"
        >
          Book on WhatsApp
        </a>
        <a
          href="/tours"
          className="block w-full text-center text-warm-white/60 py-3 text-[11px] font-body tracking-[0.2em] uppercase border border-teal/20 rounded-sm active:bg-white/[0.04]"
        >
          Compare expeditions
        </a>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-4 py-3">
      <span className="text-warm-white/45 text-[10px] font-body tracking-[0.25em] uppercase flex-shrink-0">
        {label}
      </span>
      <span className="text-warm-white text-sm font-body text-right">{value}</span>
    </div>
  );
}
