import { describe, it, expect } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import { Corridor } from "./Corridor";

describe("Corridor", () => {
  it("renders 4 doors without throwing", async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Corridor doorLabels={["Gallery", "Studio", "About", "Contact"]} onDoorSelect={() => {}} />,
    );
    const groups = renderer.scene.children.filter((c) => c.type === "Group");
    expect(groups.length).toBeGreaterThanOrEqual(4);
  });
});
