"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";
import { AdaptiveVideo } from "../AdaptiveVideo";
import { LiquidButton } from "../ui/liquid-glass-button";

export function HeroMobile() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <AdaptiveVideo
        src4k="/videos/mobile/home-hero-multicut-4k.mp4"
        src1080="/videos/mobile/home-hero-multicut-1080.mp4"
        src720="/videos/mobile/home-hero-multicut-720.mp4"
        poster="/videos/mobile/home-hero-multicut-poster.jpg"
        className="absolute inset-0 w-full h-full"
        priority
      />

      <div className="absolute inset-0 bg-deep/18" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-warm-white/55 text-[10px] font-body tracking-[0.3em] uppercase mb-4"
        >
          Sea of Cortez
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="sr-only"
        >
          BAJABLUE
        </motion.h1>
        <motion.img
          src="/images/logos/bajablue-horizontal.svg?v=2"
          alt="Bajablue Tours"
          width={251}
          height={31}
          decoding="async"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="w-[min(85vw,28rem)] h-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-warm-white/70 text-base font-body mt-5 max-w-[18rem] tracking-wide leading-snug"
        >
          Adventure in the most wild waters on Earth
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="text-warm-white/30 text-[10px] font-body mt-3 tracking-[0.3em] uppercase"
        >
          La Ventana · BCS · Mexico
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="flex flex-col gap-3 mt-10 w-full max-w-[18rem]"
        >
          <a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => events.whatsappClick("hero-mobile")}
            className="inline-flex"
          >
            <LiquidButton
              size="lg"
              className="w-full text-warm-white font-body text-[11px] tracking-[0.2em] uppercase rounded-full"
            >
              Book Your Expedition
            </LiquidButton>
          </a>
          <a href="/tours" className="inline-flex">
            <LiquidButton
              size="lg"
              className="w-full text-warm-white font-body text-[11px] tracking-[0.2em] uppercase rounded-full"
            >
              Explore Tours
            </LiquidButton>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-warm-white/30 text-[9px] font-body tracking-[0.4em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-7 bg-gradient-to-b from-warm-white/30 to-transparent"
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-t from-deep/82 via-deep/42 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
