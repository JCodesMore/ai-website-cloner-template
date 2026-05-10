"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps children with a reveal-on-scroll effect using IntersectionObserver.
 *
 * - Stays invisible (opacity 0 + translateY 20px) until the element enters
 *   the viewport.
 * - Once visible, fades in with a CSS transition. The transition is
 *   one-way: it doesn't re-hide on scroll-up.
 * - `delay` lets you stagger siblings.
 *
 * Lightweight (no library), accessibility-safe (respects
 * prefers-reduced-motion), and tree-shaken if not imported.
 */
type Props = {
  children: React.ReactNode;
  delay?: number;
  /** Distance below the original position when hidden (px). Default 20. */
  yOffset?: number;
  /** Render as this tag (default `div`). */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Threshold passed to IntersectionObserver (0..1). Default 0.15. */
  threshold?: number;
};

export function RevealOnScroll({
  children,
  delay = 0,
  yOffset = 20,
  as = "div",
  className,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion: just become visible immediately
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : `translateY(${yOffset}px)`,
        transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
