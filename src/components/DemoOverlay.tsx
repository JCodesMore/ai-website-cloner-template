"use client";

import { useEffect, useRef, useState } from "react";
import type { DemoType } from "@/data/ai-capabilities";

/**
 * Synthetic AI detection overlay.
 *
 * Draws animated bounding boxes, keypoints, ROIs and labels on top of any
 * source (image, looped video, webcam stream). The overlays are *simulated*
 * — they don't run a real model — but the visual pattern is consistent
 * with what a real AI engine would output: boxes, confidence scores, IDs,
 * crossing lines, heat overlays, etc.
 *
 * Use case: client demos where you want to show what an analytic
 * "looks like" without shipping multi-MB ML models in the browser.
 */

type Box = {
  x: number; // 0..1 normalized
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
  color?: "primary" | "danger" | "warning" | "neutral";
  id?: string | number;
};

const COLORS = {
  primary: { stroke: "rgb(35, 72, 212)", fill: "rgba(35, 72, 212, 0.12)", glow: "rgb(107, 138, 255)" },
  danger:  { stroke: "rgb(239, 68, 68)",  fill: "rgba(239, 68, 68, 0.12)",  glow: "rgb(252, 165, 165)" },
  warning: { stroke: "rgb(234, 179, 8)",  fill: "rgba(234, 179, 8, 0.12)",  glow: "rgb(253, 224, 71)"  },
  neutral: { stroke: "rgb(213, 224, 255)", fill: "rgba(213, 224, 255, 0.06)", glow: "rgb(213, 224, 255)" },
};

type Props = {
  demoType: DemoType;
  /** Whether the overlay is "live" — false freezes the animation */
  active?: boolean;
};

export function DemoOverlay({ demoType, active = true }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, [active]);

  const boxes = computeBoxes(demoType, tick);
  const decorations = computeDecorations(demoType, tick);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Decoration layer (ROIs, lines, heatmaps) */}
      {decorations}

      {/* Boxes layer */}
      {boxes.map((b, i) => {
        const c = COLORS[b.color ?? "primary"];
        return (
          <g key={`${b.label}-${i}-${tick}`} style={{ animation: "ars-fade-in 0.4s ease-out" }}>
            {/* Glow */}
            <rect
              x={b.x * 100 - 0.2}
              y={b.y * 100 - 0.2}
              width={b.w * 100 + 0.4}
              height={b.h * 100 + 0.4}
              fill="none"
              stroke={c.glow}
              strokeWidth="0.3"
              opacity="0.45"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "blur(2px)" }}
            />
            {/* Main box */}
            <rect
              x={b.x * 100}
              y={b.y * 100}
              width={b.w * 100}
              height={b.h * 100}
              fill={c.fill}
              stroke={c.stroke}
              strokeWidth="0.25"
              vectorEffect="non-scaling-stroke"
            />
            {/* Corners */}
            {drawCorners(b)}
            {/* Label */}
            <Label
              x={b.x * 100}
              y={b.y * 100}
              text={b.label}
              confidence={b.confidence}
              color={c.stroke}
              id={b.id}
            />
          </g>
        );
      })}

      <style jsx>{`
        @keyframes ars-fade-in {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </svg>
  );
}

function Label({
  x,
  y,
  text,
  confidence,
  color,
  id,
}: {
  x: number;
  y: number;
  text: string;
  confidence: number;
  color: string;
  id?: string | number;
}) {
  // Render label as foreignObject so we get HTML/CSS text — much better
  // typography than SVG <text> for this scale.
  const labelW = 16;
  const labelH = 4;
  const yOffset = y > labelH + 1 ? -labelH - 0.4 : 0.4;
  return (
    <foreignObject x={x} y={y + yOffset} width={labelW} height={labelH}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.45vw",
          minWidth: "fit-content",
          padding: "1px 3px",
          background: "rgba(2, 10, 24, 0.92)",
          border: `1px solid ${color}`,
          color: "#d5e0ff",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 700,
          whiteSpace: "nowrap",
          display: "inline-flex",
          gap: "4px",
          alignItems: "center",
          lineHeight: 1.2,
        }}
      >
        {id !== undefined && <span style={{ color }}>#{id}</span>}
        <span>{text}</span>
        <span style={{ color: "rgba(213,224,255,0.5)" }}>{(confidence * 100).toFixed(0)}%</span>
      </div>
    </foreignObject>
  );
}

function drawCorners(b: Box) {
  const c = COLORS[b.color ?? "primary"].stroke;
  const x1 = b.x * 100;
  const y1 = b.y * 100;
  const x2 = (b.x + b.w) * 100;
  const y2 = (b.y + b.h) * 100;
  const len = 0.8;
  const props = {
    stroke: c,
    strokeWidth: "0.35",
    fill: "none",
    vectorEffect: "non-scaling-stroke" as const,
  };
  return (
    <g>
      {/* TL */}
      <path d={`M ${x1} ${y1 + len} L ${x1} ${y1} L ${x1 + len} ${y1}`} {...props} />
      {/* TR */}
      <path d={`M ${x2 - len} ${y1} L ${x2} ${y1} L ${x2} ${y1 + len}`} {...props} />
      {/* BL */}
      <path d={`M ${x1} ${y2 - len} L ${x1} ${y2} L ${x1 + len} ${y2}`} {...props} />
      {/* BR */}
      <path d={`M ${x2 - len} ${y2} L ${x2} ${y2} L ${x2} ${y2 - len}`} {...props} />
    </g>
  );
}

// ─────────────────────────── Per-type box generators ───────────────────────────

function pseudo(seed: number) {
  // Deterministic pseudo-random based on seed (so the animation is stable)
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function computeBoxes(type: DemoType, tick: number): Box[] {
  const r = pseudo(tick + 1);
  switch (type) {
    case "face": {
      // 3 faces wandering
      const names = ["Empleado #4172", "Visitante", "Watchlist"];
      return Array.from({ length: 3 }).map((_, i) => {
        const baseX = 0.18 + i * 0.28 + r() * 0.04 - 0.02;
        const baseY = 0.28 + r() * 0.18;
        return {
          x: baseX,
          y: baseY,
          w: 0.13,
          h: 0.18,
          label: names[i],
          confidence: 0.85 + r() * 0.13,
          color: i === 2 ? "danger" : "primary",
          id: i + 1,
        };
      });
    }
    case "lpr": {
      const plates = ["BCD-472", "FNK-019", "ZTW-823"];
      return plates.slice(0, 2 + (tick % 2)).map((p, i) => ({
        x: 0.14 + i * 0.32 + r() * 0.04,
        y: 0.55 + r() * 0.18,
        w: 0.18,
        h: 0.06,
        label: p,
        confidence: 0.92 + r() * 0.07,
        color: "primary",
        id: i + 1,
      }));
    }
    case "ppe": {
      const checks = ["✓ Casco · Chaleco", "✗ Sin casco", "✓ EPP completo"];
      return Array.from({ length: 3 }).map((_, i) => ({
        x: 0.14 + i * 0.27 + r() * 0.03,
        y: 0.22 + r() * 0.05,
        w: 0.18,
        h: 0.55,
        label: checks[i],
        confidence: 0.88 + r() * 0.1,
        color: i === 1 ? "danger" : "primary",
        id: i + 1,
      }));
    }
    case "intrusion": {
      // Person crossing the ROI line
      return [{
        x: 0.42 + (tick % 4) * 0.06,
        y: 0.4,
        w: 0.14,
        h: 0.4,
        label: "Intruso · ROI",
        confidence: 0.94,
        color: "danger",
        id: "RAM-1",
      }];
    }
    case "behavior": {
      return [
        { x: 0.32, y: 0.35, w: 0.12, h: 0.4, label: "Merodeo", confidence: 0.81, color: "warning", id: 1 },
        { x: 0.6,  y: 0.3,  w: 0.13, h: 0.42, label: "Persona", confidence: 0.91, color: "primary", id: 2 },
      ];
    }
    case "people-count": {
      // 5-7 person boxes
      const n = 5 + (tick % 3);
      return Array.from({ length: n }).map((_, i) => ({
        x: (i / n) * 0.85 + 0.05 + r() * 0.02,
        y: 0.35 + (i % 2) * 0.12 + r() * 0.05,
        w: 0.07,
        h: 0.35,
        label: "Persona",
        confidence: 0.88 + r() * 0.1,
        color: "primary",
        id: i + 1,
      }));
    }
    case "thermal": {
      return [
        { x: 0.25, y: 0.4, w: 0.12, h: 0.4, label: "Persona · 36.7°C", confidence: 0.93, color: "warning", id: 1 },
        { x: 0.55, y: 0.35, w: 0.13, h: 0.42, label: "Persona · 37.1°C", confidence: 0.91, color: "warning", id: 2 },
      ];
    }
    case "vehicle": {
      const types = ["SUV · Negro", "Moto · Roja", "Camión · Blanco"];
      return types.slice(0, 2 + (tick % 2)).map((t, i) => ({
        x: 0.2 + i * 0.3 + r() * 0.04,
        y: 0.35 + r() * 0.15,
        w: 0.22,
        h: 0.28,
        label: t,
        confidence: 0.89 + r() * 0.08,
        color: "primary",
        id: i + 1,
      }));
    }
    case "object": {
      return [
        { x: 0.55, y: 0.55, w: 0.1, h: 0.13, label: "Mochila · 47s", confidence: 0.87, color: "warning", id: "OBJ-1" },
        { x: 0.2, y: 0.4, w: 0.1, h: 0.42, label: "Persona", confidence: 0.93, color: "primary", id: 1 },
      ];
    }
    case "fall": {
      return [{
        x: 0.32 + (tick % 3) * 0.04,
        y: 0.6,
        w: 0.36,
        h: 0.18,
        label: "Caída detectada",
        confidence: 0.95,
        color: "danger",
        id: "EMERG-1",
      }];
    }
    case "fire": {
      return [{
        x: 0.4 + (tick % 4) * 0.02,
        y: 0.3,
        w: 0.22,
        h: 0.28,
        label: "Humo · Fuego",
        confidence: 0.91,
        color: "danger",
        id: "FIRE-1",
      }];
    }
    case "crowd": {
      // Lots of small boxes
      const n = 18 + (tick % 4) * 2;
      return Array.from({ length: n }).map((_, i) => ({
        x: 0.1 + (i % 6) * 0.13 + r() * 0.02,
        y: 0.3 + Math.floor(i / 6) * 0.18 + r() * 0.03,
        w: 0.05,
        h: 0.14,
        label: "P",
        confidence: 0.82 + r() * 0.15,
        color: i % 5 === 0 ? "warning" : "primary",
        id: i + 1,
      }));
    }
  }
}

function computeDecorations(type: DemoType, tick: number) {
  switch (type) {
    case "intrusion":
      // ROI rectangle + crossing line
      return (
        <>
          <rect
            x={20}
            y={25}
            width={60}
            height={60}
            fill="rgba(239, 68, 68, 0.04)"
            stroke="rgba(239, 68, 68, 0.7)"
            strokeWidth="0.3"
            strokeDasharray="1.2 0.8"
            vectorEffect="non-scaling-stroke"
          />
          <text x={21} y={29} fontSize="2" fill="rgba(239,68,68,0.95)" fontFamily="var(--font-mono)" fontWeight="700" letterSpacing="0.1em" style={{ textTransform: "uppercase" }}>
            ROI · ZONA RESTRINGIDA
          </text>
          <line
            x1="50"
            y1="20"
            x2="50"
            y2="90"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeWidth="0.4"
            strokeDasharray="0.8 0.4"
            vectorEffect="non-scaling-stroke"
            style={{ animation: "ars-pulse 1.4s ease-in-out infinite" }}
          />
        </>
      );
    case "people-count":
      return (
        <>
          {/* Counter pill */}
          <foreignObject x={70} y={4} width={26} height={6}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.5vw",
                padding: "2px 6px",
                background: "rgba(2, 10, 24, 0.92)",
                border: "1px solid rgb(35, 72, 212)",
                color: "#d5e0ff",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              <span style={{ color: "rgb(107, 138, 255)" }}>◉</span>
              <span>Aforo:</span>
              <span style={{ color: "#d5e0ff", fontWeight: 800 }}>
                {5 + (tick % 3)} personas
              </span>
            </div>
          </foreignObject>
          {/* Counting line */}
          <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(35, 72, 212, 0.6)" strokeWidth="0.3" strokeDasharray="0.5 0.4" vectorEffect="non-scaling-stroke" />
          <text x={2} y={84} fontSize="2" fill="rgba(213,224,255,0.6)" fontFamily="var(--font-mono)" fontWeight="700" letterSpacing="0.12em" style={{ textTransform: "uppercase" }}>
            Línea de conteo
          </text>
        </>
      );
    case "thermal":
      // Heat gradient overlay
      return (
        <>
          <defs>
            <radialGradient id="heat1" cx="0.31" cy="0.55" r="0.18">
              <stop offset="0%" stopColor="rgba(239,68,68,0.45)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0)" />
            </radialGradient>
            <radialGradient id="heat2" cx="0.62" cy="0.5" r="0.2">
              <stop offset="0%" stopColor="rgba(234,179,8,0.4)" />
              <stop offset="100%" stopColor="rgba(234,179,8,0)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#heat1)" />
          <rect x="0" y="0" width="100" height="100" fill="url(#heat2)" />
        </>
      );
    case "fire":
      // Fire glow
      return (
        <>
          <defs>
            <radialGradient id="fireGlow" cx="0.5" cy="0.45" r="0.3">
              <stop offset="0%" stopColor="rgba(239,68,68,0.55)" />
              <stop offset="60%" stopColor="rgba(234,179,8,0.2)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#fireGlow)" />
        </>
      );
    case "crowd":
      // Density bar + saturation indicator
      return (
        <foreignObject x={4} y={4} width={92} height={6}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5vw",
              padding: "2px 6px",
              background: "rgba(2, 10, 24, 0.92)",
              border: "1px solid rgb(234, 179, 8)",
              color: "#d5e0ff",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ color: "rgb(234, 179, 8)" }}>◆</span>
            <span>Densidad:</span>
            <span style={{ color: "#d5e0ff", fontWeight: 800 }}>2.4 pers/m²</span>
            <span style={{ marginLeft: "auto", color: "rgb(234, 179, 8)" }}>SATURACIÓN ALTA</span>
          </div>
        </foreignObject>
      );
    case "lpr":
      return (
        <>
          {/* Vehicle ROI */}
          <rect x="10" y="50" width="80" height="35" fill="none" stroke="rgba(35, 72, 212, 0.4)" strokeWidth="0.25" strokeDasharray="0.8 0.6" vectorEffect="non-scaling-stroke" />
          <text x={12} y={55} fontSize="1.8" fill="rgba(213,224,255,0.55)" fontFamily="var(--font-mono)" fontWeight="700" letterSpacing="0.12em" style={{ textTransform: "uppercase" }}>
            Carril de detección
          </text>
        </>
      );
    case "fall":
      return (
        <foreignObject x={4} y={4} width={50} height={6}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5vw",
              padding: "2px 6px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgb(239, 68, 68)",
              color: "rgb(252, 165, 165)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "flex",
              gap: 6,
              alignItems: "center",
              animation: "ars-pulse 0.9s ease-in-out infinite",
            }}
          >
            <span>⚠</span>
            <span>Alerta crítica · Personal médico despachado</span>
          </div>
        </foreignObject>
      );
    default:
      return null;
  }
}
