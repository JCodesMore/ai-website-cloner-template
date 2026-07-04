import { describe, it, expect } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import { ContactRoom } from "./ContactRoom";

describe("ContactRoom", () => {
  it("renders a dock plane and a message paper without throwing", async () => {
    const renderer = await ReactThreeTestRenderer.create(<ContactRoom />);
    const meshes = renderer.scene.children.filter((c) => c.type === "Mesh");
    expect(meshes.length).toBeGreaterThanOrEqual(2);
  });
});
