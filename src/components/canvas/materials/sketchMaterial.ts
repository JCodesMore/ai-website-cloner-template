import * as THREE from "three";

/**
 * Builds a 3-step gradient map so MeshToonMaterial renders flat pencil-shaded
 * bands instead of smooth PBR shading — the core of the "sketch" look.
 */
function buildToonGradientMap(): THREE.DataTexture {
  const colors = new Uint8Array([64, 160, 255]);
  const texture = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
  texture.needsUpdate = true;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
}

export function createSketchMaterial(color: THREE.ColorRepresentation): THREE.MeshToonMaterial {
  return new THREE.MeshToonMaterial({
    color,
    gradientMap: buildToonGradientMap(),
  });
}

/**
 * Inverted-hull outline: render a slightly-scaled back-face-only shell behind
 * the toon mesh to fake a hand-drawn ink outline without a screen-space shader.
 */
export function createOutlineMaterial(
  color: THREE.ColorRepresentation,
  outlineThickness = 0.02,
): THREE.MeshBasicMaterial {
  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.BackSide,
  });
  material.userData.outlineThickness = outlineThickness;
  return material;
}
