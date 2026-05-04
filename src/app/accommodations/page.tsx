"use client";

import { motion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal, StaggerReveal, StaggerChild } from "@/components/ScrollReveal";
import { LocalBusinessRefSchema, BreadcrumbSchema } from "@/components/SchemaMarkup";
import { AccommodationsPageMobile } from "@/components/mobile/AccommodationsPageMobile";

const amenities = [
  "Private rooms with en-suite bathrooms",
  "King, Queen, or One Double configuration",
  "Hot water and high-speed internet",
  "Smoothie bar and fully equipped kitchen",
  "Board games and communal lounge",
  "Panoramic terrace with sea views",
];

const BOOKING_URL = "https://hotels.cloudbeds.com/en/reservation/rmDkzN?currency=mxn";

export default function AccommodationsPage() {
  return (
    <SmoothScroll>
      <LocalBusinessRefSchema />
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Accommodations", href: "/accommodations" },
      ]} />
      <Navbar />
      <AccommodationsPageMobile />
      <main className="hidden md:block">
        <section className="relative h-[60vh] overflow-hidden">
          <img
            src="/images/accommodations/hostel-hero.jpg"
            alt="La Ventana Hostel exterior at golden hour — boutique hostel with rooftop terrace and giant cactus, five minutes from the beach"
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-white/50 text-xs font-body tracking-[0.4em] uppercase mb-4">Your Baja Basecamp</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-display text-white text-4xl md:text-7xl tracking-wide">LA VENTANA HOSTEL</motion.h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-cream to-transparent z-10" />
        </section>

        <section className="bg-deep py-20 md:py-28 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-4">Boutique Comfort</p>
              <h2 className="text-display text-warm-white text-2xl md:text-4xl tracking-wide mb-6">MORE THAN A HOSTEL</h2>
              <p className="text-warm-white/70 text-base font-body leading-relaxed mb-6">
                Nestled in La Ventana, just a five-minute walk from the beach, our hostel is the base camp for all multi-day expeditions. Private rooms, not dorms. Comfort, not compromise.
              </p>
              <p className="text-warm-white/50 text-sm font-body leading-relaxed">
                Included with all Blue Expedition and Master Seafari packages. Also available for independent stays.
              </p>
            </ScrollReveal>

            <div>
              <ScrollReveal direction="right">
                <h3 className="text-display text-warm-white text-xl tracking-wide mb-6">AMENITIES</h3>
              </ScrollReveal>
              <StaggerReveal staggerDelay={0.1}>
                {amenities.map((item) => (
                  <StaggerChild key={item}>
                    <div className="flex items-start gap-3 py-3 border-b border-warm-white/5">
                      <span className="text-copper text-sm mt-0.5">—</span>
                      <span className="text-warm-white/60 text-sm font-body">{item}</span>
                    </div>
                  </StaggerChild>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </section>

        {/* Photo grid */}
        <section className="bg-sand py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { src: "/images/accommodations/room-1.jpg", alt: "Private room at La Ventana Hostel with ceiling fan, en-suite bathroom, and natural light" },
              { src: "/images/accommodations/room-2.jpg", alt: "Teal bunk beds at La Ventana Hostel — premium shared sleeping for solo travelers" },
              { src: "/images/accommodations/room-3.jpg", alt: "Spacious private room at La Ventana Hostel with king-size bed and sliding barn door" },
              { src: "/images/accommodations/room-4.jpg", alt: "Sunset yoga on the terrace at La Ventana Hostel with panoramic Sea of Cortez views" },
              { src: "/images/accommodations/room-5.jpg", alt: "In-house smoothie bar at La Ventana Hostel serving fresh fruit and superfood blends" },
              { src: "/images/accommodations/room-6.jpg", alt: "Guests biking outside La Ventana Hostel — bikes available for exploring the village" },
            ].map((item, i) => (
              <ScrollReveal key={item.src} delay={i * 0.1}>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Book your stay at La Ventana Hostel"
                  className="block aspect-[4/3] overflow-hidden group cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
