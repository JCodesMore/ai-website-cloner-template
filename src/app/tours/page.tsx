"use client";

import { motion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SeasonSection } from "@/components/SeasonSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AdaptiveVideo } from "@/components/AdaptiveVideo";
import { BreadcrumbSchema, ToursItemListSchema, LocalBusinessRefSchema } from "@/components/SchemaMarkup";
import { siteConfig, tours } from "@/data/site";
import { events } from "@/lib/analytics";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ToursPageMobile } from "@/components/mobile/ToursPageMobile";

export default function ToursPage() {
  return (
    <SmoothScroll>
      <LocalBusinessRefSchema />
      <ToursItemListSchema />
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Tours", href: "/tours" },
      ]} />
      <Navbar />
      {/* Mobile-first redesign — all 3 expeditions visible in one viewport */}
      <ToursPageMobile />
      <main className="hidden md:block">
        <section className="relative h-[60vh] overflow-hidden">
          <AdaptiveVideo
            src4k="/videos/tours-page-4k.mp4"
            src1080="/videos/tours-page-1080p.mp4"
            src720="/videos/tours-page-720p.mp4"
            src480="/videos/tours-page-480p.mp4"
            poster="/videos/tours-page-poster.jpg?v=2"
            posterAlt="Humpback whale alongside a Bajablue Tours expedition boat in the Sea of Cortez"
            description="Footage of a humpback whale surfacing next to a Bajablue Tours expedition boat — the kind of encounter that defines our tours."
            priority
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-navy/18" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-white/50 text-xs font-body tracking-[0.4em] uppercase mb-4">Choose Your Adventure</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-display text-white text-5xl md:text-8xl tracking-wide">OUR EXPEDITIONS</motion.h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-cream to-transparent z-10" />
        </section>

        {/* Comparison table (F16) */}
        <section className="bg-deep py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-4 text-center">Compare Expeditions</p>
              <h2 className="text-display text-warm-white text-3xl md:text-5xl tracking-wide text-center mb-12">Which Expedition Is Right for You?</h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="overflow-x-auto">
                <table className="w-full text-warm-white/80 text-sm font-body border-collapse">
                  <thead>
                    <tr className="border-b border-warm-white/20">
                      <th className="text-left py-4 px-3 text-copper text-xs tracking-[0.2em] uppercase font-medium">Feature</th>
                      <th className="text-left py-4 px-3 text-warm-white text-base tracking-wide">Ocean Safari</th>
                      <th className="text-left py-4 px-3 text-warm-white text-base tracking-wide">Blue Expedition</th>
                      <th className="text-left py-4 px-3 text-warm-white text-base tracking-wide">Master Seafari</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Duration</td>
                      <td className="py-4 px-3">6 hours</td>
                      <td className="py-4 px-3">3 water days · 4 nights</td>
                      <td className="py-4 px-3">5 water days · 6 nights</td>
                    </tr>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Price (per person)</td>
                      <td className="py-4 px-3 text-teal-light">$3,000 Mexican Pesos</td>
                      <td className="py-4 px-3 text-teal-light">$35,000 Mexican Pesos</td>
                      <td className="py-4 px-3 text-teal-light">$54,000 Mexican Pesos</td>
                    </tr>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Season</td>
                      <td className="py-4 px-3">Year-round</td>
                      <td className="py-4 px-3">Seasonal</td>
                      <td className="py-4 px-3">April – June</td>
                    </tr>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Meals included</td>
                      <td className="py-4 px-3">Lunch on board</td>
                      <td className="py-4 px-3">All meals</td>
                      <td className="py-4 px-3">All meals + snacks</td>
                    </tr>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Accommodation</td>
                      <td className="py-4 px-3">—</td>
                      <td className="py-4 px-3">Private room at La Ventana Hostel</td>
                      <td className="py-4 px-3">Private room with en-suite</td>
                    </tr>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Airport transfers</td>
                      <td className="py-4 px-3">—</td>
                      <td className="py-4 px-3">Included</td>
                      <td className="py-4 px-3">Included (LAP or SJD)</td>
                    </tr>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Equipment</td>
                      <td className="py-4 px-3">Snorkel kit + fins</td>
                      <td className="py-4 px-3">Full kit included</td>
                      <td className="py-4 px-3">Full kit (bring own wetsuit)</td>
                    </tr>
                    <tr className="border-b border-warm-white/10">
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Trip media</td>
                      <td className="py-4 px-3">Photos/video when available</td>
                      <td className="py-4 px-3">Photos/video when available</td>
                      <td className="py-4 px-3">Photos/video when available</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-3 text-warm-white/40 text-xs tracking-widest uppercase">Best for</td>
                      <td className="py-4 px-3 text-warm-white/60">Day-trippers, first-time visitors</td>
                      <td className="py-4 px-3 text-warm-white/60">Couples, small groups</td>
                      <td className="py-4 px-3 text-warm-white/60">Nature lovers, deep immersion</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Detailed listing (F37: full details only here) */}
        <section className="bg-sand py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto space-y-20">
            {tours.map((tour, idx) => (
              <ScrollReveal key={tour.slug}>
                <article className="grid md:grid-cols-2 gap-10 items-center" itemScope itemType="https://schema.org/TouristTrip">
                  <div className={idx % 2 === 0 ? "md:order-1" : "md:order-2"}>
                    <img
                      src={tour.image}
                      alt={tour.imageAlt}
                      width={800}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      itemProp="image"
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                  <div className={idx % 2 === 0 ? "md:order-2" : "md:order-1"}>
                    <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-3">{tour.tagline}</p>
                    <h3 className="text-display text-navy text-3xl md:text-4xl tracking-wide mb-4" itemProp="name">{tour.name}</h3>
                    <p className="text-navy/50 text-xs font-body tracking-[0.2em] uppercase mb-5">{tour.duration} · {tour.season}</p>
                    <p className="text-navy/70 text-sm font-body leading-relaxed mb-6" itemProp="description">{tour.description}</p>
                    <div className="mb-6">
                      <p className="text-copper text-xs font-body tracking-[0.3em] uppercase mb-3">What&apos;s Included</p>
                      <ul className="space-y-2">
                        {tour.includes.map((item) => (
                          <li key={item} className="text-navy/70 text-sm font-body flex items-start gap-2">
                            <span className="text-teal flex-shrink-0">·</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-teal text-lg font-body font-semibold mb-1">
                      <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <span itemProp="price">{tour.pricePerPerson}</span>
                        <meta itemProp="priceCurrency" content={tour.priceCurrency} />
                      </span>
                    </p>
                    {tour.priceNote && <p className="text-navy/50 text-xs font-body mb-5">{tour.priceNote}</p>}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <a href={`/tours/${tour.slug}`} className="inline-block bg-deep hover:bg-deep-light text-warm-white px-6 py-3 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300">
                        Tour Details →
                      </a>
                      <a
                        href={`${siteConfig.whatsappLink}?text=${encodeURIComponent(`Hi! I'm interested in the ${tour.name} expedition.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => events.whatsappClick(`tours-page-card-${tour.slug}`)}
                        className="inline-block bg-copper hover:bg-copper-light text-white px-6 py-3 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300"
                      >
                        Book on WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <SeasonSection />

        <section className="bg-deep py-20 px-6 text-center">
          <ScrollReveal>
            <p className="text-warm-white/50 text-sm font-body mb-6">Ready to explore the Sea of Cortez?</p>
            <a href={siteConfig.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex">
              <LiquidButton size="xl" className="text-warm-white font-body text-xs tracking-[0.2em] uppercase rounded-full">
                Book Your Expedition →
              </LiquidButton>
            </a>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
