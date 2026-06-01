import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId) || articleId < 1) {
    return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
  }

  let channel = "copy_link";
  let deviceType = "desktop";
  try {
    const body = await req.json();
    if (body.channel) channel = body.channel;
    if (body.deviceType) deviceType = body.deviceType;
  } catch {}

  await db.insert(schema.articleShares).values({
    articleId,
    channel,
    deviceType,
  });

  return NextResponse.json({ recorded: true });
}
