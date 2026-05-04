"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { seasons } from "@/data/site";
import { AdaptiveVideo } from "../AdaptiveVideo";

export function SeasonSectionMobile() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = seasons[activeIdx];

  return (
    <section className="md:hidden bg-deep relative">
      {/* Compact video header */}
      <div className="relative h-[42dvh] overflow-hidden">
        <AdaptiveVideo
          src4k="/videos/mobile/season-montage-4k.mp4"
          src1080="/videos/mobile/season-montage-1080.mp4"
          src720="/videos/mobile/season-montage-720.mp4"
          poster="/videos/mobile/season-montage-poster.jpg"
          posterAlt="Seasonal marine wildlife footage from the Sea of Cortez"
          className="absolute inset-0 w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/16 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-teal-light/80 text-[10px] font-body tracking-[0.35em] uppercase mb-2"
          >
            November – July
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-display text-warm-white text-3xl tracking-wide leading-tight"
          >
            When&apos;s the best time to visit?
          </motion.h2>
        </div>
      </div>

      {/* Intro paragraph */}
      <div className="px-5 pt-6 pb-4">
        <p className="text-warm-white/70 text-sm font-body leading-relaxed">
          Each month brings a different signature species. Pick a window below to see who&apos;s in the water.
        </p>
      </div>

      {/* Season tabs */}
      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          {seasons.map((s, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={s.name}
                onClick={() => {
                  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
                  setActiveIdx(idx);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-body tracking-[0.15em] uppercase transition-all ${
                  isActive
                    ? "bg-teal-light text-deep"
                    : "bg-white/[0.04] border border-teal/20 text-warm-white/70"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active season card */}
      <div className="px-5 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-white/[0.04] border border-teal/15 rounded-sm p-5"
          >
            <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">{active.months}</p>
            <h3 className="text-display text-warm-white text-2xl tracking-wide leading-tight mb-3">
              {active.name}
            </h3>
            <p className="text-warm-white/70 text-sm font-body leading-relaxed mb-4">{active.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {active.wildlife.map((animal) => (
                <span
                  key={animal}
                  className="text-[10px] font-body text-teal-light/80 border border-teal/30 px-2.5 py-1 rounded-full tracking-[0.15em] uppercase"
                >
                  {animal}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
