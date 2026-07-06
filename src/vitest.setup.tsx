import { vi } from "vitest";
import type { ReactNode } from "react";

// drei's <Text> (backed by troika-three-text) fetches its font file over the
// network to build glyph geometry. Inside @react-three/test-renderer's
// headless environment there is no dev server to resolve that fetch against,
// which aborts reconciliation for the entire subtree containing <Text> — not
// just the Text node — causing unrelated Mesh/Group count assertions in
// sibling components to see 0 children. Replace Text with a synchronous
// pass-through stand-in so structural assertions aren't collateral damage
// from this unrelated async dependency. Re-export everything else from the
// real module untouched.
vi.mock("@react-three/drei", async () => {
  const actual = await vi.importActual<typeof import("@react-three/drei")>("@react-three/drei");
  return {
    ...actual,
    Text: ({ children, ...props }: { children?: ReactNode }) => <group {...props}>{children}</group>,
  };
});
