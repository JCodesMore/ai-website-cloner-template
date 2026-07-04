import { describe, it, expect } from "vitest";
import { content } from "./content";

describe("portfolio content data", () => {
  it("has the correct profile identity", () => {
    expect(content.profile.name).toBe("Imam Hanafi");
    expect(content.profile.title).toBe("Tourism Marketing Communication Specialist");
    expect(content.profile.email).toBe("work.hanafi@gmail.com");
    expect(content.profile.whatsapp).toBe("+62 857-9985-2979");
  });

  it("has 4 stat cards matching the CV hero section", () => {
    expect(content.profile.stats).toHaveLength(4);
    expect(content.profile.stats.map((s) => s.value)).toEqual(["8+", "3M", "11", "9"]);
  });

  it("has 4 career entries in reverse-chronological order", () => {
    expect(content.career).toHaveLength(4);
    expect(content.career[0].org).toBe("Drini Park & Drini Park Resort");
    expect(content.career[3].org).toBe("DIY & Kab. Gunungkidul");
  });

  it("has 10 AI tools", () => {
    expect(content.aiTools).toHaveLength(10);
  });

  it("has 3 event series with the Table Top Guyub Sesarengan series holding 11 events", () => {
    expect(content.events).toHaveLength(3);
    const guyub = content.events.find((e) => e.series.startsWith("Table Top Guyub Sesarengan"));
    expect(guyub?.items).toHaveLength(11);
  });
});
