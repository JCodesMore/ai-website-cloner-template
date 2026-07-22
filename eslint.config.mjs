import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent worktrees carry their own .next build output; don't lint generated code.
    ".claude/worktrees/**",
    // Vendored minified icon bundle; single-line source blows the parser's stack.
    "public/js/lucide-local.js",
  ]),
]);

export default eslintConfig;
