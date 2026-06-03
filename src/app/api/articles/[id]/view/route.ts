import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { createHash } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId) || articleId < 1) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  const articles = await db.select({ id: schema.articles.id })
    .from(schema.articles)
    .where(eq(schema.articles.id, articleId))
    .limit(1);
  if (articles.length === 0) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").substring(0, 16);

  const recent = await db.select({ id: schema.articleAnalytics.id })
    .from(schema.articleAnalytics)
    .where(and(
      eq(schema.articleAnalytics.articleId, articleId),
      eq(schema.articleAnalytics.ipHash, ipHash),
      sql`${schema.articleAnalytics.createdAt} > NOW() - INTERVAL '24 hours'`
    ))
    .limit(1);

  if (recent.length > 0) {
    return NextResponse.json({ counted: false, reason: "dedup" });
  }

  await db.insert(schema.articleAnalytics).values({
    articleId,
    ipHash,
    userAgent: req.headers.get("user-agent") || "",
  });

  await db.update(schema.articles)
    .set({ viewCount: sql`${schema.articles.viewCount} + 1` })
    .where(eq(schema.articles.id, articleId));

  return NextResponse.json({ counted: true });
}
