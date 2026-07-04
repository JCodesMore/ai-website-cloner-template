import { describe, it, expect } from "vitest";
import { getDoorPositions, getCameraZ, getActiveDoorIndex, getRoomCameraPosition, ROOM_CAMERA_Z } from "./corridor-math";

describe("getDoorPositions", () => {
  it("evenly spaces doors starting after the entrance offset", () => {
    const positions = getDoorPositions(4, 10, 5);
    expect(positions).toEqual([5, 15, 25, 35]);
  });

  it("returns an empty array for zero doors", () => {
    expect(getDoorPositions(0, 10, 5)).toEqual([]);
  });
});

describe("getCameraZ", () => {
  it("maps scroll progress 0 to the start offset", () => {
    expect(getCameraZ(0, 100, -2)).toBe(-2);
  });

  it("maps scroll progress 1 to the full corridor length plus offset", () => {
    expect(getCameraZ(1, 100, -2)).toBe(98);
  });

  it("maps scroll progress 0.5 to the midpoint", () => {
    expect(getCameraZ(0.5, 100, -2)).toBe(48);
  });
});

describe("getActiveDoorIndex", () => {
  const doors = [5, 15, 25, 35];

  it("returns the index of the door within threshold of the camera", () => {
    expect(getActiveDoorIndex(15.5, doors, 2)).toBe(1);
  });

  it("returns null when no door is within threshold", () => {
    expect(getActiveDoorIndex(10, doors, 2)).toBeNull();
  });

  it("returns the closest door when two are equidistant-adjacent but only one is in range", () => {
    expect(getActiveDoorIndex(24, doors, 2)).toBe(2);
  });
});

describe("getRoomCameraPosition", () => {
  it("returns a fixed pose centered on the x/y axes, pulled back along z", () => {
    expect(getRoomCameraPosition()).toEqual([0, 0, ROOM_CAMERA_Z]);
  });

  it("returns a negative z so the camera sits before world-origin room content", () => {
    const [, , z] = getRoomCameraPosition();
    expect(z).toBeLessThan(0);
  });
});
