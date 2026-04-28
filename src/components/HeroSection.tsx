"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KV_IMAGES = Array.from({ length: 17 }, (_, i) => ({
  src: `/images/kv/kv_${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `Monochrome visual ${String(i + 1).padStart(2, "0")}`,
}));

const CYCLE_MS = 5000;

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  // bump this counter to reset the auto-cycle interval (used on user click)
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % KV_IMAGES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [timerKey]);

  const handleSelect = (i: number) => {
    setActiveIndex(i);
    setTimerKey((k) => k + 1);
  };

  return (
    <section className="overflow-hidden w-full pt-[6.5rem] h-screen-s lg:base-pr">
      <div className="relative flex w-full h-full flex-col lg:flex-row pb-16 gap-4 md:pb-20 md:gap-10 lg:pb-0 lg:justify-between lg:gap-16">
        <div className="relative flex-1 overflow-hidden">
          {KV_IMAGES.map((kv, i) => (
            <div
              key={kv.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out-expo will-change-[opacity] z-0",
                activeIndex === i ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={kv.src}
                alt={kv.alt}
                fill
                className="object-cover"
                priority={i < 3}
                sizes="(min-width: 1024px) calc(100vw - 220px), 100vw"
              />
            </div>
          ))}
          <h1 className="absolute z-50 text-white text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] leading-[1.25] left-0 bottom-0 base-px pb-5 md:pb-8 xl:pb-10 font-normal">
            未来に残したい景色をつくる。
          </h1>
        </div>

        <ul className="hidden lg:flex flex-col gap-2 overflow-y-auto h-full py-2 w-[140px] shrink-0">
          {KV_IMAGES.map((kv, i) => (
            <li key={kv.src} className="shrink-0">
              <button
                type="button"
                onClick={() => handleSelect(i)}
                aria-label={`Show ${kv.alt}`}
                aria-current={activeIndex === i}
                className={cn(
                  "relative block w-[147px] h-[82px] overflow-hidden transition-opacity duration-300",
                  activeIndex === i
                    ? "opacity-100"
                    : "opacity-50 hover:opacity-100",
                )}
              >
                <Image
                  src={kv.src}
                  alt=""
                  fill
                  sizes="147px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
