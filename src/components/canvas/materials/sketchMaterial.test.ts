import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { createSketchMaterial, createOutlineMaterial } from "./sketchMaterial";

describe("createSketchMaterial", () => {
  it("returns a MeshToonMaterial with a 3-step gradient map for a cel-shaded sketch look", () => {
    const material = createSketchMaterial("#f0f0f0");
    expect(material).toBeInstanceOf(THREE.MeshToonMaterial);
    expect(material.gradientMap).toBeInstanceOf(THREE.DataTexture);
    expect(material.color.getHexString()).toBe("f0f0f0");
  });
});

describe("createOutlineMaterial", () => {
  it("returns a back-side basic material for the inverted-hull outline technique", () => {
    const material = createOutlineMaterial("#333333", 0.03);
    expect(material).toBeInstanceOf(THREE.MeshBasicMaterial);
    expect(material.side).toBe(THREE.BackSide);
    expect(material.color.getHexString()).toBe("333333");
  });

  it("defaults outline thickness to 0.02 when not provided", () => {
    const material = createOutlineMaterial("#333333");
    expect(material.userData.outlineThickness).toBe(0.02);
  });
});
