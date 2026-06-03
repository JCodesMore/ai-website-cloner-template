import { NextRequest, NextResponse } from "next/server";
import { createUser, setSessionCookie, getCurrentUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  const csrfCheck = checkCsrf(req);
  if (csrfCheck) return csrfCheck;

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`register:${ip}`, 5, 60_000);
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

    if (username.length < 2 || username.length > 16) {
      return NextResponse.json({ error: "用户名长度需在2-16位之间" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少6位" }, { status: 400 });
    }

    const result = await createUser(username, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return await setSessionCookie(username);
  } catch {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
