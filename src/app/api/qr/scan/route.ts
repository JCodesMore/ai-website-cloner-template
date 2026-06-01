import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  let pagePath = "/";
  try {
    const body = await req.json();
    if (body.pagePath) pagePath = body.pagePath;
  } catch {}

  await db.insert(schema.qrScans).values({ pagePath });

  return NextResponse.json({ recorded: true });
}
