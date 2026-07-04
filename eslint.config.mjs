import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // react-hooks/immutability flags React Three Fiber's canonical useFrame
    // pattern of mutating Object3D properties (camera.position.z += ...) —
    // that mutation is the sanctioned R3F API, not React state, so the rule
    // doesn't apply to this directory.
    files: ["src/components/canvas/**/*.{ts,tsx}", "src/hooks/useInfiniteCamera.ts"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
