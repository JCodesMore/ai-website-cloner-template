export const CORRIDOR_LENGTH = 120;
export const START_Z = -2;

/**
 * Distance behind world-origin content the camera sits when viewing a room.
 * Room content clusters at z≈0 and the camera looks toward +Z, so a negative
 * z (this many units "before" the content) keeps it in view and framed.
 */
export const ROOM_CAMERA_Z = -6;

/**
 * Fixed camera position used whenever a room becomes active. Rooms place
 * their content near world origin, so a single pose works for all of them.
 */
export function getRoomCameraPosition(): [number, number, number] {
  return [0, 0, ROOM_CAMERA_Z];
}

/**
 * Evenly spaces `count` doors along the corridor Z axis, starting at `startOffset`.
 */
export function getDoorPositions(count: number, spacing: number, startOffset: number): number[] {
  return Array.from({ length: count }, (_, i) => startOffset + i * spacing);
}

/**
 * Maps normalized scroll progress (0..1) to a camera Z position along the corridor.
 */
export function getCameraZ(progress: number, corridorLength: number, startZ: number): number {
  return startZ + progress * corridorLength;
}

/**
 * Returns the index of the nearest door within `threshold` units of `cameraZ`, or null.
 */
export function getActiveDoorIndex(cameraZ: number, doorPositions: number[], threshold: number): number | null {
  let closestIndex: number | null = null;
  let closestDistance = Infinity;

  doorPositions.forEach((doorZ, index) => {
    const distance = Math.abs(doorZ - cameraZ);
    if (distance <= threshold && distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}
