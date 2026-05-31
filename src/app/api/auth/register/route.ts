import { NextRequest, NextResponse } from "next/server";
import { createUser, setSessionCookie, getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
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

    const result = createUser(username, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return await setSessionCookie(username);
  } catch {
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}
