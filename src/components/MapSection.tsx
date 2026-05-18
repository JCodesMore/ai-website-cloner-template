"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

const STEPS = [
  { n: "01", t: "Weekly On-Site Check-Ins" },
  { n: "02", t: "Personalized Action Playbook" },
  { n: "03", t: "Live Content Capture" },
  { n: "04", t: "Editorial Calendar Orchestration" },
];

export function MapSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [leftRef.current, rightRef.current].filter(Boolean) as HTMLDivElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative bg-[#11121d] py-32 text-white">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-16 px-6 lg:grid-cols-2">
        {/* LEFT: dotted map of France + ambassador */}
        <div
          ref={leftRef}
          className="flex flex-col items-center"
          style={{
            opacity: 0,
            transform: "translateY(36px)",
            transition:
              "opacity 0.9s cubic-bezier(0.2,0.7,0.2,1) 0.1s, transform 0.9s cubic-bezier(0.2,0.7,0.2,1) 0.1s",
          }}
        >
          <div className="relative w-full max-w-[480px]">
            <Image
              src="/images/map-france-less-dotted.BJ8qf9St.png"
              alt="France map"
              width={610}
              height={558}
              className="h-auto w-full opacity-85"
            />
            {/* Nantes pulse dot */}
            <span className="absolute left-[24%] top-[48%] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-[radar-pulse_2s_ease-out_infinite] rounded-full bg-[#f3c4c9]/40" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#f3c4c9]" />
            </span>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/[0.06] hover:text-white">
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div className="flex flex-col items-center">
              <div className="relative h-[68px] w-[68px] overflow-hidden rounded-lg">
                <Image
                  src="/images/home_0.webp"
                  alt="Julie ambassador"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-3.5 font-display text-[15px] tracking-[-0.01em]">
                Julie{" "}
                <span className="text-white/50">⏤</span>{" "}
                Nantes
              </p>
              <div className="mt-1.5 flex items-center gap-4 text-[14px]">
                <a
                  className="border-b border-[#f3c4c9]/70 pb-0.5 text-[#f3c4c9] transition-colors duration-300 hover:border-[#f3c4c9]"
                  href="#"
                >
                  Contacter
                </a>
                <a
                  className="text-white/70 transition-colors duration-300 hover:text-white"
                  href="tel:+33731007592"
                >
                  +33 7 31 00 75 92
                </a>
              </div>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-all duration-300 hover:border-white/40 hover:bg-white/[0.06] hover:text-white">
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* RIGHT: steps */}
        <div
          ref={rightRef}
          className="flex flex-col gap-10"
          style={{
            opacity: 0,
            transform: "translateY(36px)",
            transition:
              "opacity 0.9s cubic-bezier(0.2,0.7,0.2,1) 0.25s, transform 0.9s cubic-bezier(0.2,0.7,0.2,1) 0.25s",
          }}
        >
          <h3
            className="font-display font-bold leading-[1.06] tracking-[-0.02em]"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            An Embedded Partner from Day One
          </h3>
          <p className="max-w-[460px] text-[15px] leading-[1.65] text-white/75">
            We believe you can't promote a place without living it. Your
            ambassador visits regularly, meets your teams, listens to guests,
            and captures key moments—new spaces, seasonal rituals, meaningful
            details that define your experience.
          </p>
          <ul className="flex flex-col">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="flex items-center justify-between border-t border-white/[0.08] py-7 transition-colors duration-300 last:border-b hover:border-white/20"
              >
                <span className="font-display text-[18px] font-bold tracking-[-0.01em] sm:text-[21px]">
                  {s.t}
                </span>
                <span className="font-mono-display text-[20px] font-bold text-[#f3c4c9] sm:text-[24px]">
                  {s.n}
                </span>
              </li>
            ))}
          </ul>
          <p className="max-w-[460px] text-[14px] leading-[1.65] text-white/65">
            At Aurora, you don't navigate alone. Your field ambassador is the
            bridge to our entire studio—curating experts, syncing calendars,
            and reporting progress with clarity.
          </p>
          <a
            className="group self-start border-b border-[#f3c4c9]/60 pb-1 font-display text-[15px] text-[#f3c4c9] transition-all duration-300 hover:border-[#f3c4c9]"
            href="#"
          >
            Discover our offers
            <span className="ml-1.5 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
