import { db, schema } from "@/lib/db";
import { guardAdmin } from "@/lib/api-utils";
import { auditLog } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const { id } = await params;
  const [item] = await db.select().from(schema.products).where(eq(schema.products.id, parseInt(id)));
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const { id } = await params;
  const body = await req.json();
  const [item] = await db.update(schema.products)
    .set({
      name: body.name,
      category: body.category,
      institution: body.institution,
      institutionFullName: body.institutionFullName,
      institutionHref: body.institutionHref,
      maxAmount: body.maxAmount,
      term: body.term,
      rate: body.rate,
      repayment: body.repayment,
      advantages: body.advantages || [],
      summary: body.summary || "",
      introHtml: body.introHtml || "",
      image: body.image || "",
      updatedAt: new Date(),
    })
    .where(eq(schema.products.id, parseInt(id)))
    .returning();

  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await guardAdmin();
  if (auth) return auth;

  const { id } = await params;
  await db.delete(schema.products).where(eq(schema.products.id, parseInt(id)));
  auditLog("product_delete", `id=${id}`);
  return NextResponse.json({ ok: true });
}
