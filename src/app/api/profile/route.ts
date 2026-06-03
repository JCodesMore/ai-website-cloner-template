import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/api-utils";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
  if (users.length === 0) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

  const u = users[0];
  return NextResponse.json({
    username: u.username,
    phone: u.phone || "",
    createdAt: u.createdAt,
  });
}

export async function PUT(req: NextRequest) {
  const csrfCheck = checkCsrf(req);
  if (csrfCheck) return csrfCheck;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`profile:${ip}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: "请求过于频繁" }, { status: 429 });

  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { phone } = await req.json();
  if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: "手机号格式不正确" }, { status: 400 });
  }

  await db.update(schema.users).set({ phone: phone || "" }).where(eq(schema.users.username, username));
  return NextResponse.json({ ok: true });
}
