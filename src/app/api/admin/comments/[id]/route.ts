import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const { id } = await params;
  const [item] = await db.select().from(schema.comments).where(eq(schema.comments.id, parseInt(id)));
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const { id } = await params;
  const { status } = await req.json();
  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "无效的状态值" }, { status: 400 });
  }
  await db.update(schema.comments).set({ status }).where(eq(schema.comments.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const { id } = await params;
  await db.delete(schema.comments).where(eq(schema.comments.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}

