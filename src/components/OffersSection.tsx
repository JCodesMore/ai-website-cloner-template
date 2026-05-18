"use client";

import { useEffect, useRef, useState } from "react";
import type { OfferCard } from "@/types/content";
import { PlayIcon } from "./icons";

const CARDS: OfferCard[] = [
  {
    key: "expand",
    pillLabel: "Expand",
    category: "TAILORED OFFER",
    title: "Expand",
    subtitle: "Your Reach",
    body:
      "Position your property where travelers actually decide. We amplify your presence with seasonal storytelling, premium placements, and partners that matter—so your brand shows up first in minds, maps, and feeds across key markets. Visibility that compounds, beyond a single campaign.",
    tags: ["Paid Media", "SEO", "Partnerships"],
    bgColor: "#f3c4c9",
    video: "/videos/82abac7f4ce5dfc470e9d26b11076edb29aede37.mp4",
  },
  {
    key: "maximize",
    pillLabel: "Maximize",
    category: "TAILORED OFFER",
    title: "Maximize",
    subtitle: "Your Brand",
    body:
      "Turn attention into reservations. We streamline the path from inspiration to purchase with persuasive offers, trust signals, and frictionless UX—then time everything to demand. The result: fuller calendars, healthier ADR, and steadier cashflow all season long.",
    tags: ["Offers & Pricing", "CRO/UX", "Meta/Google Ads"],
    bgColor: "#f3c4c9",
    video: "/videos/70118bbbff3f93dc4870e1d8620b411f897711e2.mp4",
  },
  {
    key: "elevate",
    pillLabel: "Elevate",
    category: "TAILORED OFFER",
    title: "Elevate",
    subtitle: "Your Brand",
    body:
      "Craft a signature identity that guests instantly recognize and remember. From visuals to voice, every touchpoint speaks the same refined language—on site, online, and in print—so your property stands apart and commands premium perception.",
    tags: ["Brand System", "Art Direction", "Content Studio"],
    bgColor: "#977dbd",
    video: "/videos/54ddd736eb805dd0cc687c36e16ffed2a96a413d.mp4",
  },
];

export function OffersSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* IntersectionObserver → highlight active pill */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-50% 0px -45% 0px", threshold: 0 }
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Fade-in the heading block */
  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("section-fade-up");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#11121d] pt-28 text-white sm:pt-32"
      style={{
        /* Smooth transition zone: overlap with hero bottom gradient */
        marginTop: "-1px",
      }}
    >
      {/* Heading — scrolls away */}
      <div ref={headRef} className="mx-auto flex flex-col items-center gap-8 pb-8 opacity-0">
        <h2 className="max-w-[1000px] px-6 text-center font-display text-[36px] font-bold leading-[1.05] tracking-tight sm:text-[56px] md:text-[88px]">
          Marketing crafted to suit every host
        </h2>
      </div>

      {/* Sticky pill nav — compact bar that stays pinned */}
      <div className="sticky top-0 z-10 flex items-center justify-center bg-[#11121d] py-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {CARDS.map((c, i) => (
            <button
              key={c.key}
              onClick={() =>
                cardRefs.current[i]?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
              className={`rounded-full border px-4 py-1.5 font-display text-[13px] transition-all duration-500 sm:px-6 sm:py-2.5 sm:text-[17px] ${
                active === i
                  ? "border-[#f3c4c9] bg-[#f3c4c9] text-[#11121d] shadow-[0_4px_24px_rgba(243,196,201,0.35)]"
                  : "border-[#f3c4c9]/40 text-[#f3c4c9]/80 hover:border-[#f3c4c9]/70 hover:text-[#f3c4c9]"
              }`}
            >
              {c.pillLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Card stack */}
      <div className="mx-auto max-w-[1300px] px-6 pb-32">
        <div className="relative flex flex-col gap-6">
          {CARDS.map((c, i) => (
            <div
              key={c.key}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-idx={i}
              className="sticky overflow-hidden rounded-[28px] transition-shadow duration-700"
              style={{
                top: `${64 + i * 14}px`,
                background: c.bgColor,
                color: c.key === "elevate" ? "#fff" : "#11121d",
                boxShadow:
                  "0 20px 60px -15px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Card data={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ data }: { data: OfferCard }) {
  const isDark = data.key === "elevate";
  const accent = isDark ? "rgba(255,255,255,0.85)" : "rgba(17,18,29,0.85)";
  const accentSoft = isDark ? "rgba(255,255,255,0.12)" : "rgba(17,18,29,0.08)";

  return (
    <div className="relative grid grid-cols-1 gap-6 p-7 sm:p-10 md:min-h-[540px] md:grid-cols-[1.1fr_0.9fr] md:p-14">
      {/* Decorative background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-[15%] -top-[25%] h-[500px] w-[500px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(243,196,201,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(17,18,29,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-[20%] -left-[10%] h-[400px] w-[400px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(182,149,193,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(151,125,189,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Left column: text content */}
      <div className="relative flex flex-col gap-5">
        <span
          className="w-fit rounded-full border px-4 py-1.5 font-mono-display text-[10px] font-bold tracking-[0.2em]"
          style={{ borderColor: accent, color: accent }}
        >
          {data.category}
        </span>

        <h3
          className="font-display font-bold leading-[0.92] tracking-[-0.02em]"
          style={{ fontSize: "clamp(48px, 6.5vw, 96px)" }}
        >
          <span className="block">{data.title}</span>
          <span className="block">{data.subtitle}</span>
        </h3>

        <p className="max-w-[480px] text-[14px] leading-[1.65] opacity-80 sm:text-[15px]">
          {data.body}
        </p>

        <div className="mt-auto flex flex-wrap gap-2.5 pt-4">
          {data.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border px-4 py-2 font-display text-[13px] transition-colors duration-300"
              style={{
                borderColor: accent,
                background: accentSoft,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right column: video circle */}
      <div className="relative flex items-center justify-center">
        <div className="group relative">
          {/* Outer glow ring */}
          <div
            className="absolute -inset-6 rounded-full opacity-40 blur-2xl"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(243,196,201,0.3) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(17,18,29,0.15) 0%, transparent 70%)",
            }}
          />
          {/* Video container */}
          <div
            className="relative h-[240px] w-[240px] overflow-hidden rounded-full sm:h-[280px] sm:w-[280px] md:h-[320px] md:w-[320px]"
            style={{
              boxShadow: isDark
                ? "0 0 0 1px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.3)"
                : "0 0 0 1px rgba(17,18,29,0.08), 0 20px 60px rgba(0,0,0,0.15)",
            }}
          >
            <video
              src={data.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-300 group-hover:bg-black/20">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.25)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                <PlayIcon className="ml-1 h-5 w-4 text-white drop-shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
