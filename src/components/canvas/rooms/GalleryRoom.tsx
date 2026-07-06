"use client";

import { Text } from "@react-three/drei";
import { content } from "@/data/content";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";
import { CAVEAT_FONT_URL } from "@/lib/fonts";

const CARD_SPACING = 3.5;
const CARD_FONT = CAVEAT_FONT_URL;
const CARD_TEXT_COLOR = "#222222";
const CARD_TEXT_MAX_WIDTH = 2;
// The card mesh is rotated PI around Y so its visible face points toward +Z
// (the camera). Text must share that rotation and sit at a small negative Z
// offset so it renders in front of the (now-flipped) card face.
const CARD_TEXT_ROTATION: [number, number, number] = [0, Math.PI, 0];
const CARD_TEXT_Z = -0.01;

export function GalleryRoom() {
  const cardMaterial = useSketchMaterial("#fafafa");

  return (
    <>
      {content.career.map((entry, index) => (
        <group
          key={entry.org}
          position={[index * CARD_SPACING - ((content.career.length - 1) * CARD_SPACING) / 2, 0, 0]}
        >
          <mesh material={cardMaterial} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[2.4, 3]} />
          </mesh>
          <Text
            font={CARD_FONT}
            fontSize={0.22}
            color={CARD_TEXT_COLOR}
            anchorX="center"
            anchorY="middle"
            maxWidth={CARD_TEXT_MAX_WIDTH}
            textAlign="center"
            position={[0, 0.9, CARD_TEXT_Z]}
            rotation={CARD_TEXT_ROTATION}
          >
            {entry.role}
          </Text>
          <Text
            font={CARD_FONT}
            fontSize={0.16}
            color={CARD_TEXT_COLOR}
            anchorX="center"
            anchorY="middle"
            maxWidth={CARD_TEXT_MAX_WIDTH}
            textAlign="center"
            position={[0, 0.5, CARD_TEXT_Z]}
            rotation={CARD_TEXT_ROTATION}
          >
            {entry.org}
          </Text>
        </group>
      ))}
    </>
  );
}
