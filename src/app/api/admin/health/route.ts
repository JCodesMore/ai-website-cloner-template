import { NextResponse } from "next/server";

export async function GET() {
  const errors = 0;
  const warnings = 0;
  const status = errors > 0 ? "degraded" : warnings > 0 ? "warning" : "healthy";
  return NextResponse.json({ status, errors, warnings, timestamp: new Date().toISOString() });
}
