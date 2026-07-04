"use client";

import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { getCameraZ, getActiveDoorIndex, CORRIDOR_LENGTH, START_Z } from "@/lib/corridor-math";

const DOOR_THRESHOLD = 2.5;
const WHEEL_SENSITIVITY = 0.0004;
const CAMERA_LERP_FACTOR = 0.08;

export function useInfiniteCamera(doorPositions: number[], onActiveDoorChange: (index: number | null) => void) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  const activeDoorRef = useRef<number | null>(null);

  const handleWheel = useCallback((event: WheelEvent) => {
    const delta = event.deltaY * WHEEL_SENSITIVITY;
    progressRef.current = Math.min(1, Math.max(0, progressRef.current + delta));
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useFrame(() => {
    const targetZ = getCameraZ(progressRef.current, CORRIDOR_LENGTH, START_Z);
    camera.position.z += (targetZ - camera.position.z) * CAMERA_LERP_FACTOR;

    const active = getActiveDoorIndex(camera.position.z, doorPositions, DOOR_THRESHOLD);
    if (active !== activeDoorRef.current) {
      activeDoorRef.current = active;
      onActiveDoorChange(active);
    }
  });
}
