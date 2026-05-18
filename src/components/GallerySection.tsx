"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed 3-column parallax gallery matching the original Aurora layout.
 *
 * Each column contains 2-3 images that move at different scroll speeds.
 * The section has extra height (scroll runway) and a sticky viewport-height
 * container so the parallax transforms have room to play.
 *
 * Uses background-image for full-bleed coverage like the original.
 */

/* 3 columns × 3 rows = 9 cells. We have images home_10–home_16 (7 images).
   Duplicate two to fill the 9-cell grid. */
const GRID: {
  src: string;
  col: number;     // 0-based column
  row: number;     // 0-based row within that column
  aspect: string;  // CSS aspect-ratio
  speed: number;   // parallax multiplier (negative = slower, positive = faster)
}[] = [
  // Column 0 (left) — moves up
  { src: "/images/home_10.webp", col: 0, row: 0, aspect: "3/4",   speed: -0.08 },
  { src: "/images/home_13.webp", col: 0, row: 1, aspect: "4/5",   speed: -0.08 },
  { src: "/images/home_16.webp", col: 0, row: 2, aspect: "3/4",   speed: -0.08 },
  // Column 1 (center) — moves down
  { src: "/images/home_11.webp", col: 1, row: 0, aspect: "4/5",   speed: 0.04 },
  { src: "/images/home_14.webp", col: 1, row: 1, aspect: "3/4",   speed: 0.04 },
  { src: "/images/home_10.webp", col: 1, row: 2, aspect: "4/5",   speed: 0.04 },
  // Column 2 (right) — moves up faster
  { src: "/images/home_12.webp", col: 2, row: 0, aspect: "4/5",   speed: -0.12 },
  { src: "/images/home_15.webp", col: 2, row: 1, aspect: "3/4",   speed: -0.12 },
  { src: "/images/home_11.webp", col: 2, row: 2, aspect: "4/5",   speed: -0.12 },
];

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  /* Scroll-driven column parallax */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollableHeight = section.offsetHeight - vh;
      if (scrollableHeight <= 0) return;
      // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));

      // Each column gets its own speed — amplified for visible parallax
      const speeds = [-0.15, 0.08, -0.2];
      colRefs.current.forEach((col, i) => {
        if (!col) return;
        const y = progress * speeds[i] * vh * 2.5;
        col.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* Build columns */
  const columns: (typeof GRID)[] = [[], [], []];
  GRID.forEach((item) => columns[item.col].push(item));

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#11121d]"
      style={{ paddingTop: "4vh", paddingBottom: "4vh" }}
    >
      {/* Full-bleed 3-column grid */}
      <div className="grid grid-cols-1 gap-2.5 px-2.5 sm:grid-cols-3 sm:gap-3 sm:px-3">
        {columns.map((col, ci) => (
          <div
            key={ci}
            ref={(el) => {
              colRefs.current[ci] = el;
            }}
            className="flex flex-col gap-2.5 will-change-transform sm:gap-3"
            style={{
              /* Offset columns vertically for staggered look */
              marginTop: ci === 1 ? "12vh" : ci === 2 ? "24vh" : "0",
            }}
          >
            {col.map((item, ri) => (
              <GalleryImage key={`${ci}-${ri}`} src={item.src} aspect={item.aspect} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function GalleryImage({ src, aspect }: { src: string; aspect: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[8px]"
      style={{
        aspectRatio: aspect,
        opacity: 0,
        transform: "scale(0.96)",
        transition:
          "opacity 0.8s cubic-bezier(0.2,0.7,0.2,1), transform 0.8s cubic-bezier(0.2,0.7,0.2,1)",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.04]"
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
}
