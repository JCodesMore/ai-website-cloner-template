import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const auth = await guardAdmin();
  if (auth) return auth;

  try {
    // 7-day trend: count by day
    const trend = await db.execute(sql`
      SELECT
        to_char(created_at, 'MM-DD') as day,
        COUNT(*)::int as count
      FROM loan_applications
      WHERE created_at >= now() - interval '7 days'
      GROUP BY day
      ORDER BY day
    `);

    // Status distribution
    const statusDist = await db.execute(sql`
      SELECT status, COUNT(*)::int as count
      FROM loan_applications
      GROUP BY status
    `);

    // Today count
    const todayCount = await db.execute(sql`
      SELECT COUNT(*)::int as count
      FROM loan_applications
      WHERE created_at::date = CURRENT_DATE
    `);

    // Total count
    const totalCount = await db.execute(sql`
      SELECT COUNT(*)::int as count FROM loan_applications
    `);

    return NextResponse.json({
      trend: trend.rows,
      statusDist: statusDist.rows,
      today: todayCount.rows[0]?.count || 0,
      total: totalCount.rows[0]?.count || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
