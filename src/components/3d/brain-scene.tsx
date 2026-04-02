"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrainModel } from "./brain-model";

gsap.registerPlugin(ScrollTrigger);

interface BrainSceneProps {
  scrollTrigger?: string | HTMLElement;
}

export function BrainScene({ scrollTrigger }: BrainSceneProps) {
  const scrollProgress = useRef({ value: 0 });

  useEffect(() => {
    if (!scrollTrigger) return;

    const tween = gsap.to(scrollProgress.current, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: scrollTrigger,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [scrollTrigger]);

  return (
    <Canvas
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      <ambientLight intensity={0.2} />
      <BrainModel scrollProgress={scrollProgress} />
    </Canvas>
  );
}
