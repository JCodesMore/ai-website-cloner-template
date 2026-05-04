"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";
import { AdaptiveVideo } from "./AdaptiveVideo";
import { ButtonColorful } from "./ui/button-colorful";
import { LiquidButton } from "./ui/liquid-glass-button";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Adaptive video with parallax */}
        <motion.div style={{ scale: videoScale, opacity: videoOpacity }} className="absolute inset-0">
          <AdaptiveVideo
            src4k="/videos/hero-4k.mp4"
            src1080="/videos/hero-1080p.mp4"
            src720="/videos/hero-720p.mp4"
            src480="/videos/hero-480p.mp4"
            poster="/videos/hero-poster.jpg?v=2"
            className="w-full h-full"
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-deep/16" />

        <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-warm-white/50 text-sm font-body tracking-[0.3em] uppercase mb-6">
            Marine Expeditions · Sea of Cortez
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="sr-only">
            BAJABLUE
          </motion.h1>
          <motion.img
            src="/images/logos/bajablue-horizontal.svg?v=2"
            alt="Bajablue Tours"
            width={251}
            height={31}
            decoding="async"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="w-[clamp(18rem,72vw,64rem)] h-auto"
          />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="text-warm-white/70 text-lg md:text-xl font-body mt-6 max-w-lg tracking-wide">
            Adventure in the most wild waters on Earth
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }}
            className="text-warm-white/30 text-xs font-body mt-3 tracking-[0.4em] uppercase">
            La Ventana · Baja California Sur · Mexico
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-12">
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => events.whatsappClick("hero-desktop")}
              className="inline-flex"
            >
              <LiquidButton
                size="xl"
                className="text-warm-white font-body text-xs tracking-[0.2em] uppercase rounded-full"
              >
                Book Your Expedition
              </LiquidButton>
            </a>
            <a href="/tours" className="inline-flex">
              <LiquidButton
                size="xl"
                className="text-warm-white font-body text-xs tracking-[0.2em] uppercase rounded-full"
              >
                Explore Tours
              </LiquidButton>
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-warm-white/30 text-xs font-body tracking-[0.4em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-warm-white/30 to-transparent" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[300px] pointer-events-none z-10">
        <div className="w-full h-full bg-gradient-to-t from-deep/80 via-deep/45 to-transparent" />
      </div>
    </section>
  );
}
