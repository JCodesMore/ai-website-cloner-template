import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { eq, like, or, sql } from "drizzle-orm";
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
    ? or(
        like(schema.products.name, `%${search}%`),
        like(schema.products.institution, `%${search}%`),
        like(schema.products.institutionFullName, `%${search}%`),
      )
    : undefined;

  const [items, countResult] = await Promise.all([
    db.select().from(schema.products).where(where).limit(limit).offset(offset).orderBy(schema.products.id),
    db.select({ count: sql<number>`count(*)` }).from(schema.products).where(where),
  ]);

  return NextResponse.json({ items, total: Number(countResult[0]?.count) || 0, page, totalPages: Math.ceil((Number(countResult[0]?.count) || 0) / limit) });
}

export async function POST(req: Request) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const body = await req.json();
  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    return NextResponse.json({ error: "产品名称不能为空" }, { status: 400 });
  }
  if (body.name.length > 200) {
    return NextResponse.json({ error: "产品名称过长" }, { status: 400 });
  }
  const [item] = await db.insert(schema.products).values({
    category: body.category || "person",
    name: body.name,
    image: body.image || "",
    institution: body.institution || "",
    institutionFullName: body.institutionFullName || "",
    institutionHref: body.institutionHref || "",
    maxAmount: body.maxAmount || "",
    term: body.term || "",
    rate: body.rate || "",
    repayment: body.repayment || "",
    advantages: body.advantages || [],
    summary: body.summary || "",
    introHtml: body.introHtml || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  return NextResponse.json({ ok: true, item }, { status: 201 });
}
