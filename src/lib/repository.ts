import { db, schema } from "@/lib/db";
import { eq, inArray, desc } from "drizzle-orm";
import type { Product, Institution, Comment, NewsItem, ArticleDetail, ProductDetail, InstitutionDetail, Counselor } from "@/types";

// JSON seed imports — used as fallback when DB tables are empty
import {
  fastProducts, companyProducts, personProducts, pledgeProducts,
  institutions, comments,
  industryArticles, discussionArticles, opinionArticles, faqArticles,
  articleDetails, productDetails, institutionDetails, counselors,
} from "@/lib/data";

// Track which tables have been seeded in this process
const seeded = new Set<string>();

async function seedIfEmpty<T>(
  table: any,
  key: string,
  rows: T[],
): Promise<void> {
  if (seeded.has(key)) return;
  try {
    const existing = await db.select({ n: table.id }).from(table).limit(1);
    if (existing.length === 0 && rows.length > 0) {
      // Batch insert in chunks of 50
      for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);
        await db.insert(table).values(batch as any).onConflictDoNothing();
      }
      console.log(`[repository] Seeded ${rows.length} rows into ${key}`);
    }
  } catch {
    // Table may not exist or DB not reachable — fall through to JSON
  }
  seeded.add(key);
}

// ── Products ──

export async function getAllProducts(): Promise<Product[]> {
  await seedIfEmpty(schema.products, "products", [
    ...fastProducts.map(p => ({ ...p, category: "fast" })),
    ...companyProducts.map(p => ({ ...p, category: "company" })),
    ...personProducts.map(p => ({ ...p, category: "person" })),
    ...pledgeProducts.map(p => ({ ...p, category: "pledge" })),
  ]);
  try {
    const rows = await db.select().from(schema.products).orderBy(desc(schema.products.sortOrder));
    if (rows.length > 0) return rows.map(mapProduct);
  } catch { /* fall through */ }
  const seen = new Set<number>();
  return [...fastProducts, ...companyProducts, ...personProducts, ...pledgeProducts].filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  // Use the JSON category assignment for fallback, or DB category column
  if (category === "fast") return fastProducts;
  if (category === "company") return companyProducts;
  if (category === "person") return personProducts;
  if (category === "pledge") return pledgeProducts;
  return all;
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  await seedIfEmpty(schema.products, "products", []);
  try {
    const rows = await db.select().from(schema.products).where(eq(schema.products.id, parseInt(id, 10)));
    if (rows.length > 0) return mapProductDetail(rows[0]);
  } catch { /* fall through */ }
  return productDetails.find(p => p.id === parseInt(id, 10)) || null;
}

export async function getAllProductDetails(): Promise<ProductDetail[]> {
  await seedIfEmpty(schema.products, "products", []);
  try {
    const rows = await db.select().from(schema.products);
    if (rows.length > 0) return rows.map(mapProductDetail);
  } catch { /* fall through */ }
  return productDetails;
}

// ── Institutions ──

export async function getAllInstitutions(): Promise<Institution[]> {
  await seedIfEmpty(schema.institutions, "institutions", institutions);
  try {
    const rows = await db.select().from(schema.institutions);
    if (rows.length > 0) return rows.map(mapInstitution);
  } catch { /* fall through */ }
  return institutions;
}

export async function getInstitutionById(id: string): Promise<InstitutionDetail | null> {
  await seedIfEmpty(schema.institutions, "institutions", []);
  try {
    const rows = await db.select().from(schema.institutions).where(eq(schema.institutions.id, parseInt(id, 10)));
    if (rows.length > 0) return mapInstitutionDetail(rows[0]);
  } catch { /* fall through */ }
  return institutionDetails.find(i => i.id === id) || null;
}

// ── Comments ──

export async function getAllComments(): Promise<Comment[]> {
  await seedIfEmpty(schema.comments, "comments", comments);
  try {
    const rows = await db.select().from(schema.comments).where(eq(schema.comments.status, "approved"));
    if (rows.length > 0) return rows.map(mapComment);
  } catch { /* fall through */ }
  return comments;
}

// ── Articles ──

function allArticles(): NewsItem[] {
  return [...industryArticles, ...discussionArticles, ...opinionArticles, ...faqArticles];
}

const categoryArticleMap: Record<number, NewsItem[]> = {
  91: industryArticles,
  14: discussionArticles,
  80: opinionArticles,
  1: faqArticles,
};

export async function getArticlesByCategory(categoryId: number): Promise<NewsItem[]> {
  await seedIfEmpty(schema.articles, "articles", allArticles().map(a => ({
    id: a.id,
    title: a.title,
    body: a.description || "",
    date: a.date || "",
    viewCount: 0,
    categoryId: a.categoryId || categoryId,
    image: a.image || "",
    description: a.description || "",
  })));
  try {
    const rows = await db.select().from(schema.articles).where(eq(schema.articles.categoryId, categoryId));
    if (rows.length > 0) return rows.map(mapArticle);
  } catch { /* fall through */ }
  return categoryArticleMap[categoryId] || [];
}

export async function getArticleById(id: number): Promise<ArticleDetail | null> {
  await seedIfEmpty(schema.articles, "articles", []);
  try {
    const rows = await db.select().from(schema.articles).where(eq(schema.articles.id, id));
    if (rows.length > 0) return {
      id: rows[0].id,
      title: rows[0].title,
      date: rows[0].date || "",
      viewCount: rows[0].viewCount || 0,
      body: rows[0].body || "",
    };
  } catch { /* fall through */ }
  return articleDetails.find(a => a.id === id) || null;
}

// ── Sidebar ──

export async function getSidebarNews(): Promise<NewsItem[]> {
  return industryArticles.slice(0, 4);
}

export async function getSidebarDiscussions(): Promise<NewsItem[]> {
  return discussionArticles.slice(0, 4);
}

export async function getSidebarOpinions(): Promise<NewsItem[]> {
  return opinionArticles.slice(0, 4);
}

export async function getSidebarFaq(): Promise<NewsItem[]> {
  return faqArticles.slice(0, 4);
}

// ── Counselors ──

export async function getAllCounselors(): Promise<Counselor[]> {
  return counselors;
}

// ── Mappers: DB row → App type ──

function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    image: row.image || "",
    institution: row.institution || "",
    maxAmount: row.maxAmount || "",
    term: row.term || "",
    rate: row.rate || "",
    repayment: row.repayment || "",
    commentCount: 0,
    href: `/products/detail/${row.id}`,
  };
}

function mapProductDetail(row: any): ProductDetail {
  return {
    id: row.id,
    category: row.category || "fast",
    name: row.name,
    image: row.image || "",
    institution: row.institution || "",
    institutionFullName: row.institutionFullName || row.institution || "",
    institutionHref: row.institutionHref || `/institutions`,
    maxAmount: row.maxAmount || "",
    term: row.term || "",
    rate: row.rate || "",
    repayment: row.repayment || "",
    advantages: row.advantages || [],
    summary: row.summary || "",
    introHtml: row.introHtml || "",
  };
}

function mapInstitution(row: any): Institution {
  return {
    id: row.id,
    name: row.name,
    fullName: row.fullName || "",
    logo: row.logo || "",
    initial: row.name.charAt(0),
    productCount: (row.products || []).length,
    href: `/institutions/${row.id}`,
    products: row.products || [],
  };
}

function mapInstitutionDetail(row: any): InstitutionDetail {
  return {
    id: row.id,
    name: row.name,
    fullName: row.fullName || "",
    logo: row.logo || "",
    website: row.website || "",
    introHtml: row.introHtml || "",
    products: row.products || [],
  };
}

function mapComment(row: any): Comment {
  return {
    id: row.id,
    author: row.author,
    initial: row.author.charAt(0),
    content: row.content,
    productName: row.productName || "",
    productHref: row.productHref || "",
    date: row.date || "",
    images: row.images || [],
  };
}

function mapArticle(row: any): NewsItem {
  return {
    id: row.id,
    title: row.title,
    href: `/articles/${row.id}`,
    description: row.description || "",
    date: row.date || "",
    image: row.image || "",
    categoryId: row.categoryId,
  };
}
