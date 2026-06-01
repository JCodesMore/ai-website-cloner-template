import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq, desc, inArray } from "drizzle-orm";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const username = await getCurrentUser();
  if (!username) redirect("/login?redirect=/profile");

  const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
  if (users.length === 0) redirect("/login?redirect=/profile");
  const u = users[0];

  const followRows = await db
    .select()
    .from(schema.followedProducts)
    .where(eq(schema.followedProducts.username, username))
    .orderBy(desc(schema.followedProducts.createdAt));

  const productIds = followRows.map((r) => r.productId);
  const productRows = productIds.length > 0
    ? await db
        .select({ id: schema.products.id, name: schema.products.name, institution: schema.products.institution })
        .from(schema.products)
        .where(inArray(schema.products.id, productIds))
    : [];

  // Fetch categories for followed products
  const catRows = productIds.length > 0
    ? await db
        .select({ productId: schema.productCategories.productId, category: schema.productCategories.category })
        .from(schema.productCategories)
        .where(inArray(schema.productCategories.productId, productIds))
    : [];
  const catMap = new Map<string, string>();
  for (const c of catRows) catMap.set(String(c.productId), c.category);

  const productMap = new Map(productRows.map((p) => [p.id, p]));
  const follows = followRows.map((r) => ({
    productId: r.productId,
    productName: productMap.get(r.productId)?.name || "未知",
    institution: productMap.get(r.productId)?.institution || "",
    category: catMap.get(String(r.productId)) || "",
  }));

  const comments = await db
    .select()
    .from(schema.comments)
    .where(eq(schema.comments.author, username))
    .orderBy(desc(schema.comments.createdAt));

  return (
    <ProfileClient
      user={{
        username: u.username,
        phone: u.phone || "",
        createdAt: u.createdAt?.toISOString() || null,
      }}
      follows={follows}
      comments={comments.map((c) => ({
        id: c.id,
        content: c.content,
        productName: c.productName || "",
        date: c.date || "",
      }))}
    />
  );
}
