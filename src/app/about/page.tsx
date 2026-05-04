"use client";

import { motion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AdaptiveVideo } from "@/components/AdaptiveVideo";
import { AboutPageMobile } from "@/components/mobile/AboutPageMobile";

export default function AboutPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <AboutPageMobile />
      <main className="hidden md:block">
        {/* Hero */}
        <section className="relative h-[60vh] overflow-hidden">
          <AdaptiveVideo
            src4k="/videos/about-4k.mp4"
            src1080="/videos/about-1080p.mp4"
            src720="/videos/about-720p.mp4"
            src480="/videos/about-480p.mp4"
            poster="/videos/about-poster.jpg?v=2"
            posterAlt="Orcas swimming through the Sea of Cortez"
            description="Footage of orcas swimming through the Sea of Cortez near La Ventana — the marine wildlife that inspired Bajablue Tours."
            priority
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-navy/18" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-display text-white text-5xl md:text-8xl tracking-wide">ABOUT US</motion.h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-cream to-transparent z-10" />
        </section>

        {/* Story */}
        <section className="bg-deep py-20 md:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-6 text-center">Our Story</p>
              <h2 className="text-display text-warm-white text-3xl md:text-5xl tracking-wide text-center mb-10">The Founders and Team Behind Bajablue</h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-warm-white/70 text-base font-body leading-relaxed mb-6">
                Bajablue Tours is run by its founders and a small local team of experienced boat crew and marine guides. The company was founded in 2025 to share small-group marine wildlife experiences from La Ventana, Baja California Sur, a quiet fishing village 45 minutes south of La Paz International Airport (LAP) and 2.5 hours from Los Cabos (SJD). From this single launch point, our boats reach the productive waters around Cerralvo Island in under 90 minutes.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-warm-white/70 text-base font-body leading-relaxed mb-6">
                The story of Bajablue starts with a deep respect for the water around La Ventana: orcas hunting in open channels, mobula rays in schools of thousands, and humpback whales breaching at sunrise. The Sea of Cortez — a UNESCO World Heritage Site since 2005 — contains 39% of the world&apos;s marine mammal species and one of the densest concentrations of cetaceans on Earth (Source: UNESCO World Heritage Centre, 2005 Inscription Decision). Bajablue exists to help small groups experience that wildlife with patience, respect, and local knowledge.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <p className="text-warm-white/70 text-base font-body leading-relaxed mb-6">
                Bajablue was founded on a simple conviction: ocean encounters are better when they are patient, quiet, and never forced. We never bait wildlife, never touch or feed animals, never permit swimming with whales, and cap group sizes at 8 guests so the experience stays personal and respectful.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="dashed-divider-dark w-32 mx-auto my-12" />
            </ScrollReveal>

            {/* Team bio */}
            <ScrollReveal delay={0.55}>
              <div className="bg-deep-light/40 border border-warm-white/10 p-8 md:p-10 mb-12">
                <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-2">Founders &amp; Team Members</p>
                <h3 className="text-display text-warm-white text-2xl md:text-3xl tracking-wide mb-4">Bajablue Team</h3>
                <p className="text-warm-white/50 text-sm font-body leading-relaxed mb-4">
                  A small La Ventana-based team built around patient wildlife observation, local sea-state knowledge, and respectful guest care.
                </p>
                <ul className="text-warm-white/50 text-sm font-body space-y-2">
                  <li><span className="text-copper">Role:</span> Founders, guides, boat crew, and expedition support</li>
                  <li><span className="text-copper">Based in:</span> La Ventana, Baja California Sur, Mexico</li>
                  <li><span className="text-copper">Languages:</span> Spanish and English</li>
                  <li><span className="text-copper">Experience:</span> Free-diving, snorkeling, and marine wildlife observation</li>
                  <li><span className="text-copper">Specialties:</span> Marine megafauna observation · responsible guest briefings · small-group expedition logistics</li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Timeline (F35) */}
            <ScrollReveal delay={0.6}>
              <h3 className="text-display text-warm-white text-2xl tracking-wide text-center mb-6">Bajablue Timeline</h3>
              <ul className="text-warm-white/60 text-sm font-body leading-relaxed space-y-3 max-w-xl mx-auto mb-12">
                <li><span className="text-copper font-medium">Pre-launch —</span> The founding team builds local knowledge around La Ventana, Cerralvo Island, and seasonal marine wildlife movement.</li>
                <li><span className="text-copper font-medium">2020-2024 —</span> The team documents orca, whale, and mobula behavior near Cerralvo Island.</li>
                <li><span className="text-copper font-medium">2025 —</span> Bajablue Tours formally founded. Partnership with La Ventana Hostel established as basecamp.</li>
              </ul>
            </ScrollReveal>

            {/* Certifications & Safety (F40) */}
            <ScrollReveal delay={0.65}>
              <h3 className="text-display text-warm-white text-2xl tracking-wide text-center mb-6">Safety &amp; Guest Care</h3>
              <ul className="text-warm-white/60 text-sm font-body leading-relaxed space-y-2 max-w-xl mx-auto mb-12 list-disc list-inside">
                <li>Small-group expeditions with a pre-departure safety briefing.</li>
                <li>Respectful wildlife observation practices on every outing.</li>
                <li>Experienced marine guides on every expedition.</li>
                <li>Coast Guard-grade life jackets, marine radio, GPS, and on-board first-aid kit on every trip.</li>
                <li>Local boat crew familiar with La Ventana, Cerralvo Island, and seasonal sea conditions.</li>
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={0.7}>
              <h3 className="text-display text-warm-white text-2xl tracking-wide text-center mb-6">Our Mission</h3>
              <p className="text-warm-white/60 text-lg font-body leading-relaxed text-center italic">
                &quot;The animals come first. We don&apos;t chase, we don&apos;t crowd, and if something wants to be left alone, we leave it alone.&quot;
              </p>
              <p className="text-warm-white/35 text-xs font-body tracking-[0.25em] uppercase text-center mt-4">Bajablue founders</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Hostel connection */}
        <section className="bg-sand py-20 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <img
                src="/images/about/hostel.jpg"
                alt="La Ventana Hostel terrace at sunset overlooking the Sea of Cortez"
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover"
              />
            </ScrollReveal>
            <ScrollReveal direction="right">
              <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-3">Your Baja Basecamp</p>
              <h3 className="text-display text-navy text-2xl md:text-3xl tracking-wide mb-4">LA VENTANA HOSTEL</h3>
              <p className="text-navy/70 text-sm font-body leading-relaxed mb-4">
                Our tours depart from La Ventana Hostel — boutique comfort with private rooms, en-suite bathrooms, a smoothie bar, and panoramic terrace views of the Sea of Cortez. Multi-day expedition packages include accommodation here. The hostel is a 5-minute drive from the public boat ramp and a 45-minute drive from La Paz International Airport.
              </p>
              <p className="text-navy/50 text-xs font-body tracking-widest uppercase">
                24° 03&apos; N, 109° 59&apos; W
              </p>
            </ScrollReveal>
          </div>
        </section>

        <p className="bg-deep text-warm-white/30 text-xs font-body text-center py-6 px-6">
          Last updated: April 2026
        </p>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
