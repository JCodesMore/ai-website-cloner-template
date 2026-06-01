import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = Math.max(1, Math.min(365, parseInt(searchParams.get("days") || "30", 10)));

  const [views] = await db.select({ count: sql<number>`count(*)::int` })
    .from(schema.articleAnalytics)
    .where(sql`${schema.articleAnalytics.createdAt} > NOW() - INTERVAL '${sql.raw(String(days))} days'`);

  const [shares] = await db.select({ count: sql<number>`count(*)::int` })
    .from(schema.articleShares)
    .where(sql`${schema.articleShares.createdAt} > NOW() - INTERVAL '${sql.raw(String(days))} days'`);

  const [scans] = await db.select({ count: sql<number>`count(*)::int` })
    .from(schema.qrScans)
    .where(sql`${schema.qrScans.createdAt} > NOW() - INTERVAL '${sql.raw(String(days))} days'`);

  const dailyViews = await db.select({
    date: sql<string>`to_char(${schema.articleAnalytics.createdAt}, 'YYYY-MM-DD')`,
    count: sql<number>`count(*)::int`,
  })
    .from(schema.articleAnalytics)
    .where(sql`${schema.articleAnalytics.createdAt} > NOW() - INTERVAL '${sql.raw(String(days))} days'`)
    .groupBy(sql`to_char(${schema.articleAnalytics.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${schema.articleAnalytics.createdAt}, 'YYYY-MM-DD')`);

  return NextResponse.json({
    totalViews: views?.count || 0,
    totalShares: shares?.count || 0,
    totalScans: scans?.count || 0,
    shareRate: views?.count ? ((shares?.count || 0) / views.count * 100).toFixed(1) : "0",
    dailyViews,
  });
}
