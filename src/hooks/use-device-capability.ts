"use client";

import { useState, useEffect } from "react";

export function useDeviceCapability() {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    // Check: not mobile/tablet + has decent CPU + WebGL2 support
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
      navigator.userAgent,
    );
    const hasEnoughCores = (navigator.hardwareConcurrency ?? 2) >= 4;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Test WebGL2 support
    let hasWebGL = false;
    try {
      const canvas = document.createElement("canvas");
      hasWebGL = !!canvas.getContext("webgl2");
    } catch {
      // no WebGL
    }

    setCanRender3D(!isMobile && hasEnoughCores && hasWebGL && !prefersReducedMotion);
  }, []);

  return { canRender3D };
}
