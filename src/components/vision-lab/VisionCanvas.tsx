"use client";

import { useEffect, useRef, useState } from "react";
import type { PredictResponse, Rules } from "@/lib/vision-mock";

/**
 * Canvas overlay editor.
 *
 * Recibe un media element (img / video / webcam stream rendered en <video>)
 * y dibuja sobre él:
 *   - Bounding boxes con label + confidence + trackId
 *   - Polígono ROI (editable: click izquierdo añade puntos, doble click cierra)
 *   - Línea de cruce (editable: 2 clicks)
 *   - Keypoints de pose con esqueleto (modelos pose)
 *   - Texto OCR / descripciones VLM
 *
 * Modos:
 *   - "view"   → solo dibuja overlays
 *   - "roi"    → click para añadir puntos al polígono
 *   - "line"   → 2 clicks para definir línea
 */

type Mode = "view" | "roi" | "line";

type Props = {
  /** El elemento media donde se ven los frames (video, image, etc). */
  mediaRef: React.RefObject<HTMLVideoElement | HTMLImageElement | null>;
  /** Predicciones del último frame. */
  result: PredictResponse | null;
  /** Reglas (incluye ROI y línea). */
  rules: Rules;
  /** Para actualizar reglas al editar. */
  onRulesChange: (rules: Rules) => void;
  /** Modo de edición. */
  mode: Mode;
  /** Para volver a "view" desde fuera. */
  onModeChange: (mode: Mode) => void;
};

export function VisionCanvas({
  mediaRef,
  result,
  rules,
  onRulesChange,
  mode,
  onModeChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [draftLineFrom, setDraftLineFrom] = useState<{ x: number; y: number } | null>(null);

  // Resize canvas to match media
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const update = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      setCanvasSize({ w: rect.width, h: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(canvas);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Draw loop — runs on every frame via requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const tick = () => {
      const w = canvasSize.w;
      const h = canvasSize.h;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // ─────────── Draw ROI polygon ───────────
      if (rules.roi && rules.roi.length > 0) {
        ctx.strokeStyle = "rgba(35, 72, 212, 0.9)";
        ctx.fillStyle = "rgba(35, 72, 212, 0.18)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        rules.roi.forEach((p, i) => {
          const x = p.x * w;
          const y = p.y * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        if (rules.roi.length >= 3) {
          ctx.closePath();
          ctx.fill();
        }
        ctx.stroke();
        // Draw vertices
        rules.roi.forEach((p) => {
          ctx.fillStyle = "rgba(213, 224, 255, 0.95)";
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        // Label
        if (rules.roi.length >= 3) {
          const cx = rules.roi.reduce((s, p) => s + p.x, 0) / rules.roi.length;
          const cy = rules.roi.reduce((s, p) => s + p.y, 0) / rules.roi.length;
          drawTag(ctx, cx * w, cy * h, "ROI · ZONA RESTRINGIDA", "rgb(35,72,212)");
        }
      }

      // ─────────── Draw cross line ───────────
      if (rules.line) {
        const fx = rules.line.from.x * w;
        const fy = rules.line.from.y * h;
        const tx = rules.line.to.x * w;
        const ty = rules.line.to.y * h;
        ctx.strokeStyle = "rgba(234, 179, 8, 0.95)";
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 6]);
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(234, 179, 8, 1)";
        [["from", fx, fy], ["to", tx, ty]].forEach(([_, x, y]) => {
          ctx.beginPath();
          ctx.arc(x as number, y as number, 5, 0, Math.PI * 2);
          ctx.fill();
        });
        drawTag(ctx, (fx + tx) / 2, (fy + ty) / 2, "LÍNEA DE CRUCE", "rgb(234,179,8)");
      }

      // Draft line preview (during line mode, after first click)
      if (mode === "line" && draftLineFrom) {
        ctx.strokeStyle = "rgba(234, 179, 8, 0.5)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(draftLineFrom.x * w, draftLineFrom.y * h, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ─────────── Draw predictions ───────────
      if (result) {
        for (const p of result.predictions) {
          const px = p.bbox.x * w;
          const py = p.bbox.y * h;
          const pw = p.bbox.width * w;
          const ph = p.bbox.height * h;

          const color = colorForLabel(p.label);

          // Box
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(px, py, pw, ph);
          // Soft fill
          ctx.fillStyle = withAlpha(color, 0.08);
          ctx.fillRect(px, py, pw, ph);

          // Corner brackets
          drawCorners(ctx, px, py, pw, ph, color);

          // Label
          const labelText = `${p.trackId ? `#${p.trackId} · ` : ""}${p.label} · ${(p.confidence * 100).toFixed(0)}%`;
          drawLabel(ctx, px, py, labelText, color);

          // OCR text (placas, scene description)
          if (p.text) {
            drawTag(ctx, px + pw / 2, py + ph + 12, p.text, color, true);
          }

          // Missing PPE badge
          if (p.missing && p.missing.length > 0) {
            drawTag(ctx, px + pw / 2, py - 18, `✗ Falta: ${p.missing.join(", ")}`, "rgb(239, 68, 68)");
          }

          // Pose keypoints
          if (p.keypoints && p.keypoints.length > 0) {
            drawSkeleton(ctx, p.keypoints, w, h);
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [canvasSize, result, rules, mode, draftLineFrom]);

  // Click handler — add ROI vertex / line endpoints
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (mode === "roi") {
      const newRoi = [...(rules.roi ?? []), { x, y }];
      onRulesChange({ ...rules, roi: newRoi });
    } else if (mode === "line") {
      if (!draftLineFrom) {
        setDraftLineFrom({ x, y });
      } else {
        onRulesChange({
          ...rules,
          line: { from: draftLineFrom, to: { x, y } },
        });
        setDraftLineFrom(null);
        onModeChange("view");
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === "roi" && rules.roi && rules.roi.length >= 3) {
      onModeChange("view");
    }
    e.preventDefault();
  };

  const cursor =
    mode === "roi" ? "crosshair" : mode === "line" ? "crosshair" : "default";

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className="absolute inset-0 size-full"
      style={{ cursor, zIndex: 10 }}
      aria-label="Vision detection overlay"
    />
  );
}

// ─────────────────────────── Drawing helpers ───────────────────────────

function colorForLabel(label: string): string {
  if (label.includes("ALERT") || label.includes("Watchlist") || label.includes("ppe-missing")) return "rgb(239, 68, 68)";
  if (label.includes("fall")) return "rgb(239, 68, 68)";
  if (label.includes("plate")) return "rgb(168, 85, 247)";
  if (label.includes("face") || label.includes("Empleado")) return "rgb(107, 138, 255)";
  if (label.includes("car") || label.includes("vehicle") || label.includes("truck") || label.includes("motorcycle") || label.includes("bus")) return "rgb(168, 85, 247)";
  return "rgb(35, 72, 212)";
}

function withAlpha(rgb: string, alpha: number): string {
  return rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
}

function drawCorners(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  const len = 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  // TL
  ctx.beginPath(); ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
  // TR
  ctx.beginPath(); ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len); ctx.stroke();
  // BL
  ctx.beginPath(); ctx.moveTo(x, y + h - len); ctx.lineTo(x, y + h); ctx.lineTo(x + len, y + h); ctx.stroke();
  // BR
  ctx.beginPath(); ctx.moveTo(x + w - len, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - len); ctx.stroke();
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string
) {
  ctx.font = "bold 11px ui-monospace, monospace";
  const padding = 6;
  const metrics = ctx.measureText(text);
  const w = metrics.width + padding * 2;
  const h = 18;
  const ly = y > h + 2 ? y - h - 2 : y;
  ctx.fillStyle = "rgba(2, 10, 24, 0.92)";
  ctx.fillRect(x, ly, w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, ly, w, h);
  ctx.fillStyle = "rgba(213, 224, 255, 0.95)";
  ctx.fillText(text, x + padding, ly + h - 5);
}

function drawTag(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  text: string,
  color: string,
  centered = true
) {
  ctx.font = "bold 11px ui-monospace, monospace";
  const padding = 6;
  const metrics = ctx.measureText(text);
  const w = metrics.width + padding * 2;
  const h = 18;
  const x = centered ? cx - w / 2 : cx;
  const y = cy - h / 2;
  ctx.fillStyle = "rgba(2, 10, 24, 0.92)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "rgba(213, 224, 255, 0.95)";
  ctx.fillText(text, x + padding, y + h - 5);
}

const POSE_EDGES: Array<[number, number]> = [
  [5, 6],   // shoulders
  [5, 7], [7, 9],   // left arm
  [6, 8], [8, 10],  // right arm
  [11, 12], // hips
  [5, 11], [6, 12], // torso sides
  [11, 13], [13, 15], // left leg
  [12, 14], [14, 16], // right leg
];

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  kp: Array<[number, number, number]>,
  w: number,
  h: number
) {
  // Edges
  ctx.strokeStyle = "rgba(107, 138, 255, 0.9)";
  ctx.lineWidth = 2;
  for (const [a, b] of POSE_EDGES) {
    const ka = kp[a];
    const kb = kp[b];
    if (!ka || !kb || ka[2] < 0.5 || kb[2] < 0.5) continue;
    ctx.beginPath();
    ctx.moveTo(ka[0] * w, ka[1] * h);
    ctx.lineTo(kb[0] * w, kb[1] * h);
    ctx.stroke();
  }
  // Joints
  ctx.fillStyle = "rgba(213, 224, 255, 0.95)";
  for (const k of kp) {
    if (k[2] < 0.4) continue;
    ctx.beginPath();
    ctx.arc(k[0] * w, k[1] * h, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
