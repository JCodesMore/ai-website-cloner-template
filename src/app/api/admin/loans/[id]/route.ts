import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, string> = {};
  if (body.status) updates.status = body.status;
  if (body.notes !== undefined) updates.notes = body.notes;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "No fields to update" }, { status: 400 });
  }

  const [item] = await db.update(schema.loanApplications)
    .set(updates)
    .where(eq(schema.loanApplications.id, parseInt(id)))
    .returning();

  return NextResponse.json({ ok: true, item });
}
