"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { getRoomCameraPosition } from "@/lib/corridor-math";

/**
 * Repositions the shared Canvas camera to a fixed room-viewing pose whenever
 * `isActive` becomes true. The camera is a single persistent object owned by
 * the top-level <Canvas> (see Experience.tsx) — only `useInfiniteCamera`
 * (corridor) otherwise moves it, and it never resets on its own when leaving
 * the corridor for a room. Without this, the camera stays wherever the user
 * last scrolled it in the corridor, leaving room content (which sits near
 * world origin) out of view.
 */
export function useRoomCamera(isActive: boolean): void {
  const { camera } = useThree();

  useEffect(() => {
    if (!isActive) return;
    const [x, y, z] = getRoomCameraPosition();
    camera.position.set(x, y, z);
  }, [isActive, camera]);
}
