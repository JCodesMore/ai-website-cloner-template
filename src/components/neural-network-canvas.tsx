"use client";

import { useEffect, useRef } from "react";

interface NeuralNetworkCanvasProps {
  nodeCount?: number;
  maxConnections?: number;
  pulseCount?: number;
  opacity?: number;
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface Connection {
  a: number;
  b: number;
  distance: number;
}

interface Pulse {
  connectionIdx: number;
  t: number;
  speed: number;
  direction: 1 | -1;
}

const TEAL = "#00d4ff";
const GOLD = "#c8953e";
const CONNECTION_DISTANCE = 180;

export function NeuralNetworkCanvas({
  nodeCount = 120,
  maxConnections = 300,
  pulseCount = 30,
  opacity = 0.35,
  className = "",
}: NeuralNetworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const intensityRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    function resize() {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener("resize", resize);

    // Generate nodes
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 1.5 + Math.random() * 2,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Pre-calculate connections
    let connections: Connection[] = [];

    function updateConnections() {
      connections = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            connections.push({ a: i, b: j, distance: dist });
          }
          if (connections.length >= maxConnections) return;
        }
      }
    }

    updateConnections();

    // Generate pulses
    const pulses: Pulse[] = Array.from({ length: pulseCount }, () => ({
      connectionIdx: Math.floor(Math.random() * Math.max(connections.length, 1)),
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.008,
      direction: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
    }));

    let frame = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const intensity = intensityRef.current;
      frame++;

      // Update nodes (slow drift)
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.02;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      }

      // Recalculate connections periodically
      if (frame % 60 === 0) updateConnections();

      // Draw axons (connections)
      for (const conn of connections) {
        const nodeA = nodes[conn.a];
        const nodeB = nodes[conn.b];
        const alpha = (1 - conn.distance / CONNECTION_DISTANCE) * 0.12 * intensity;

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);
        ctx.strokeStyle = `rgba(200, 149, 62, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw pulses (synaptic impulses traveling along axons)
      for (const pulse of pulses) {
        if (pulse.connectionIdx >= connections.length) {
          pulse.connectionIdx = Math.floor(Math.random() * connections.length);
        }

        const conn = connections[pulse.connectionIdx];
        if (!conn) continue;

        const nodeA = nodes[conn.a];
        const nodeB = nodes[conn.b];

        // Advance pulse
        pulse.t += pulse.speed * pulse.direction;

        // Reset pulse when it reaches the end
        if (pulse.t > 1 || pulse.t < 0) {
          pulse.t = pulse.direction === 1 ? 0 : 1;
          pulse.connectionIdx = Math.floor(Math.random() * connections.length);
          pulse.speed = 0.003 + Math.random() * 0.008;
        }

        // Draw pulse with trail
        for (let trail = 0; trail < 5; trail++) {
          const trailT = pulse.t - trail * 0.04 * pulse.direction;
          if (trailT < 0 || trailT > 1) continue;

          const px = nodeA.x + (nodeB.x - nodeA.x) * trailT;
          const py = nodeA.y + (nodeB.y - nodeA.y) * trailT;
          const trailAlpha = (1 - trail / 5) * 0.9 * intensity;
          const trailSize = (1 - trail / 5) * 3;

          ctx.beginPath();
          ctx.arc(px, py, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 212, 255, ${trailAlpha})`;
          ctx.shadowColor = TEAL;
          ctx.shadowBlur = 12 - trail * 2;
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // Draw nodes (neurons)
      for (const node of nodes) {
        const pulse = 0.5 + 0.5 * Math.sin(node.pulsePhase);
        const alpha = (0.3 + pulse * 0.5) * intensity;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 149, 62, ${alpha})`;
        ctx.shadowColor = GOLD;
        ctx.shadowBlur = 6 + pulse * 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [nodeCount, maxConnections, pulseCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
