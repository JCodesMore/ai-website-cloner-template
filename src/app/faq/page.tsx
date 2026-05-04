"use client";

import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FAQSection } from "@/components/FAQSection";
import { FAQSchema, BreadcrumbSchema } from "@/components/SchemaMarkup";
import { ScrollReveal } from "@/components/ScrollReveal";
import { siteConfig } from "@/data/site";
import { motion } from "framer-motion";
import { FAQPageMobile } from "@/components/mobile/FAQPageMobile";
import { events } from "@/lib/analytics";

export default function FAQPage() {
  return (
    <SmoothScroll>
      <FAQSchema />
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "FAQ", href: "/faq" },
      ]} />
      <Navbar />
      <FAQPageMobile />
      <main className="hidden md:block">
        <section className="relative h-[50vh] overflow-hidden">
          <div className="absolute inset-0 bg-navy" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-display text-white text-5xl md:text-8xl tracking-wide">FAQ</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-white/50 text-sm font-body mt-4">Everything you need to know</motion.p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-sand to-transparent z-10" />
        </section>

        <FAQSection />

        <section className="bg-deep py-16 px-6 text-center">
          <ScrollReveal>
            <p className="text-warm-white/50 text-sm font-body mb-4">Still have questions?</p>
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => events.whatsappClick("faq-page-desktop")}
              className="inline-block bg-copper hover:bg-copper-light text-white px-10 py-3.5 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300"
            >
              Ask Us on WhatsApp →
            </a>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
