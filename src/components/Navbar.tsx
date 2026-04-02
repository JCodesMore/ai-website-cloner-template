"use client";

import { useState, useEffect, useCallback } from "react";

function SoundWaveIcon() {
  return (
    <div className="w-5 overflow-hidden">
      <svg
        viewBox="0 0 200 100"
        className="h-auto w-10 animate-[waveSlide_2s_linear_infinite]"
        aria-hidden="true"
      >
        <path
          d="M 0 50 Q 50 0, 100 50 T 200 50"
          stroke="white"
          fill="transparent"
          strokeWidth="10"
        />
      </svg>
    </div>
  );
}

export function Navbar() {
  const [blurAmount, setBlurAmount] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(0);

  const handleScroll = useCallback(() => {
    const heroHeight = window.innerHeight;
    const scrollY = window.scrollY;
    // Progressive blur: proportional to scroll through hero section
    const ratio = Math.min(scrollY / (heroHeight * 0.5), 1);
    // Max blur: ~8px (≈0.5vw at 1440px)
    setBlurAmount(ratio * 8);
    setBgOpacity(ratio * 0.3);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-[9998] flex h-[100px] items-center justify-between px-8 transition-colors duration-200"
      style={{
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        backdropFilter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : "none",
        WebkitBackdropFilter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : "none",
        backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-6">
        <a
          href="#portfolio-trigger"
          className="text-[10.5px] font-normal uppercase tracking-[0.05em] text-white transition-opacity duration-300 hover:opacity-60"
        >
          gallery
        </a>
        <a
          href="tel:+971504757773"
          className="text-[10.5px] font-normal uppercase tracking-[0.05em] text-white transition-opacity duration-300 hover:opacity-60"
        >
          +971 504757773
        </a>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <button
          type="button"
          className="flex items-center gap-2 text-[10.5px] font-normal uppercase tracking-[0.05em] text-white transition-opacity duration-300 hover:opacity-60"
        >
          <SoundWaveIcon />
          <span>Sound</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-[10.5px] font-normal uppercase tracking-[0.05em] text-white transition-opacity duration-300 hover:opacity-60"
        >
          <span className="h-2 w-2 rounded-full bg-white" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
}
