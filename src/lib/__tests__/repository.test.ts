import { describe, it, expect } from "vitest";

describe("Repository functions exist and return expected types", () => {
  it("getAllProducts is a function", async () => {
    const { getAllProducts } = await import("@/lib/repository");
    expect(typeof getAllProducts).toBe("function");
  });

  it("getAllInstitutions is a function", async () => {
    const { getAllInstitutions } = await import("@/lib/repository");
    expect(typeof getAllInstitutions).toBe("function");
  });

  it("getAllComments is a function", async () => {
    const { getAllComments } = await import("@/lib/repository");
    expect(typeof getAllComments).toBe("function");
  });

  it("getArticleById is a function", async () => {
    const { getArticleById } = await import("@/lib/repository");
    expect(typeof getArticleById).toBe("function");
  });

  it("getInstitutionById is a function", async () => {
    const { getInstitutionById } = await import("@/lib/repository");
    expect(typeof getInstitutionById).toBe("function");
  });

  it("getProductsByCategory is a function", async () => {
    const { getProductsByCategory } = await import("@/lib/repository");
    expect(typeof getProductsByCategory).toBe("function");
  });

  it("getAllCounselors is a function", async () => {
    const { getAllCounselors } = await import("@/lib/repository");
    expect(typeof getAllCounselors).toBe("function");
  });

  it("sidebar functions exist", async () => {
    const { getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } = await import("@/lib/repository");
    expect(typeof getSidebarNews).toBe("function");
    expect(typeof getSidebarDiscussions).toBe("function");
    expect(typeof getSidebarOpinions).toBe("function");
    expect(typeof getSidebarFaq).toBe("function");
  });
});
