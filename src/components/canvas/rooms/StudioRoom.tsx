"use client";

import { content } from "@/data/content";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";

const MONITORS_PER_ROW = 3;
const CELL_SIZE = 1.8;

export function StudioRoom() {
  const monitorMaterial = useSketchMaterial("#efefef");

  return (
    <>
      {content.aiTools.map((tool, index) => {
        const row = Math.floor(index / MONITORS_PER_ROW);
        const col = index % MONITORS_PER_ROW;
        return (
          <group
            key={tool.name}
            position={[
              (col - (MONITORS_PER_ROW - 1) / 2) * CELL_SIZE,
              -row * CELL_SIZE,
              0,
            ]}
          >
            <mesh material={monitorMaterial}>
              <boxGeometry args={[1.4, 1, 0.15]} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
