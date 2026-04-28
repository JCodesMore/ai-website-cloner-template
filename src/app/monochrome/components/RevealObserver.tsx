"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Single global IntersectionObserver that watches every element marked with
 * `data-reveal` inside the monochrome subtree. When an element scrolls into
 * view it gains `data-revealed`, which triggers the CSS fade-up transition
 * defined in monochrome.css.
 *
 * Re-runs on path changes so client-side navigation picks up the elements
 * of the freshly-mounted page.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    // Watch existing elements right after the new page paints.
    const armId = requestAnimationFrame(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        '[data-clone="monochrome"] [data-reveal]:not([data-revealed])',
      );
      targets.forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(armId);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
