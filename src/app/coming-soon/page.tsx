"use client";

import { useEffect, useState } from "react";
import { PaperPlaneIcon } from "@/components/icons";

const TARGET = new Date("2026-12-31T00:00:00Z").getTime();

function diffParts(remaining: number) {
  if (remaining <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const secs = Math.floor(remaining / 1000);
  return {
    days: Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    minutes: Math.floor((secs % 3600) / 60),
    seconds: secs % 60,
  };
}

export default function ComingSoonPage() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = now === null ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : diffParts(TARGET - now);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center pt-32 pb-16"
      style={{ backgroundImage: "url(/img/bg/bg-05.jpg)" }}
    >
      <div aria-hidden className="absolute inset-0 bg-secondary/85" />
      <div className="relative z-10 yo-container text-center text-white">
        <span className="yo-subtitle text-white">Coming Soon</span>
        <h1 className="yo-headline-split text-[40px] md:text-[56px] lg:text-[72px] leading-none mt-5 mb-8">
          We are launching <span className="light">very soon</span>
        </h1>
        <p className="text-white/80 max-w-xl mx-auto mb-10">
          Something new is coming to the VertexLink universe. Drop your email below to be first to hear when
          it goes live.
        </p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12" suppressHydrationWarning>
          {[
            { label: "Days", value: parts.days },
            { label: "Hours", value: parts.hours },
            { label: "Minutes", value: parts.minutes },
            { label: "Seconds", value: parts.seconds },
          ].map((p) => (
            <div
              key={p.label}
              className="bg-white/10 border border-white/20 rounded-[10px] w-24 sm:w-32 py-5"
            >
              <div className="text-3xl sm:text-5xl font-extrabold leading-none">
                {String(p.value).padStart(2, "0")}
              </div>
              <div className="mt-2 uppercase tracking-wider text-xs sm:text-sm">{p.label}</div>
            </div>
          ))}
        </div>

        <form action="#" method="post" className="max-w-md mx-auto relative" suppressHydrationWarning>
          <input
            type="email"
            placeholder="Subscribe with us"
            className="w-full h-14 rounded-full bg-white text-secondary placeholder:text-body/60 px-6 pr-16 outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 size-11 rounded-full bg-primary text-white grid place-items-center"
          >
            <PaperPlaneIcon className="size-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
