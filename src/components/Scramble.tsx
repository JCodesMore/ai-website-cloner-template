"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

type Props = {
  text: string;
  className?: string;
  durationMs?: number;
  delayMs?: number;
  // Re-run animation when this value changes (e.g. locale switch).
  trigger?: string | number;
  // Run as soon as the element enters the viewport (default: true).
  observe?: boolean;
  // Per-character speed once the reveal advances. Higher = slower.
  scrambleSpeed?: number;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Scramble({
  text,
  className,
  durationMs = 700,
  delayMs = 0,
  trigger,
  observe = true,
  scrambleSpeed = 30,
  as = "span",
}: Props) {
  // Initial render uses the real text so SSR and client first-paint match.
  // The animation kicks in inside useEffect (client-only).
  const [display, setDisplay] = useState(text);
  const elRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  function initialState(txt: string) {
    return txt
      .split("")
      .map((c) => (c === " " ? " " : randomChar()))
      .join("");
  }

  useEffect(() => {
    function start() {
      if (startedRef.current) return;
      startedRef.current = true;

      const startTime = performance.now() + delayMs;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed < 0) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        const progress = Math.min(elapsed / durationMs, 1);
        const reveal = Math.floor(progress * text.length);

        // Scramble pulse: only update non-revealed characters periodically
        const out = text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "\n") return char;
            if (i < reveal) return char;
            // Use a tick counter so unrevealed chars glitch faster
            return Math.floor(now / scrambleSpeed) % 2 === i % 2
              ? randomChar()
              : randomChar();
          })
          .join("");

        setDisplay(out);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }

    function reset() {
      startedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDisplay(initialState(text));
    }

    reset();

    if (!observe) {
      start();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    const el = elRef.current;
    if (!el) {
      // Fallback: just start
      start();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            start();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, durationMs, delayMs, trigger, observe, scrambleSpeed]);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={elRef as React.RefObject<HTMLElement>} className={className}>
      {display}
    </Tag>
  );
}
