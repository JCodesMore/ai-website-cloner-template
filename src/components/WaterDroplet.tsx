"use client";

import { motion } from "framer-motion";

/**
 * Animated water-droplet avatar — placeholder for the "water avatar" while
 * we wait for the source. Subtle ripple + shimmer to feel alive.
 *
 * Drop-in replacement: swap <Lizard /> for <WaterDroplet /> when ready.
 */
export function WaterDroplet({
  size = 48,
  animated = true,
  className,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Baja Swarm water avatar"
    >
      {/* Outer ripple ring (animated) */}
      {animated && (
        <motion.circle
          cx="48"
          cy="60"
          r="34"
          fill="none"
          stroke="#7ECBE6"
          strokeWidth="1"
          opacity="0.5"
          animate={{ r: [30, 40, 30], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Droplet shape — teardrop */}
      <motion.path
        d="M48 12 C 30 36, 22 50, 22 62 C 22 78, 34 88, 48 88 C 62 88, 74 78, 74 62 C 74 50, 66 36, 48 12 Z"
        fill="url(#waterGrad)"
        animate={animated ? { y: [0, -2, 0] } : undefined}
        transition={animated ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : undefined}
      />

      {/* Inner highlight — gives the water a glossy 3D feel */}
      <motion.ellipse
        cx="38"
        cy="42"
        rx="8"
        ry="14"
        fill="white"
        opacity="0.4"
        animate={animated ? { opacity: [0.4, 0.6, 0.4] } : undefined}
        transition={animated ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      />

      {/* Tiny sparkle */}
      {animated && (
        <motion.circle
          cx="56"
          cy="50"
          r="2"
          fill="white"
          animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      )}

      <defs>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7ECBE6" />
          <stop offset="55%" stopColor="#4AA0BE" />
          <stop offset="100%" stopColor="#2D7A99" />
        </linearGradient>
      </defs>
    </svg>
  );
}
