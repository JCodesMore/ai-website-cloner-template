"use client";

import { useEffect, useRef } from "react";

export function ValuesSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
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
    <section className="relative flex h-screen flex-col items-center justify-center gap-7 bg-[#11121d] px-6 text-center text-white">
      <div
        ref={ref}
        className="flex flex-col items-center gap-7"
        style={{
          opacity: 0,
          transform: "translateY(32px)",
          transition:
            "opacity 1s cubic-bezier(0.2,0.7,0.2,1), transform 1s cubic-bezier(0.2,0.7,0.2,1)",
        }}
      >
        <span className="font-mono-display text-[11px] font-bold tracking-[0.22em] text-white/70">
          OUR VALUES &amp; ESG COMMITMENTS
        </span>
        <h2
          className="max-w-[1100px] font-display font-light leading-[1.15] tracking-[-0.01em]"
          style={{ fontSize: "clamp(32px, 5.5vw, 72px)" }}
        >
          Ethics{" "}
          <span className="inline-block text-[#d4acc5]">⏤</span>{" "}
          Humanism{" "}
          <span className="inline-block text-[#d4acc5]">⏤</span>{" "}
          Transparency{" "}
          <span className="inline-block text-[#d4acc5]">⏤</span>{" "}
          Performance
        </h2>
      </div>
    </section>
  );
}
