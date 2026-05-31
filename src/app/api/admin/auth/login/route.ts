import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminCredentials, auditLog, invalidateAllSessions } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { signToken } from "@/lib/crypto";

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

  if (!(await validateAdminCredentials(username, password))) {
    return NextResponse.json({ ok: false, error: "账号或密码错误" }, { status: 401 });
  }

  await invalidateAllSessions();

  const cookieStore = await cookies();
  const token = signToken(`${username}:${Date.now()}`, getSecret());
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
