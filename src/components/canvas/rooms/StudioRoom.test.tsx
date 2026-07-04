import { describe, it, expect } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import { StudioRoom } from "./StudioRoom";
import { content } from "@/data/content";

describe("StudioRoom", () => {
  it("renders one monitor group per AI tool", async () => {
    const renderer = await ReactThreeTestRenderer.create(<StudioRoom />);
    const groups = renderer.scene.children.filter((c) => c.type === "Group");
    expect(groups.length).toBeGreaterThanOrEqual(content.aiTools.length);
  });
});
