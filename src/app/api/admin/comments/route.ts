import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { and, eq, like, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const search = url.searchParams.get("search") || "";
  const filter = url.searchParams.get("filter") || "";
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions: ReturnType<typeof and>[] = [];
  if (search) conditions.push(or(like(schema.comments.content, `%${search}%`), like(schema.comments.author, `%${search}%`)));
  if (filter === "images") conditions.push(sql`jsonb_array_length(images) > 0`);
  const where = conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined;

  const [items, countResult] = await Promise.all([
    db.select().from(schema.comments).where(where).limit(limit).offset(offset).orderBy(sql`id desc`),
    db.select({ count: sql<number>`count(*)` }).from(schema.comments).where(where),
  ]);
  return NextResponse.json({ items, total: Number(countResult[0]?.count) || 0, page, totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit) });
}
