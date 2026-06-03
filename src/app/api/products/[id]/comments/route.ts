import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/api-utils";
import { db, schema } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pid = parseInt(id, 10);
  try {
    const rows = await db.select().from(schema.comments)
      .where(and(eq(schema.comments.productId, pid), eq(schema.comments.status, "approved")))
      .orderBy(desc(schema.comments.createdAt));
    return NextResponse.json({ comments: rows });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const csrfCheck = checkCsrf(req);
  if (csrfCheck) return csrfCheck;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`comment:${ip}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: "请求过于频繁" }, { status: 429 });

  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const { id } = await params;
  const pid = parseInt(id, 10);
  const { content } = await req.json();
  if (!content || content.trim().length < 1) {
    return NextResponse.json({ ok: false, error: "请输入评论内容" }, { status: 400 });
  }

  const [product] = await db.select({ name: schema.products.name })
    .from(schema.products)
    .where(eq(schema.products.id, pid));

  await db.insert(schema.comments).values({
    author: username,
    content: content.trim(),
    productId: pid,
    productName: product?.name || "",
    date: new Date().toLocaleDateString("zh-CN"),
    status: "pending",
    createdAt: new Date(),
  });
  return NextResponse.json({ ok: true });
}
