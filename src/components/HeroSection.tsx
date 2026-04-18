"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LogoH, LogoT, LogoA } from "./icons";

const heroImages = [
  "/images/hero/hero-1.webp",
  "/images/hero/hero-2.webp",
  "/images/hero/hero-3.webp",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fade in on mount
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Rotate hero background every 5 s
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative w-full h-full overflow-hidden"
      aria-label="Héloïse Thibodeau Architecte"
    >
      {/* Background images */}
      {heroImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover scale-[1.05]"
            priority={i === 0}
            sizes="60vw"
          />
          {/* Dark overlay on last image only */}
          {i === heroImages.length - 1 && (
            <div className="absolute inset-0 bg-[#3e4348]/40 z-10" />
          )}
        </div>
      ))}

      {/* Overall overlay for legibility */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* H letter — top-left */}
      <span
        className={`absolute z-20 text-white
          transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{
          top: "15%", left: "4%",
          transitionDelay: "0.6s",
          width: "clamp(40px, 4.5vw, 72px)",
        }}
      >
        <LogoH className="w-full h-auto" />
      </span>

      {/* T letter — bottom-left */}
      <span
        className={`absolute z-20 text-white
          transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{
          bottom: "10%", left: "4%",
          transitionDelay: "0.8s",
          width: "clamp(30px, 3.8vw, 60px)",
        }}
      >
        <LogoT className="w-full h-auto" />
      </span>

      {/* A letter — bottom-right, large */}
      <span
        className={`absolute z-20 text-white
          transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{
          bottom: "4%", right: "5%",
          transitionDelay: "1.0s",
          width: "clamp(60px, 8vw, 120px)",
        }}
      >
        <LogoA className="w-full h-auto" />
      </span>

      {/* Title — centered vertically, spread across full width */}
      <h1
        className={`absolute inset-x-0 z-20 px-8
          grid grid-cols-3 text-white
          transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          transitionDelay: "1.2s",
          fontFamily: '"Neue Haas Grotesk Display", sans-serif',
          fontSize: "clamp(1rem, 1.4vw, 1.375rem)",
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        <span>Héloïse</span>
        <span className="text-center">Thibodeau</span>
        <span className="text-right">Architecte</span>
      </h1>
    </section>
  );
}
