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
  try {
    const rows = await db.select().from(schema.products)
      .where(eq(schema.products.category, category))
      .orderBy(desc(schema.products.sortOrder));
    if (rows.length > 0) return rows.map(mapProduct);
  } catch {
    // If no products match the category column (e.g., legacy data),
    // fall back to filtering all products in memory
  }
  const all = await getAllProducts();
  return all.filter((p: any) => p.category === category);
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
  return rows.map(mapInstitution);
}

export async function getInstitutionById(id: string): Promise<InstitutionDetail | null> {
  const rows = await db.select().from(schema.institutions).where(eq(schema.institutions.id, parseInt(id, 10)));
  return rows.length > 0 ? mapInstitutionDetail(rows[0]) : null;
}

// ── Comments ──

export async function getAllComments(): Promise<Comment[]> {
  const rows = await db.select().from(schema.comments).where(eq(schema.comments.status, "approved"));
  return rows.map(mapComment);
}

// ── Articles ──

export async function getArticlesByCategory(categoryId: number): Promise<NewsItem[]> {
  const rows = await db.select().from(schema.articles).where(eq(schema.articles.categoryId, categoryId));
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
