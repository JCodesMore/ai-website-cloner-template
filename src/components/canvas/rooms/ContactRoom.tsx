"use client";

import { Text } from "@react-three/drei";
import { content } from "@/data/content";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";
import { CAVEAT_FONT_URL } from "@/lib/fonts";

const PAPER_FONT = CAVEAT_FONT_URL;
const PAPER_TEXT_COLOR = "#222222";
const PAPER_TEXT_MAX_WIDTH = 1.2;
// The paper mesh is rotated PI around Y, so its visible face points toward
// -Z. Text must share that rotation and sit at a small negative Z offset
// (relative to the paper's own local space) to render in front of the
// flipped face rather than behind it.
const PAPER_TEXT_ROTATION: [number, number, number] = [0, Math.PI, 0];
const PAPER_TEXT_Z = -0.01;

export function ContactRoom() {
  const dockMaterial = useSketchMaterial("#e8e0d0");
  const paperMaterial = useSketchMaterial("#ffffff");

  return (
    <>
      <mesh material={dockMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[3, 8]} />
      </mesh>
      <mesh material={paperMaterial} position={[0, 0.2, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.4, 1.8]} />
      </mesh>
      <Text
        font={PAPER_FONT}
        fontSize={0.12}
        color={PAPER_TEXT_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={PAPER_TEXT_MAX_WIDTH}
        textAlign="center"
        position={[0, 0.5, PAPER_TEXT_Z]}
        rotation={PAPER_TEXT_ROTATION}
      >
        {content.profile.email}
      </Text>
      <Text
        font={PAPER_FONT}
        fontSize={0.12}
        color={PAPER_TEXT_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={PAPER_TEXT_MAX_WIDTH}
        textAlign="center"
        position={[0, 0.1, PAPER_TEXT_Z]}
        rotation={PAPER_TEXT_ROTATION}
      >
        {content.profile.whatsapp}
      </Text>
    </>
  );
}
