import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
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

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex").substring(0, 16);

  await db.insert(schema.articleReads).values({
    articleId,
    ipHash,
    durationSeconds: 30,
  });

  return NextResponse.json({ recorded: true });
}
