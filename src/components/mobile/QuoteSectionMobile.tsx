"use client";

import { motion } from "framer-motion";

export function QuoteSectionMobile() {
  return (
    <section className="md:hidden bg-deep-lighter relative overflow-hidden py-14 px-5">
      {/* Subtle background glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-copper/8 blur-3xl pointer-events-none" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-teal-light/30 text-7xl font-serif leading-none mb-3"
        >
          &ldquo;
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-warm-white text-xl font-body leading-relaxed font-light italic"
        >
          The animals come first. We don&apos;t chase, we don&apos;t crowd, and if something wants to be left alone, we
          leave it alone.
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex items-center gap-3"
        >
          <div className="h-px w-8 bg-teal-light/40" />
          <div>
            <p className="text-warm-white/80 text-xs font-body tracking-[0.25em] uppercase">Bajablue Founders</p>
            <p className="text-warm-white/35 text-[10px] font-body mt-0.5 tracking-[0.2em] uppercase">Animal-first operating standard</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
