"use client";

import { useEffect, useRef } from "react";

/**
 * Animated background canvas — renders the ARS narrative:
 * physical sensors (camera nodes) → data streams (curved light lines) →
 * central AI brain (pulsing core) → events (particles flowing toward core).
 *
 * Six "scenes" alter the topology so each section feels distinct while
 * staying in one visual language.
 */
export type SceneId =
  | "plataforma"
  | "monitoreo"
  | "inteligencia"
  | "reconocimiento"
  | "seguridad"
  | "decisiones";

type Props = {
  scene: SceneId;
  /** 0..1 — how strongly this scene is "in view". Drives opacity/intensity. */
  intensity?: number;
};

type Node = {
  x: number; // 0..1 normalized
  y: number;
  radius: number;
  pulsePhase: number;
  isCore?: boolean;
};

type Edge = { from: number; to: number };

type Particle = {
  edge: number;
  t: number;
  speed: number;
  alpha: number;
};

const COLORS = {
  base: "rgb(213, 224, 255)",
  accent: "rgb(35, 72, 212)",
  glow: "rgb(107, 138, 255)",
  core: "rgb(213, 224, 255)",
};

// Each scene defines a different topology of nodes and connections.
// The CORE node (index 0) represents ARS Intelligence — the AI brain.
// Surrounding nodes represent physical sensors (cameras, NVRs).
function topology(scene: SceneId): { nodes: Node[]; edges: Edge[] } {
  const core: Node = { x: 0.5, y: 0.5, radius: 14, pulsePhase: 0, isCore: true };

  switch (scene) {
    case "plataforma": {
      // Wide network: many nodes converge to core
      const ring = (count: number, radius: number, yOffset = 0): Node[] =>
        Array.from({ length: count }).map((_, i) => {
          const a = (i / count) * Math.PI * 2 - Math.PI / 2;
          return {
            x: 0.5 + Math.cos(a) * radius,
            y: 0.5 + Math.sin(a) * radius + yOffset,
            radius: 4,
            pulsePhase: i * 0.7,
          };
        });
      const nodes = [core, ...ring(10, 0.34), ...ring(6, 0.22)];
      const edges: Edge[] = nodes.slice(1).map((_, i) => ({ from: 0, to: i + 1 }));
      // Add cross-links between outer ring
      for (let i = 1; i <= 10; i++) {
        const next = i === 10 ? 1 : i + 1;
        edges.push({ from: i, to: next });
      }
      return { nodes, edges };
    }

    case "monitoreo": {
      // Grid of sensors flowing into core
      const nodes: Node[] = [core];
      const cols = 6;
      const rows = 3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            x: 0.1 + (c / (cols - 1)) * 0.8,
            y: 0.15 + (r / (rows - 1)) * 0.18,
            radius: 3.5,
            pulsePhase: (r * cols + c) * 0.4,
          });
        }
      }
      const edges: Edge[] = nodes.slice(1).map((_, i) => ({ from: 0, to: i + 1 }));
      return { nodes, edges };
    }

    case "inteligencia": {
      // Core surrounded by orbital "thinking" nodes
      const nodes: Node[] = [core];
      const orbits = [
        { count: 6, radius: 0.18 },
        { count: 9, radius: 0.3 },
        { count: 12, radius: 0.4 },
      ];
      orbits.forEach((o, oi) => {
        for (let i = 0; i < o.count; i++) {
          const a = (i / o.count) * Math.PI * 2 + oi * 0.3;
          nodes.push({
            x: 0.5 + Math.cos(a) * o.radius * 0.9,
            y: 0.5 + Math.sin(a) * o.radius * 0.55,
            radius: 3,
            pulsePhase: i * 0.5 + oi,
          });
        }
      });
      const edges: Edge[] = nodes.slice(1).map((_, i) => ({ from: 0, to: i + 1 }));
      return { nodes, edges };
    }

    case "reconocimiento": {
      // Two clusters: faces (left) + plates (right) → core
      const nodes: Node[] = [core];
      // left face cluster
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        nodes.push({
          x: 0.22 + Math.cos(a) * 0.08,
          y: 0.5 + Math.sin(a) * 0.18,
          radius: 3,
          pulsePhase: i * 0.5,
        });
      }
      // right plate cluster
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        nodes.push({
          x: 0.78 + Math.cos(a) * 0.08,
          y: 0.5 + Math.sin(a) * 0.18,
          radius: 3,
          pulsePhase: i * 0.5 + 1,
        });
      }
      const edges: Edge[] = nodes.slice(1).map((_, i) => ({ from: 0, to: i + 1 }));
      return { nodes, edges };
    }

    case "seguridad": {
      // Perimeter ring with core inside
      const nodes: Node[] = [core];
      const count = 18;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        nodes.push({
          x: 0.5 + Math.cos(a) * 0.42,
          y: 0.5 + Math.sin(a) * 0.32,
          radius: 3.5,
          pulsePhase: i * 0.35,
        });
      }
      const edges: Edge[] = [];
      for (let i = 1; i <= count; i++) {
        const next = i === count ? 1 : i + 1;
        edges.push({ from: i, to: next });
        if (i % 3 === 0) edges.push({ from: 0, to: i });
      }
      return { nodes, edges };
    }

    case "decisiones": {
      // Core radiating alerts outward
      const nodes: Node[] = [core];
      const count = 14;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 - Math.PI / 2;
        const r = 0.28 + (i % 3) * 0.06;
        nodes.push({
          x: 0.5 + Math.cos(a) * r,
          y: 0.5 + Math.sin(a) * r * 0.7,
          radius: 4,
          pulsePhase: i * 0.45,
        });
      }
      const edges: Edge[] = nodes.slice(1).map((_, i) => ({ from: 0, to: i + 1 }));
      return { nodes, edges };
    }
  }
}

export function CinematicCanvas({ scene, intensity = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef<{
    nodes: Node[];
    edges: Edge[];
    particles: Particle[];
    width: number;
    height: number;
    dpr: number;
    intensity: number;
    targetIntensity: number;
  } | null>(null);

  // Update topology when scene changes
  useEffect(() => {
    const { nodes, edges } = topology(scene);
    const particles: Particle[] = [];
    // Seed particles per edge
    for (let e = 0; e < edges.length; e++) {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        particles.push({
          edge: e,
          t: Math.random(),
          speed: 0.0015 + Math.random() * 0.002,
          alpha: 0.4 + Math.random() * 0.6,
        });
      }
    }
    if (stateRef.current) {
      stateRef.current.nodes = nodes;
      stateRef.current.edges = edges;
      stateRef.current.particles = particles;
    } else {
      stateRef.current = {
        nodes,
        edges,
        particles,
        width: 0,
        height: 0,
        dpr: 1,
        intensity: 0,
        targetIntensity: intensity,
      };
    }
  }, [scene, intensity]);

  useEffect(() => {
    if (stateRef.current) stateRef.current.targetIntensity = intensity;
  }, [intensity]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      if (stateRef.current) {
        stateRef.current.width = rect.width;
        stateRef.current.height = rect.height;
        stateRef.current.dpr = dpr;
      }
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    const startTime = performance.now();

    const tick = (now: number) => {
      const state = stateRef.current;
      if (!state || !ctx) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const { width, height, nodes, edges, particles } = state;
      const elapsed = (now - startTime) / 1000;

      // Smooth intensity transition
      state.intensity += (state.targetIntensity - state.intensity) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const globalAlpha = state.intensity;
      if (globalAlpha < 0.02) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Convert normalized → screen coords
      const sx = (n: Node) => n.x * width;
      const sy = (n: Node) => n.y * height;

      // Draw edges (curved Bezier lines)
      for (const edge of edges) {
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        if (!a || !b) continue;
        const ax = sx(a), ay = sy(a);
        const bx = sx(b), by = sy(b);
        const cx = (ax + bx) / 2;
        const cy = (ay + by) / 2 - 60 - Math.sin(elapsed * 0.5 + edge.from) * 14;

        // base line
        ctx.strokeStyle = `rgba(213, 224, 255, ${0.06 * globalAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(cx, cy, bx, by);
        ctx.stroke();

        // glow line
        ctx.strokeStyle = `rgba(35, 72, 212, ${0.18 * globalAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(cx, cy, bx, by);
        ctx.stroke();
      }

      // Update + draw particles travelling along edges
      ctx.shadowBlur = 12;
      ctx.shadowColor = COLORS.glow;
      for (const p of particles) {
        const edge = edges[p.edge];
        if (!edge) continue;
        const a = nodes[edge.from];
        const b = nodes[edge.to];
        if (!a || !b) continue;

        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const ax = sx(a), ay = sy(a);
        const bx = sx(b), by = sy(b);
        const cx = (ax + bx) / 2;
        const cy = (ay + by) / 2 - 60 - Math.sin(elapsed * 0.5 + edge.from) * 14;

        const t = p.t;
        const x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
        const y = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by;

        ctx.fillStyle = `rgba(107, 138, 255, ${p.alpha * globalAlpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Draw nodes
      for (const node of nodes) {
        const x = sx(node), y = sy(node);
        const pulse = 0.5 + Math.sin(elapsed * 1.4 + node.pulsePhase) * 0.5;

        if (node.isCore) {
          // Core glow rings
          for (let r = 1; r <= 3; r++) {
            const radius = node.radius * (1 + r * 0.6) + pulse * 6;
            ctx.fillStyle = `rgba(35, 72, 212, ${(0.18 - r * 0.05) * globalAlpha})`;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 24;
          ctx.shadowColor = COLORS.core;
          ctx.fillStyle = `rgba(213, 224, 255, ${0.95 * globalAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y, node.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Sensor halo
          ctx.fillStyle = `rgba(35, 72, 212, ${0.25 * pulse * globalAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y, node.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 8;
          ctx.shadowColor = COLORS.glow;
          ctx.fillStyle = `rgba(213, 224, 255, ${(0.6 + pulse * 0.4) * globalAlpha})`;
          ctx.beginPath();
          ctx.arc(x, y, node.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 size-full"
    />
  );
}
