/**
 * Seed PostgreSQL database from /data/*.json files.
 * Usage: npx tsx scripts/seed-db.ts
 */
import "dotenv/config";
import { db, schema } from "../src/lib/db";
import {
  fastProducts, companyProducts, personProducts, pledgeProducts,
  institutions, comments,
  industryArticles, discussionArticles, opinionArticles, faqArticles,
  articleDetails, productDetails, institutionDetails,
} from "../src/lib/data";

async function seed() {
  console.log("[seed] Starting database seed...");

  // ── Products ──
  const allProducts = [
    ...fastProducts.map(p => ({ ...p, category: "fast" })),
    ...companyProducts.map(p => ({ ...p, category: "company" })),
    ...personProducts.map(p => ({ ...p, category: "person" })),
    ...pledgeProducts.map(p => ({ ...p, category: "pledge" })),
  ];
  console.log(`[seed] Inserting ${allProducts.length} products...`);
  for (const p of allProducts) {
    try {
      await db.insert(schema.products).values({
        id: p.id,
        category: (p as any).category || "fast",
        name: p.name,
        image: p.image || "",
        institution: p.institution || "",
        maxAmount: p.maxAmount || "",
        term: p.term || "",
        rate: p.rate || "",
        repayment: p.repayment || "",
        promo: (p as any).promo || null as any,
      } as any).onConflictDoNothing();
    } catch (e: any) {
      console.error(`  [seed] Product ${p.id} failed:`, e.message);
    }
  }

  // ── Institutions ──
  console.log(`[seed] Inserting ${institutions.length} institutions...`);
  for (const inst of institutions) {
    try {
      await db.insert(schema.institutions).values({
        id: inst.id,
        name: inst.name,
        fullName: inst.fullName || "",
        logo: inst.logo || "",
        products: inst.products || [],
      } as any).onConflictDoNothing();
    } catch (e: any) {
      console.error(`  [seed] Institution ${inst.id} failed:`, e.message);
    }
  }

  // ── Comments ──
  console.log(`[seed] Inserting ${comments.length} comments...`);
  for (const c of comments) {
    try {
      await db.insert(schema.comments).values({
        id: c.id,
        author: c.author,
        content: c.content,
        productName: c.productName || "",
        productHref: c.productHref || "",
        images: c.images || [],
        date: c.date || "",
        status: "approved",
      } as any).onConflictDoNothing();
    } catch (e: any) {
      console.error(`  [seed] Comment ${c.id} failed:`, e.message);
    }
  }

  // ── Articles ──
  const allArticles = [
    ...industryArticles.map(a => ({ ...a, categoryId: 91 })),
    ...discussionArticles.map(a => ({ ...a, categoryId: 14 })),
    ...opinionArticles.map(a => ({ ...a, categoryId: 80 })),
    ...faqArticles.map(a => ({ ...a, categoryId: 1 })),
  ];
  console.log(`[seed] Inserting ${allArticles.length} articles...`);
  for (const a of allArticles) {
    try {
      const detail = articleDetails.find(d => d.id === a.id);
      await db.insert(schema.articles).values({
        id: a.id,
        title: a.title,
        body: detail?.body || a.description || "",
        date: a.date || "",
        viewCount: detail?.viewCount || 0,
        categoryId: a.categoryId || 0,
        image: a.image || "",
        description: a.description || "",
      } as any).onConflictDoNothing();
    } catch (e: any) {
      console.error(`  [seed] Article ${a.id} failed:`, e.message);
    }
  }

  console.log("[seed] Done.");
  process.exit(0);
}

seed().catch((e) => {
  console.error("[seed] Fatal:", e);
  process.exit(1);
});
