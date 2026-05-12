"use client";

import { useEffect, useRef, useState } from "react";

import { COUNTERS } from "@/lib/content";

interface CountUpProps {
  value: number;
}

function CountUp({ value }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState<number>(0);
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasStartedRef.current) {
            hasStartedRef.current = true;
            observer.disconnect();

            const duration = 1500;
            const start = performance.now();

            const tick = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.round(eased * value));
              if (progress < 1) {
                requestAnimationFrame(tick);
              }
            };

            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export function CounterStats() {
  return (
    <section className="bg-primary relative overflow-hidden py-24 lg:py-28">
      <div className="yo-container relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTERS.map((counter) => (
            <div
              key={`${counter.label1}-${counter.label2}`}
              className="flex items-start gap-5"
            >
              <h3 className="text-[40px] font-bold leading-none whitespace-nowrap text-white">
                <CountUp value={counter.value} />
              </h3>
              <span className="leading-tight text-white">
                {counter.label1}
                <br />
                {counter.label2}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative shapes */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[26px] right-[-110px] hidden h-[380px] w-[390px] rounded-[10px] border border-white/25 lg:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[116px] right-[-60px] hidden h-[100px] w-[130px] rounded-[10px] bg-white/30 lg:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-[10%] hidden h-[130px] w-[160px] rounded-[10px] border border-white/20 lg:block"
      />
    </section>
  );
}
