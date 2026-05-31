import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { eq, like, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const statusFilter = url.searchParams.get("status") || "";
  const search = url.searchParams.get("search") || "";
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (statusFilter) conditions.push(eq(schema.loanApplications.status, statusFilter));
  if (search) conditions.push(like(schema.loanApplications.phone, `%${search}%`));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, countResult] = await Promise.all([
    db.select().from(schema.loanApplications).where(where).limit(limit).offset(offset).orderBy(sql`created_at desc`),
    db.select({ count: sql<number>`count(*)` }).from(schema.loanApplications).where(where),
  ]);

  return NextResponse.json({
    items,
    total: Number(countResult[0]?.count) || 0,
    page,
    totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit),
  });
}
