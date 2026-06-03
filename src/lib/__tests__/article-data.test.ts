import { describe, it, expect } from "vitest";
import {
  industryArticles, discussionArticles, opinionArticles, faqArticles,
} from "@/lib/data";

// Lazy load articleDetails since it's a JSON import
async function loadArticleDetails(): Promise<any[]> {
  const m = await import("@/data/articleDetails.json");
  return (m as any).default || m;
}

function sanitizeBody(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/^rich-text-content"\s+style="[^"]*"\s*>/g, "")
    .replace(/yinmaiquan-keyword/g, "ymq-keyword")
    .replace(/^[\s\n\r]+/, "")
    .trim();
}

describe("Article seed data completeness", () => {
  const allArticles = [
    ...industryArticles,
    ...discussionArticles,
    ...opinionArticles,
    ...faqArticles,
  ];

  it("every article has a non-empty description", () => {
    for (const a of allArticles) {
      expect(a.description, `article ${a.id} "${a.title}" has empty description`).toBeTruthy();
      expect((a.description || "").length, `article ${a.id} description too short`).toBeGreaterThan(10);
    }
  });

  it("every article has a title", () => {
    for (const a of allArticles) {
      expect(a.title, `article ${a.id} has no title`).toBeTruthy();
    }
  });

  it("every article has a valid date", () => {
    for (const a of allArticles) {
      expect(a.date, `article ${a.id} has no date`).toBeTruthy();
    }
  });

  it("no duplicate article IDs", () => {
    const ids = new Set<number>();
    const dupes: number[] = [];
    for (const a of allArticles) {
      if (ids.has(a.id)) dupes.push(a.id);
      ids.add(a.id);
    }
    expect(dupes, `Duplicate article IDs: ${dupes.join(", ")}`).toEqual([]);
  });

  it("all article IDs are unique across categories", () => {
    expect(idsFrom(industryArticles).size + idsFrom(discussionArticles).size
      + idsFrom(opinionArticles).size + idsFrom(faqArticles).size
    ).toBe(allArticles.length);
  });
});

describe("Article detail bodies", () => {
  it("articleDetails.json entries have sanitized bodies (no scraped artifacts)", async () => {
    const details = await loadArticleDetails();
    expect(details.length).toBeGreaterThan(0);

    for (const d of details) {
      expect(typeof d.body, `article ${d.id} body is missing`).toBe("string");
      const body = d.body || "";
      // Skip entries that are just stub placeholders (no real body scraped)
      if (body.length < 50) continue;
      // Must not contain scraped artifacts
      expect(body, `article ${d.id} has rich-text-content artifact`).not.toMatch(/^rich-text-content/);
      expect(body, `article ${d.id} has <style> block`).not.toMatch(/<style>/);
      expect(body, `article ${d.id} has yinmaiquan-keyword class`).not.toMatch(/yinmaiquan-keyword/);
      // Must have meaningful content
      expect(body.length, `article ${d.id} body too short (${body.length} chars)`).toBeGreaterThan(100);
    }
  });

  it("specific articles have full body content", async () => {
    const details = await loadArticleDetails();
    const detailMap = new Map<number, any>();
    details.forEach((d: any) => detailMap.set(Number(d.id), d));

    // Article 705 — known to be short (only description, no full body scraped)
    // After fix, it should have full body from scrape
    const d705 = detailMap.get(705);
    if (d705) {
      expect(d705.body.length, "article 705 body should be > 200 chars").toBeGreaterThan(200);
    }
  });

  it("known good articles have clean bodies", async () => {
    const details = await loadArticleDetails();
    const detailMap = new Map<number, any>();
    details.forEach((d: any) => detailMap.set(Number(d.id), d));

    const d1012 = detailMap.get(1012);
    expect(d1012, "article 1012 missing from details").toBeTruthy();
    expect(d1012.body.length).toBeGreaterThan(1000);
    expect(d1012.body).toMatch(/^<p>/);
  });
});

describe("Article body sanitizer", () => {
  it("strips rich-text-content artifact prefix", () => {
    const input = 'rich-text-content" style="color: #333; line-height: 1.8; font-size: 16px;">\n<p>Hello</p>';
    const result = sanitizeBody(input);
    expect(result).toBe("<p>Hello</p>");
  });

  it("strips <style> blocks", () => {
    const input = "<style>\n.rich-text-content { font-size: 16px; }\n</style>\n<p>Hello</p>";
    const result = sanitizeBody(input);
    expect(result).toBe("<p>Hello</p>");
  });

  it("replaces yinmaiquan-keyword with ymq-keyword", () => {
    const input = "<p>Check <a class='yinmaiquan-keyword'>this</a></p>";
    const result = sanitizeBody(input);
    expect(result).toBe("<p>Check <a class='ymq-keyword'>this</a></p>");
  });

  it("handles empty input", () => {
    expect(sanitizeBody("")).toBe("");
    expect(sanitizeBody("  \n  ")).toBe("");
  });
});

function idsFrom(arr: any[]): Set<number> {
  return new Set(arr.map((a: any) => a.id));
}
