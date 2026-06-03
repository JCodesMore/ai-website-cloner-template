import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { like, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const search = url.searchParams.get("search") || "";
  const limit = 20;
  const offset = (page - 1) * limit;

  const where = search
    ? or(like(schema.institutions.name, `%${search}%`), like(schema.institutions.fullName, `%${search}%`))
    : undefined;

  const [items, countResult] = await Promise.all([
    db.select().from(schema.institutions).where(where).limit(limit).offset(offset).orderBy(schema.institutions.id),
    db.select({ count: sql<number>`count(*)` }).from(schema.institutions).where(where),
  ]);
  return NextResponse.json({ items, total: Number(countResult[0]?.count) || 0, page, totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit) });
}
