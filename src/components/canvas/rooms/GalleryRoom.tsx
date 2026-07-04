"use client";

import { content } from "@/data/content";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";

const CARD_SPACING = 3.5;

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
        </group>
      ))}
    </>
  );
}
