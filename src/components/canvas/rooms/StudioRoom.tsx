"use client";

import { Text } from "@react-three/drei";
import { content } from "@/data/content";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";
import { CAVEAT_FONT_URL } from "@/lib/fonts";

const MONITORS_PER_ROW = 3;
const CELL_SIZE = 1.8;
// The room camera sits at Z=-6 and looks toward +Z (see Experience.tsx's
// 180°-Y-rotated persistent camera + ROOM_CAMERA_Z), so the monitor face
// visible to the camera is the -Z side, not +Z. Text sits just in front of
// that visible face, at a small negative Z offset.
const MONITOR_TEXT_Z = -0.08;

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
            <Text
              font={CAVEAT_FONT_URL}
              position={[0, 0, MONITOR_TEXT_Z]}
              rotation={[0, Math.PI, 0]}
              fontSize={0.18}
              maxWidth={1.2}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              color="#222222"
            >
              {tool.name}
            </Text>
          </group>
        );
      })}
    </>
  );
}
