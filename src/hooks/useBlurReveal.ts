"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

interface BlurRevealOptions {
  /** Split by "words" | "chars" | "lines" — default "words" */
  splitBy?: "words" | "chars" | "lines";
  /** Starting blur amount — default "0.8vw" (matches original) */
  blur?: string;
  /** Starting opacity — default 0 */
  fromOpacity?: number;
  /** Starting scale — default 0.95 */
  fromScale?: number;
  /** Total stagger duration — default 0.4 */
  staggerTotal?: number;
  /** GSAP ease — default "power1.inOut" */
  ease?: string;
  /** Animation duration per element — default 1.8 */
  duration?: number;
  /** ScrollTrigger start — default "top 85%" */
  start?: string;
  /** ScrollTrigger end — default "top 35%" */
  end?: string;
  /** Use scrub (scroll-driven) — default true */
  scrub?: boolean | number;
}

/**
 * Hook that applies SplitType + GSAP blur-in reveal on scroll.
 * Matches the original Naya Studio animation pattern.
 */
export function useBlurReveal<T extends HTMLElement>(
  options: BlurRevealOptions = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      splitBy = "words",
      blur = "0.8vw",
      fromOpacity = 0,
      fromScale = 0.95,
      staggerTotal = 0.4,
      ease = "power1.inOut",
      duration = 1.8,
      start = "top 85%",
      end = "top 35%",
      scrub = true,
    } = options;

    // SplitType splits the text into spans
    const split = new SplitType(el, {
      types: splitBy,
      tagName: "span",
    });

    const targets =
      splitBy === "words"
        ? split.words
        : splitBy === "chars"
          ? split.chars
          : split.lines;

    if (!targets || targets.length === 0) return;

    // Set initial state
    gsap.set(targets, {
      opacity: fromOpacity,
      filter: `blur(${blur})`,
      scale: fromScale,
      willChange: "opacity, filter, transform",
    });

    // Animate on scroll
    gsap.to(targets, {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      duration,
      ease,
      stagger: {
        each: staggerTotal / targets.length,
      },
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
      },
    });

    return () => {
      split.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [options]);

  return ref;
}
