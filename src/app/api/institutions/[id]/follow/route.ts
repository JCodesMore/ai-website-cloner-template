import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/api-utils";
import { db, schema } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const csrfCheck = checkCsrf(req);
  if (csrfCheck) return csrfCheck;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`follow-inst:${ip}`, 20, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "请求过于频繁" }, { status: 429 });

  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  const iid = parseInt(id);

  const existing = await db.select().from(schema.followedInstitutions).where(
    and(eq(schema.followedInstitutions.username, username), eq(schema.followedInstitutions.institutionId, iid))
  );
  if (existing.length > 0) return NextResponse.json({ ok: true, following: true });

  await db.insert(schema.followedInstitutions).values({ username, institutionId: iid, createdAt: new Date() });
  return NextResponse.json({ ok: true, following: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const csrfCheck = checkCsrf(req as unknown as NextRequest);
  if (csrfCheck) return csrfCheck;

  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  await db.delete(schema.followedInstitutions).where(
    and(eq(schema.followedInstitutions.username, username), eq(schema.followedInstitutions.institutionId, parseInt(id)))
  );
  return NextResponse.json({ ok: true, following: false });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ following: false });

  const { id } = await params;
  const existing = await db.select().from(schema.followedInstitutions).where(
    and(eq(schema.followedInstitutions.username, username), eq(schema.followedInstitutions.institutionId, parseInt(id)))
  );
  return NextResponse.json({ following: existing.length > 0 });
}
