"use client";

import { useSketchMaterial } from "@/hooks/useSketchMaterial";

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
    </>
  );
}
