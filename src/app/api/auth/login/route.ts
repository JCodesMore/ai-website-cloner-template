import { NextRequest, NextResponse } from "next/server";
import { validateUser, getCurrentUser, getUserInfo, recordLoginFailure, clearLoginFailures } from "@/lib/auth";
import { signToken } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/api-utils";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be set");
  return secret;
}

export async function POST(req: NextRequest) {
  const csrfCheck = checkCsrf(req);
  if (csrfCheck) return csrfCheck;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`login:${ip}`, 10, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });

  try {
    const alreadyLoggedIn = await getCurrentUser();
    if (alreadyLoggedIn) {
      return NextResponse.json({ error: "您已登录" }, { status: 400 });
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "请填写用户名和密码" }, { status: 400 });
    }

    const valid = await validateUser(username, password);
    if (valid === "locked") {
      return NextResponse.json({ error: "账户已被临时锁定，请15分钟后再试" }, { status: 429 });
    }
    if (!valid) {
      await recordLoginFailure(username);
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    await clearLoginFailures(username);
    const token = signToken(`${username}:${Date.now()}`, getSecret());
    const response = NextResponse.json({
      ok: true,
      user: await getUserInfo(username),
    });
    response.cookies.set("yinmaiquan_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
