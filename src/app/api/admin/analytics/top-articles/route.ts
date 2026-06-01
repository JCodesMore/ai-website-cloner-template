import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { sql, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = Math.max(1, Math.min(365, parseInt(searchParams.get("days") || "30", 10)));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

  const rows = await db.select({
    id: schema.articles.id,
    title: schema.articles.title,
    viewCount: schema.articles.viewCount,
    recentViews: sql<number>`count(${schema.articleAnalytics.id})::int`,
    recentShares: sql<number>`COALESCE(
      (SELECT count(*)::int FROM ${schema.articleShares}
       WHERE ${schema.articleShares.articleId} = ${schema.articles.id}
       AND ${schema.articleShares.createdAt} > NOW() - INTERVAL '${sql.raw(String(days))} days'
      ), 0)`,
  })
    .from(schema.articles)
    .leftJoin(schema.articleAnalytics,
      sql`${schema.articleAnalytics.articleId} = ${schema.articles.id}
           AND ${schema.articleAnalytics.createdAt} > NOW() - INTERVAL '${sql.raw(String(days))} days'`)
    .groupBy(schema.articles.id)
    .orderBy(desc(sql`count(${schema.articleAnalytics.id})`))
    .limit(limit);

  return NextResponse.json(rows);
}
