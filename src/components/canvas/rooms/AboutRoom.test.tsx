import { describe, it, expect } from "vitest";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import { AboutRoom } from "./AboutRoom";
import { content } from "@/data/content";

describe("AboutRoom", () => {
  it("renders one sphere per skill plus one self sphere", async () => {
    const renderer = await ReactThreeTestRenderer.create(<AboutRoom />);
    const meshes = renderer.scene.children.filter((c) => c.type === "Mesh");
    expect(meshes.length).toBe(content.coreCompetencies.length + content.softSkills.length + 1);
  });
});
