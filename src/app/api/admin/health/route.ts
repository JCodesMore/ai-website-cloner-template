import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: "healthy",
      errors: 0,
      warnings: 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "unhealthy",
        errors: 1,
        warnings: 0,
        detail: err instanceof Error ? err.message : "Database unreachable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
