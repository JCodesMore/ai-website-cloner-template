import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { like, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const search = url.searchParams.get("search") || "";
  const limit = 20;
  const offset = (page - 1) * limit;
  const where = search ? like(schema.articles.title, `%${search}%`) : undefined;
  const [items, countResult] = await Promise.all([
    db.select().from(schema.articles).where(where).limit(limit).offset(offset).orderBy(schema.articles.id),
    db.select({ count: sql<number>`count(*)` }).from(schema.articles).where(where),
  ]);
  return NextResponse.json({ items, total: Number(countResult[0]?.count) || 0, page, totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit) });
}

export async function POST(req: Request) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const body = await req.json();
  const [item] = await db.insert(schema.articles).values({
    title: body.title || "", body: body.body || "", date: body.date || "",
    viewCount: body.viewCount || 0, categoryId: body.categoryId || 0,
    createdAt: new Date(), updatedAt: new Date(),
  }).returning();
  return NextResponse.json({ ok: true, item }, { status: 201 });
}
