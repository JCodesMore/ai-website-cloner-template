import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin(); if (auth) return auth;
  const { id } = await params;
  const [item] = await db.select().from(schema.articles).where(eq(schema.articles.id, parseInt(id)));
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin(); if (auth) return auth;
  const { id } = await params;
  const body = await req.json();
  const [item] = await db.update(schema.articles).set({
    title: body.title, body: body.body, date: body.date,
    viewCount: body.viewCount, categoryId: body.categoryId,
    updatedAt: new Date(),
  }).where(eq(schema.articles.id, parseInt(id))).returning();
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin(); if (auth) return auth;
  const { id } = await params;
  await db.delete(schema.articles).where(eq(schema.articles.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}
