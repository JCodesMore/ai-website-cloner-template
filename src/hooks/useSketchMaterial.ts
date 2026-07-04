"use client";

import { useEffect, useState } from "react";
import type * as THREE from "three";
import { createSketchMaterial } from "@/components/canvas/materials/sketchMaterial";

/**
 * Creates a sketch-style toon material ONCE (color is captured at first render
 * only — this hook does not react to later color changes). Callers that need
 * dynamic color should mutate `material.color.set(...)` themselves, the same
 * way Door.tsx does for its active/inactive state. Disposes the material and
 * its gradient map texture automatically on unmount.
 */
export function useSketchMaterial(color: THREE.ColorRepresentation): THREE.MeshToonMaterial {
  const [material] = useState(() => createSketchMaterial(color));

  useEffect(() => {
    return () => {
      material.gradientMap?.dispose();
      material.dispose();
    };
  }, [material]);

  return material;
}
