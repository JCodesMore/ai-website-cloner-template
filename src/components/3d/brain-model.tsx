"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

interface BrainModelProps {
  scrollProgress: React.RefObject<{ value: number }>;
}

export function BrainModel({ scrollProgress }: BrainModelProps) {
  const meshRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Slow auto-rotation
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += delta * 0.05;

    // Scroll-linked: increase distortion + scale down as user scrolls
    const progress = scrollProgress.current?.value ?? 0;
    meshRef.current.scale.setScalar(1 - progress * 0.3);

    // Inner core counter-rotation
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.3;
      innerRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group>
        {/* Outer brain — distorted sphere with wireframe-like look */}
        <Sphere ref={meshRef} args={[1.8, 64, 64]}>
          <MeshDistortMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.8}
            distort={0.45}
            speed={2}
            transparent
            opacity={0.7}
          />
        </Sphere>

        {/* Wireframe overlay — neural network look */}
        <Sphere args={[1.85, 32, 32]}>
          <meshBasicMaterial
            color="#00d4ff"
            wireframe
            transparent
            opacity={0.15}
          />
        </Sphere>

        {/* Inner core — gold energy */}
        <Sphere ref={innerRef} args={[0.8, 32, 32]}>
          <MeshDistortMaterial
            color="#c8953e"
            emissive="#c8953e"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.9}
            distort={0.3}
            speed={3}
            transparent
            opacity={0.5}
          />
        </Sphere>

        {/* Gold wireframe inner */}
        <Sphere args={[1.0, 24, 24]}>
          <meshBasicMaterial
            color="#c8953e"
            wireframe
            transparent
            opacity={0.08}
          />
        </Sphere>

        {/* Point light for teal glow */}
        <pointLight color="#00d4ff" intensity={2} distance={8} decay={2} />
        <pointLight
          color="#c8953e"
          intensity={1}
          distance={5}
          decay={2}
          position={[0, -1, 0]}
        />
      </group>
    </Float>
  );
}
