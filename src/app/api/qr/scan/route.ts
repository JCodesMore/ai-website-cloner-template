import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  let pagePath = "/";
  let source = "unknown";
  let productId: number | undefined;
  try {
    const body = await req.json();
    if (body.pagePath) pagePath = body.pagePath;
    if (body.source) source = body.source;
    if (body.productId) productId = Number(body.productId);
  } catch {}

  await db.insert(schema.qrScans).values({ pagePath, source, productId });

  return NextResponse.json({ recorded: true });
}
