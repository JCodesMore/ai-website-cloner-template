"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const LOGOS = Array.from({ length: 7 }, (_, i) => ({
  src: `/images/home_${i + 2}.webp`,
  alt: `Partner logo ${i + 1}`,
}));

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...LOGOS, ...LOGOS];
  return (
    <div
      className="flex w-max gap-5"
      style={{
        animation: `${reverse ? "marquee-x-reverse" : "marquee-x"} 45s linear infinite`,
      }}
    >
      {items.map((l, i) => (
        <div
          key={i}
          className="grid h-[160px] w-[240px] shrink-0 place-items-center rounded-[18px] border border-white/[0.08] bg-white/[0.02] transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]"
        >
          <Image
            src={l.src}
            alt={l.alt}
            width={200}
            height={120}
            className="h-auto w-[130px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
}

export function LogosSection() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative flex flex-col items-center gap-16 bg-[#11121d] py-36 text-white">
      <div
        ref={headRef}
        style={{
          opacity: 0,
          transform: "translateY(28px)",
          transition:
            "opacity 0.9s cubic-bezier(0.2,0.7,0.2,1), transform 0.9s cubic-bezier(0.2,0.7,0.2,1)",
        }}
      >
        <h2
          className="px-6 text-center font-display font-bold leading-[0.98] tracking-tight"
          style={{ fontSize: "clamp(48px, 8vw, 112px)" }}
        >
          Trusted Worldwide,
          <br />
          End-to-end
        </h2>
      </div>
      <div className="flex w-full flex-col gap-5 overflow-hidden">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
