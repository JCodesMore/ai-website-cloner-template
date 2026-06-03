import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyPassword, hashPassword } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/api-utils";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
  const csrfCheck = checkCsrf(req);
  if (csrfCheck) return csrfCheck;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`pwd-change:${ip}`, 5, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: "请求过于频繁，请稍后再试" }, { status: 429 });

  const username = await getCurrentUser();
  if (!username) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ ok: false, error: "请填写完整" }, { status: 400 });
  if (newPassword.length < 6) return NextResponse.json({ ok: false, error: "新密码至少6位" }, { status: 400 });

  const users = await db.select().from(schema.users).where(eq(schema.users.username, username));
  if (users.length === 0) return NextResponse.json({ ok: false, error: "用户不存在" }, { status: 404 });
  if (!verifyPassword(currentPassword, users[0].password)) {
    return NextResponse.json({ ok: false, error: "当前密码不正确" }, { status: 400 });
  }

  await db.update(schema.users).set({ password: hashPassword(newPassword) }).where(eq(schema.users.username, username));
  return NextResponse.json({ ok: true, message: "密码已修改" });
}
