import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await db.select({
      id: schema.products.id,
      name: schema.products.name,
      institution: schema.products.institution,
      maxAmount: schema.products.maxAmount,
      rate: schema.products.rate,
    }).from(schema.products).orderBy(desc(schema.products.sortOrder)).limit(50);

    const products = rows.map((p) => ({
      id: p.id,
      name: p.name,
      institution: p.institution || "",
      maxAmount: p.maxAmount || "",
      rate: p.rate || "",
      href: `/products/detail/${p.id}`,
    }));

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
