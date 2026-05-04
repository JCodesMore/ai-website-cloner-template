"use client";

import { motion } from "framer-motion";
import { AdaptiveVideo } from "../AdaptiveVideo";

export function AboutPageMobile() {
  return (
    <div className="md:hidden bg-deep">
      {/* Hero */}
      <section className="relative h-[42dvh] overflow-hidden">
        <AdaptiveVideo
          src4k="/videos/mobile/about-story-4k.mp4"
          src1080="/videos/mobile/about-story-1080.mp4"
          src720="/videos/mobile/about-story-720.mp4"
          poster="/videos/mobile/about-story-poster.jpg"
          posterAlt="Bajablue marine guide story footage from the Sea of Cortez"
          className="absolute inset-0 w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/16 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-teal-light/80 text-[10px] font-body tracking-[0.35em] uppercase mb-2"
          >
            Our story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-display text-warm-white text-3xl tracking-wide leading-tight"
          >
            ABOUT BAJABLUE
          </motion.h1>
        </div>
      </section>

      {/* Mission quote — featured */}
      <section className="px-5 py-8">
        <div className="border-l-2 border-teal pl-5">
          <p className="text-warm-white text-base font-body leading-relaxed italic">
            &ldquo;The animals come first. We don&apos;t chase, we don&apos;t crowd, and if something wants to be left alone, we leave it alone.&rdquo;
          </p>
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mt-3">— Bajablue founders</p>
        </div>
      </section>

      {/* Team card */}
      <section className="px-5 py-6">
        <div
          className="bg-white/[0.04] border border-teal/15 rounded-sm p-5"
        >
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">Founders &amp; team members</p>
          <h2 className="text-display text-warm-white text-2xl tracking-wide mb-3">
            Bajablue Team
          </h2>
          <p className="text-warm-white/65 text-sm font-body leading-relaxed mb-4">
            A small La Ventana-based team built around patient wildlife observation, local sea-state knowledge, and respectful guest care.
          </p>
          <dl className="grid grid-cols-2 gap-3 text-xs font-body">
            <Fact label="Based in" value="La Ventana, BCS" />
            <Fact label="Role" value="Founders · guides" />
            <Fact label="Languages" value="Spanish · English" />
            <Fact label="Founded" value="2025" />
          </dl>
        </div>
      </section>

      {/* Story — compact */}
      <section className="px-5 py-4 space-y-5">
        <div>
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">The Sea of Cortez</p>
          <p className="text-warm-white/75 text-sm font-body leading-relaxed">
            UNESCO World Heritage Site. 39% of the world&apos;s marine mammal species. One of the densest concentrations of cetaceans on Earth. Cousteau called it the aquarium of the world.
          </p>
        </div>
        <div>
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">How we operate</p>
          <p className="text-warm-white/75 text-sm font-body leading-relaxed">
            Small-group expeditions with a pre-departure safety briefing. We never bait, never touch, never feed. Group sizes capped at 8 so the experience stays personal and respectful. Coast Guard-grade life jackets, marine radio, GPS, and on-board first-aid on every trip.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-5 py-6">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-4">Bajablue timeline</p>
        <ol className="relative border-l border-teal/30 ml-2 space-y-5">
          <TimelineItem year="Pre-launch" body="The founding team builds local knowledge around La Ventana, Cerralvo Island, and seasonal marine wildlife movement." />
          <TimelineItem year="2020–2024" body="The team documents orca, whale, and mobula behavior near Cerralvo Island." />
          <TimelineItem year="2025" body="Bajablue Tours formally founded. Partnership with La Ventana Hostel as basecamp." />
        </ol>
      </section>

      {/* Hostel connection */}
      <section className="px-5 py-6">
        <a
          href="/accommodations"
          className="block relative overflow-hidden rounded-sm border border-teal/15 active:scale-[0.99] transition-transform"
        >
          <img
            src="/images/about/hostel.jpg"
            alt="La Ventana Hostel terrace at sunset"
            loading="lazy"
            decoding="async"
            className="w-full aspect-[16/10] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-deep/10" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-1">Your Baja basecamp</p>
            <h3 className="text-display text-warm-white text-xl tracking-wide leading-tight">LA VENTANA HOSTEL</h3>
            <p className="text-warm-white/65 text-xs font-body mt-1">Multi-day packages include accommodation here →</p>
          </div>
        </a>
      </section>

      <p className="text-warm-white/30 text-[10px] font-body text-center py-6">
        24° 03&apos; N · 109° 59&apos; W · Last updated April 2026
      </p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-warm-white/35 text-[9px] font-body tracking-[0.25em] uppercase mb-0.5">{label}</dt>
      <dd className="text-warm-white text-sm font-body">{value}</dd>
    </div>
  );
}

function TimelineItem({ year, body }: { year: string; body: string }) {
  return (
    <li className="ml-4">
      <span className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-teal-light" />
      <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-1">{year}</p>
      <p className="text-warm-white/70 text-sm font-body leading-relaxed">{body}</p>
    </li>
  );
}
