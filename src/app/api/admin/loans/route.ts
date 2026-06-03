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
  const cityFilter = url.searchParams.get("city") || "";
  const purposeFilter = url.searchParams.get("purpose") || "";
  const dateFrom = url.searchParams.get("dateFrom") || "";
  const dateTo = url.searchParams.get("dateTo") || "";
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (statusFilter) conditions.push(eq(schema.loanApplications.status, statusFilter));
  if (search) conditions.push(like(schema.loanApplications.phone, `%${search}%`));
  if (cityFilter) conditions.push(sql`notes::jsonb->>'city' ILIKE ${'%' + cityFilter + '%'}`);
  if (purposeFilter) conditions.push(sql`notes::jsonb->>'purpose' ILIKE ${'%' + purposeFilter + '%'}`);
  if (dateFrom) conditions.push(sql`created_at::date >= ${dateFrom}::date`);
  if (dateTo) conditions.push(sql`created_at::date <= ${dateTo}::date`);
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, countResult] = await Promise.all([
    db.select().from(schema.loanApplications).where(where).limit(limit).offset(offset).orderBy(sql`created_at desc`),
    db.select({ count: sql<number>`count(*)` }).from(schema.loanApplications).where(where),
  ]);

  const parsed = items.map((item) => {
    let extra: Record<string, string> = {};
    try { if (item.notes) extra = JSON.parse(item.notes); } catch {}
    return {
      ...item,
      customerName: extra.name || "",
      customerPurpose: extra.purpose || "",
      customerCity: extra.city || "",
      notes: extra.name ? item.notes : (item.notes || ""), // keep raw notes if no extra fields
    };
  });

  return NextResponse.json({
    items: parsed,
    total: Number(countResult[0]?.count) || 0,
    page,
    totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit),
  });
}
