"use client";

import { useMemo, useState } from "react";
import { getDoorPositions, CORRIDOR_LENGTH, START_Z } from "@/lib/corridor-math";
import { useInfiniteCamera } from "@/hooks/useInfiniteCamera";
import { useSketchMaterial } from "@/hooks/useSketchMaterial";
import { Door } from "./Door";

const DOOR_SPACING = 10;
const DOOR_START_OFFSET = 5;
const CORRIDOR_CENTER_Z = START_Z + CORRIDOR_LENGTH / 2;

interface CorridorProps {
  doorLabels: string[];
  onDoorSelect: (index: number) => void;
}

export function Corridor({ doorLabels, onDoorSelect }: CorridorProps) {
  const [activeDoor, setActiveDoor] = useState<number | null>(null);
  const doorPositions = useMemo(
    () => getDoorPositions(doorLabels.length, DOOR_SPACING, DOOR_START_OFFSET),
    [doorLabels.length],
  );

  const floorMaterial = useSketchMaterial("#f5f5f5");
  const wallMaterial = useSketchMaterial("#eaeaea");

  useInfiniteCamera(doorPositions, setActiveDoor);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, CORRIDOR_CENTER_Z]} material={floorMaterial}>
        <planeGeometry args={[6, CORRIDOR_LENGTH]} />
      </mesh>
      <mesh position={[-3, 1, CORRIDOR_CENTER_Z]} rotation={[0, Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[CORRIDOR_LENGTH, 4]} />
      </mesh>
      <mesh position={[3, 1, CORRIDOR_CENTER_Z]} rotation={[0, -Math.PI / 2, 0]} material={wallMaterial}>
        <planeGeometry args={[CORRIDOR_LENGTH, 4]} />
      </mesh>
      {doorPositions.map((z, index) => (
        <Door
          key={doorLabels[index]}
          position={[index % 2 === 0 ? -2.9 : 2.9, 0, z]}
          label={doorLabels[index]}
          isActive={activeDoor === index}
          onEnter={() => onDoorSelect(index)}
        />
      ))}
    </>
  );
}
