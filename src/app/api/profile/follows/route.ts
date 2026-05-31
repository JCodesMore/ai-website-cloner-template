import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ follows: [] });

  const rows = await db.select().from(schema.followedProducts).where(eq(schema.followedProducts.username, username)).orderBy(schema.followedProducts.createdAt);

  // Enrich with product names
  const follows = await Promise.all(rows.map(async (r) => {
    const [p] = await db.select({ name: schema.products.name, institution: schema.products.institution }).from(schema.products).where(eq(schema.products.id, r.productId));
    return { productId: r.productId, productName: p?.name || "未知", institution: p?.institution || "" };
  }));

  return NextResponse.json({ follows });
}
