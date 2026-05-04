"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "39%", label: "World's marine\nmammal species" },
  { value: "800+", label: "Fish species\nin the Gulf" },
  { value: "1", label: "UNESCO World\nHeritage Site" },
];

export function IntroSectionMobile() {
  return (
    <section className="md:hidden relative bg-deep px-5 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-teal-light text-[10px] font-body tracking-[0.35em] uppercase mb-3">
          The world&apos;s aquarium
        </p>
        <h2 className="text-display text-warm-white text-3xl tracking-wide leading-tight mb-5">
          What makes the Sea of Cortez special?
        </h2>
        <p className="text-warm-white/75 text-sm font-body leading-relaxed mb-3">
          The Sea of Cortez is one of the most biodiverse marine environments on Earth. UNESCO World Heritage since 2005,
          home to <span className="text-warm-white">39% of the world&apos;s marine mammal species</span> and a third of
          all cetaceans.
        </p>
        <p className="text-warm-white/55 text-sm font-body leading-relaxed">
          Cousteau called it &ldquo;the world&apos;s aquarium.&rdquo; We run small-group expeditions from La Ventana into
          these legendary waters — small groups, experienced guides, encounters that change how you see the ocean.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 grid grid-cols-3 gap-3"
      >
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="bg-white/[0.04] border border-teal/15 rounded-sm p-3 text-center"
          >
            <p className="text-display text-teal-light text-2xl tracking-wide">{stat.value}</p>
            <p className="text-warm-white/40 text-[9px] font-body tracking-[0.15em] uppercase mt-1.5 leading-snug whitespace-pre-line">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
