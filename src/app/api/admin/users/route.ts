import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const [items, countResult] = await Promise.all([
    db.select().from(schema.users).limit(limit).offset(offset).orderBy(sql`created_at desc`),
    db.select({ count: sql<number>`count(*)` }).from(schema.users),
  ]);

  // Strip password field for security
  const safe = items.map(({ password, ...rest }) => rest);

  return NextResponse.json({ items: safe, total: Number(countResult[0]?.count) || 0, page, totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit) });
}
