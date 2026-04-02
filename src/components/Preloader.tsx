"use client";

import { useState, useEffect, useRef } from "react";

export function Preloader() {
  const [count, setCount] = useState(0);
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 2200; // 2.2s to count 0→100

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Eased progress (ease-out quad)
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * 100));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        // Count finished — fade out
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.opacity = "0";
            containerRef.current.style.transform = "scale(1.05)";
          }
          setTimeout(() => setHidden(true), 600);
        }, 300);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
      style={{ transition: "opacity 0.6s ease-out, transform 0.6s ease-out" }}
    >
      {/* Preloader circle image */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-[200px] w-[200px] animate-spin rounded-full opacity-20"
          style={{
            backgroundImage: "url(/images/preloader-circle.webp)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            animationDuration: "8s",
          }}
        />
        <span
          className="font-display text-[80px] font-light text-white tabular-nums"
          style={{ letterSpacing: "-0.02em" }}
        >
          {count}
        </span>
      </div>
    </div>
  );
}
