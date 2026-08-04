"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { RefObject } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** The server has no media queries — assume motion is allowed, then correct on hydration. */
function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/**
 * `true` when the user has asked the OS to reduce motion.
 *
 * Deliberately built on `useSyncExternalStore` rather than `useState` + `useEffect`:
 * this project's ESLint runs the React Compiler rules, and `react-hooks/set-state-in-effect`
 * rejects the usual `setMatches(mq.matches)` line in an effect body. `useSyncExternalStore`
 * is also the hydration-safe way to read a client-only value.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

export interface UseInViewOptions {
  /** Portion of the element that must be visible before it counts. Default `0.1`. */
  threshold?: number | readonly number[];
  /** Viewport used as the bounding box. Default `null` (the browser viewport). */
  root?: Element | Document | null;
  /** Margin grown/shrunk around the root box. Default `"0px"`. */
  rootMargin?: string;
}

/**
 * One-shot scroll-entrance detector.
 *
 * Mirrors the observer the fundup.au journey section ships inline: an
 * `IntersectionObserver` at `threshold: 0.1` that calls `unobserve` the moment the element
 * first intersects, so the entrance plays exactly once and never replays on scroll-back.
 *
 * When the user prefers reduced motion the element is never observed and the hook reports
 * `true` from the first client render, so callers can paint the final state immediately.
 *
 * ```tsx
 * const [ref, isInView] = useInView<HTMLDivElement>();
 * return <div ref={ref} className={isInView ? "opacity-100" : "opacity-0"} />;
 * ```
 */
export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {},
): readonly [RefObject<T | null>, boolean] {
  const { threshold = 0.1, root = null, rootMargin = "0px" } = options;

  const ref = useRef<T | null>(null);
  const [hasIntersected, setHasIntersected] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // `threshold` may be an array literal; serialise it so a fresh array each render does not
  // tear the observer down and rebuild it on every commit.
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : String(threshold);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setHasIntersected(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: thresholdKey.split(",").map(Number),
        root,
        rootMargin,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion, thresholdKey, root, rootMargin]);

  return [ref, prefersReducedMotion || hasIntersected] as const;
}
