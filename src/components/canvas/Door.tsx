"use client";

import { useState, useMemo, useEffect } from "react";
import { createOutlineMaterial } from "./materials/sketchMaterial";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";

const DOOR_WIDTH = 1.2;
const DOOR_HEIGHT = 2.2;
const DOOR_DEPTH = 0.12;
const DOOR_OUTLINE_SCALE = 1.025;
const DOOR_HOVER_SCALE = 1.03;
const DOOR_COLOR_DEFAULT = "#f0f0f0";
const DOOR_COLOR_ACTIVE = "#dcdcdc";
const DOOR_OUTLINE_COLOR = "#333333";
const DOOR_OUTLINE_THICKNESS = 0.025;

interface DoorProps {
  position: [number, number, number];
  label: string;
  isActive: boolean;
  onEnter: () => void;
}

export function Door({ position, label, isActive, onEnter }: DoorProps) {
  const [hovered, setHovered] = useState(false);
  const frameMaterial = useSketchMaterial(DOOR_COLOR_DEFAULT);
  const outlineMaterial = useMemo(() => createOutlineMaterial(DOOR_OUTLINE_COLOR, DOOR_OUTLINE_THICKNESS), []);

  useEffect(() => {
    frameMaterial.color.set(isActive ? DOOR_COLOR_ACTIVE : DOOR_COLOR_DEFAULT);
  }, [frameMaterial, isActive]);

  useEffect(() => {
    return () => {
      outlineMaterial.dispose();
    };
  }, [outlineMaterial]);

  return (
    <group position={position}>
      <mesh material={outlineMaterial} scale={DOOR_OUTLINE_SCALE}>
        <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH]} />
      </mesh>
      <mesh
        material={frameMaterial}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onEnter}
        scale={hovered ? DOOR_HOVER_SCALE : 1}
      >
        <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, DOOR_DEPTH]} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <planeGeometry args={[1.4, 0.35]} />
        <meshBasicMaterial color={DOOR_OUTLINE_COLOR} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}
