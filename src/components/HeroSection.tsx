"use client";

import { useEffect, useState } from "react";

const words = ["workflow", "process", "lead", "task", "operation"];

export function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % words.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center px-8 animate-fade-in"
      style={{ minHeight: "calc(100svh - 280px)" }}
    >
      {/* Headline */}
      <h1
        className="text-center"
        style={{
          fontSize: "72px",
          fontWeight: 800,
          lineHeight: "80px",
          color: "oklch(1 0 0 / 0.9)",
        }}
      >
        Systems for every{" "}
        <span
          key={currentIdx}
          className="animate-word-cycle inline-block"
          style={{
            color: "oklch(0.95 0.15 108)",
            minWidth: "10ch",
            textAlign: "left",
          }}
        >
          {words[currentIdx]}
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="text-center mt-4"
        style={{
          fontSize: "18px",
          color: "oklch(1 0 0 / 0.6)",
          lineHeight: "28px",
        }}
      >
        We build automation systems that run your business behind the scenes
        <br />
        Always on. No manual work. No missed steps.
      </p>

      {/* CTA row */}
      <div className="mt-8 flex items-center gap-4 justify-center flex-wrap">
        <a
          href="/signup"
          style={{
            backgroundColor: "oklch(0.95 0.15 108)",
            color: "oklch(0.217 0.0038309 106.715)",
            fontSize: "20px",
            fontWeight: 700,
            padding: "0 36px",
            height: "56px",
            borderRadius: 0,
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Build My System
        </a>
        <a
          href="/start"
          style={{
            backgroundColor: "oklch(0.567 0.15 248)",
            color: "white",
            fontSize: "20px",
            fontWeight: 700,
            padding: "0 36px",
            height: "56px",
            borderRadius: 0,
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          See Automations
        </a>
      </div>

      {/* Captions row */}
      <div className="mt-4 flex items-center gap-4 justify-center flex-wrap">
        <span
          style={{
            fontSize: "14px",
            color: "oklch(1 0 0 / 0.6)",
          }}
        >
          Powered by real automation tools (not theory)
        </span>
        <span
          style={{
            fontSize: "14px",
            color: "oklch(1 0 0 / 0.6)",
          }}
        >
          Make, Zapier, Airtable, Notion, n8n &amp; more
        </span>
      </div>
    </section>
  );
}
