"use client";

import { motion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal, StaggerReveal, StaggerChild } from "@/components/ScrollReveal";
import { TourSchema, BreadcrumbSchema, LocalBusinessRefSchema } from "@/components/SchemaMarkup";
import { siteConfig } from "@/data/site";
import type { Tour } from "@/types";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { TourDetailPageMobile } from "@/components/mobile/TourDetailPageMobile";
import { events } from "@/lib/analytics";

export function TourDetailPage({ tour }: { tour: Tour }) {
  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in the ${tour.name} expedition.`);

  return (
    <SmoothScroll>
      <LocalBusinessRefSchema />
      <TourSchema tour={tour} />
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Tours", href: "/tours" },
        { name: tour.name, href: `/tours/${tour.slug}` },
      ]} />
      <Navbar />
      {/* Mobile-first redesign */}
      <TourDetailPageMobile tour={tour} />
      <main className="hidden md:block">
        {/* Hero */}
        <section className="relative h-[70vh] overflow-hidden">
          <img
            src={tour.image}
            alt={tour.imageAlt}
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-end justify-end p-8 md:p-16 z-10">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-white/60 text-xs font-body tracking-[0.4em] uppercase mb-3">{tour.duration}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-display text-white text-4xl md:text-7xl tracking-wide">{tour.name.toUpperCase()}</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-white/70 text-base font-body mt-3">{tour.tagline}</motion.p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-cream to-transparent z-10" />
        </section>

        {/* Description + pricing */}
        <section className="bg-deep py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 md:gap-20">
            {/* Left — description */}
            <div className="md:col-span-2">
              <ScrollReveal>
                <h2 className="text-display text-warm-white text-2xl md:text-4xl tracking-wide mb-6">THE EXPERIENCE</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-warm-white/70 text-base font-body leading-relaxed">{tour.description}</p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <h3 className="text-display text-warm-white text-xl tracking-wide mt-12 mb-4">WHAT&apos;S INCLUDED</h3>
              </ScrollReveal>
              <StaggerReveal staggerDelay={0.1}>
                {tour.includes.map((item) => (
                  <StaggerChild key={item}>
                    <div className="flex items-start gap-3 py-2 border-b border-warm-white/5">
                      <span className="text-copper text-sm mt-0.5">—</span>
                      <span className="text-warm-white/60 text-sm font-body">{item}</span>
                    </div>
                  </StaggerChild>
                ))}
              </StaggerReveal>
            </div>

            {/* Right — pricing card */}
            <div>
              <ScrollReveal direction="right">
                <div className="bg-sand p-8 sticky top-28">
                  <p className="text-copper text-xs font-body tracking-[0.3em] uppercase mb-2">Starting from</p>
                  <p className="text-display text-navy text-3xl md:text-4xl tracking-wide">{tour.pricePerPerson}</p>
                  <p className="text-navy/50 text-xs font-body mt-1">per person</p>
                  {tour.priceNote && (
                    <p className="text-navy/50 text-xs font-body mt-2 border-t border-navy/10 pt-2">{tour.priceNote}</p>
                  )}

                  <div className="dashed-divider-dark w-full my-6" />

                  <div className="space-y-2 text-sm font-body text-navy/60">
                    <p><span className="text-navy/80 font-medium">Duration:</span> {tour.duration}</p>
                    <p><span className="text-navy/80 font-medium">Season:</span> {tour.season}</p>
                    <p><span className="text-navy/80 font-medium">Group size:</span> Max 6</p>
                  </div>

                  <a
                    href={`${siteConfig.whatsappLink}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => events.whatsappClick(`tour-detail-${tour.slug}`)}
                    className="block w-full mt-8"
                  >
                    <LiquidButton
                      variant="dark"
                      size="lg"
                      className="w-full text-warm-white font-body text-xs tracking-[0.2em] uppercase rounded-md"
                    >
                      Book This Tour →
                    </LiquidButton>
                  </a>

                  <p className="text-navy/50 text-xs font-body mt-4 text-center">
                    60% deposit · Non-refundable · Transferable
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
