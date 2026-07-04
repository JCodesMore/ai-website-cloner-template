import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import * as THREE from "three";
import { useSketchMaterial } from "./useSketchMaterial";

describe("useSketchMaterial", () => {
  it("returns a MeshToonMaterial with the given color", () => {
    const { result } = renderHook(() => useSketchMaterial("#f0f0f0"));
    expect(result.current).toBeInstanceOf(THREE.MeshToonMaterial);
    expect(result.current.color.getHexString()).toBe("f0f0f0");
  });

  it("returns a stable material reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useSketchMaterial("#f0f0f0"));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("disposes the material and its gradient map on unmount", () => {
    const { result, unmount } = renderHook(() => useSketchMaterial("#f0f0f0"));
    const material = result.current;
    const gradientMap = material.gradientMap;
    const materialDisposeSpy = vi.spyOn(material, "dispose");
    const textureDisposeSpy = gradientMap ? vi.spyOn(gradientMap, "dispose") : null;
    unmount();
    expect(materialDisposeSpy).toHaveBeenCalledOnce();
    expect(textureDisposeSpy).toHaveBeenCalledOnce();
  });
});
