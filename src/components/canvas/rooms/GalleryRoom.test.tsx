import { describe, it, expect } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import { GalleryRoom } from "./GalleryRoom";

describe("GalleryRoom", () => {
  it("renders one card group per career entry", async () => {
    const renderer = await ReactThreeTestRenderer.create(<GalleryRoom />);
    const groups = renderer.scene.children.filter((c) => c.type === "Group");
    expect(groups.length).toBeGreaterThanOrEqual(4);
  });
});
