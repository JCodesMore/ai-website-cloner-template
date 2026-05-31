import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const { id } = await params;
  const [item] = await db.select().from(schema.institutions).where(eq(schema.institutions.id, parseInt(id)));
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;
  const { id } = await params;
  await db.delete(schema.institutions).where(eq(schema.institutions.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}
