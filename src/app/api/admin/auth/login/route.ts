import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { validateAdminCredentials, auditLog, invalidateAllSessions } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be set");
  return secret;
}

export async function POST(request: Request) {
  const csrfCheck = checkCsrf(request as unknown as import("next/server").NextRequest);
  if (csrfCheck) return csrfCheck;

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`admin-login:${ip}`, 5, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: "请求过于频繁，请稍后再试" }, { status: 429 });

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "请输入账号和密码" }, { status: 400 });
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: "账号或密码错误" }, { status: 401 });
  }

  // Invalidate all previous sessions before issuing a new token
  invalidateAllSessions();

  const cookieStore = await cookies();
  const payload = `${username}:${Date.now()}`;
  const hmac = createHmac("sha256", getSecret());
  hmac.update(payload);
  const token = `${payload}.${hmac.digest("hex").slice(0, 32)}`;
  cookieStore.set("ymq_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  auditLog("admin_login", `user=${username}`);

  return NextResponse.json({ ok: true });
}

