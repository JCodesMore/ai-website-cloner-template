"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

export function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 bg-deep-lighter -top-[10%] h-[120%]" />
      <div className="relative z-10 py-28 md:py-40 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal><div className="dashed-divider w-24 mx-auto mb-14" /></ScrollReveal>
          <ScrollReveal delay={0.2}><div className="text-teal-light/30 text-6xl md:text-8xl font-serif leading-none mb-6">&ldquo;</div></ScrollReveal>
          <ScrollReveal delay={0.3}>
            <blockquote className="text-warm-white text-xl md:text-2xl font-body leading-relaxed font-light">
              The animals come first. We don&apos;t chase, we don&apos;t crowd, and if something wants to be left alone, we leave it alone.
            </blockquote>
          </ScrollReveal>
          <ScrollReveal delay={0.5}>
            <div className="mt-10">
              <p className="text-warm-white/70 text-sm font-body tracking-[0.3em] uppercase">Bajablue Founders</p>
              <p className="text-warm-white/30 text-xs font-body mt-1 tracking-widest">Animal-first operating standard</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.6}><div className="dashed-divider w-24 mx-auto mt-14" /></ScrollReveal>
        </div>
      </div>
    </section>
  );
}
