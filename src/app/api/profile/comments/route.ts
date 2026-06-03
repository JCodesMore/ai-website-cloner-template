import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ comments: [] });

  const rows = await db.select().from(schema.comments).where(eq(schema.comments.author, username)).orderBy(schema.comments.createdAt);
  return NextResponse.json({ comments: rows });
}
