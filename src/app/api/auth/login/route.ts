import { NextRequest, NextResponse } from "next/server";
import { validateUser, setSessionCookie, getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const alreadyLoggedIn = await getCurrentUser();
    if (alreadyLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "请填写用户名和密码" }, { status: 400 });
    }

    if (!validateUser(username, password)) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    return await setSessionCookie(username);
  } catch {
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
