"use client";

import { useEffect, useRef } from "react";

export function FooterSection() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <footer className="relative">
      {/* Tagline */}
      <section className="flex flex-col items-center justify-center bg-[#11121d] py-28 text-center text-white">
        <div
          ref={textRef}
          style={{
            opacity: 0,
            transform: "translateY(24px)",
            transition:
              "opacity 1s cubic-bezier(0.2,0.7,0.2,1), transform 1s cubic-bezier(0.2,0.7,0.2,1)",
          }}
        >
          <p
            className="max-w-[760px] px-6 font-display leading-[1.3]"
            style={{ fontSize: "clamp(24px, 3.5vw, 44px)" }}
          >
            Where luxury outdoor meets glamping
            <br />
            excellence, integrated marketing
            <br />
            and communication, across the world.
          </p>
        </div>
      </section>

      {/* Logo crest */}
      <div
        className="relative flex h-[420px] items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 110%, #d4acc5 0%, #977dbd 35%, #11121d 75%)",
        }}
      >
        <img
          src="/images/footer-logo.DGEgvHlG.png"
          alt="Aurora monogram"
          className="h-auto w-[300px] opacity-90 md:w-[400px]"
          style={{
            filter: "drop-shadow(0 8px 40px rgba(151,125,189,0.3))",
          }}
        />
      </div>

      {/* Credits bar */}
      <div className="flex flex-col items-center justify-between gap-3 bg-[#11121d] px-8 py-6 text-white md:flex-row">
        <span className="rounded-full border border-white/15 px-5 py-2 font-display text-[12px] tracking-[0.02em] text-white/60 transition-colors duration-300 hover:border-white/30 hover:text-white/80">
          Design by Flot Noir Studio
        </span>
        <span className="rounded-full border border-white/15 px-5 py-2 font-display text-[12px] tracking-[0.02em] text-white/60 transition-colors duration-300 hover:border-white/30 hover:text-white/80">
          Development by Guillaume Colombel
        </span>
      </div>
    </footer>
  );
}
