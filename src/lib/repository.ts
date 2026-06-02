import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import type { Product, Institution, Comment, NewsItem, ArticleDetail, ProductDetail, InstitutionDetail, Counselor } from "@/types";

// Sidebar data — static content, not DB-backed
import {
  industryArticles, discussionArticles, opinionArticles, faqArticles, counselors,
} from "@/lib/data";

// ── Products ──

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.select().from(schema.products).orderBy(desc(schema.products.sortOrder));
  return rows.map(mapProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await db.select({
    id: schema.products.id,
    name: schema.products.name,
    image: schema.products.image,
    institution: schema.products.institution,
    maxAmount: schema.products.maxAmount,
    term: schema.products.term,
    rate: schema.products.rate,
    repayment: schema.products.repayment,
    sortOrder: schema.products.sortOrder,
  })
    .from(schema.products)
    .innerJoin(schema.productCategories, eq(schema.products.id, schema.productCategories.productId))
    .where(eq(schema.productCategories.category, category))
    .orderBy(desc(schema.products.sortOrder));
  return rows.map(row => mapProductFromJoin(row));
}

function mapProductFromJoin(row: any): Product {
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

export async function getProductById(id: string): Promise<ProductDetail | null> {
  const rows = await db.select().from(schema.products).where(eq(schema.products.id, parseInt(id, 10)));
  return rows.length > 0 ? mapProductDetail(rows[0]) : null;
}

export async function getAllProductDetails(): Promise<ProductDetail[]> {
  const rows = await db.select().from(schema.products);
  return rows.map(mapProductDetail);
}

// ── Institutions ──

export async function getAllInstitutions(): Promise<Institution[]> {
  const rows = await db.select().from(schema.institutions);
  // Compute per-institution product count from products table
  const allProds = await db.select({
    institution: schema.products.institution,
  }).from(schema.products);
  const countMap = new Map<string, number>();
  for (const p of allProds) {
    countMap.set(p.institution, (countMap.get(p.institution) || 0) + 1);
  }
  return rows.map((row) => mapInstitution(row, countMap.get(row.name) || 0));
}

export async function getInstitutionById(id: string): Promise<InstitutionDetail | null> {
  const rows = await db.select().from(schema.institutions).where(eq(schema.institutions.id, parseInt(id, 10)));
  if (rows.length === 0) return null;
  const inst = rows[0];
  // Fetch ALL products for this institution from products table
  const prods = await db.select({
    id: schema.products.id,
    name: schema.products.name,
    image: schema.products.image,
  }).from(schema.products).where(eq(schema.products.institution, inst.name));
  const productList = prods.map((p) => ({
    id: p.id,
    name: p.name,
    href: `/products/detail/${p.id}`,
    icon: p.image || "",
  }));
  return mapInstitutionDetail(inst, productList);
}

// ── Comments ──

export async function getAllComments(): Promise<Comment[]> {
  const rows = await db.select().from(schema.comments).where(eq(schema.comments.status, "approved"));
  return rows.map(mapComment);
}

// ── Articles ──

export async function getArticlesByCategory(categoryId: number): Promise<NewsItem[]> {
  const rows = await db.select().from(schema.articles).where(eq(schema.articles.categoryId, categoryId)).orderBy(desc(schema.articles.date));
  return rows.map(mapArticle);
}

export async function getArticleById(id: number): Promise<ArticleDetail | null> {
  const rows = await db.select().from(schema.articles).where(eq(schema.articles.id, id));
  return rows.length > 0
    ? { id: rows[0].id, title: rows[0].title, date: rows[0].date || "", viewCount: rows[0].viewCount || 0, body: rows[0].body || "" }
    : null;
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

function mapInstitution(row: any, realProductCount?: number): Institution {
  return {
    id: row.id,
    name: row.name,
    fullName: row.fullName || "",
    shortName: row.shortName || "",
    logo: row.logo || "",
    initial: row.name.charAt(0),
    productCount: realProductCount ?? (row.products || []).length,
    href: `/institutions/${row.id}`,
    products: row.products || [],
  } as any;
}

function mapInstitutionDetail(row: any, products?: { id: number; name: string; href: string; icon: string }[]): InstitutionDetail {
  return {
    id: row.id,
    name: row.name,
    fullName: row.fullName || "",
    logo: row.logo || "",
    website: row.website || "",
    introHtml: row.introHtml || "",
    products: products || row.products || [],
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
