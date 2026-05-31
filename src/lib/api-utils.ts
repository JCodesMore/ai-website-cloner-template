import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function guardAdmin() {
  const username = await requireAdmin();
  if (!username) {
    return NextResponse.json({ error: "未登录或无权访问" }, { status: 401 });
  }
  return null;
}

/** CSRF check for state-changing requests (POST/PUT/DELETE) */
export function checkCsrf(request: NextRequest): NextResponse | null {
  if (request.method === "GET") return null;
  const origin = request.headers.get("origin") || "";
  const host = request.headers.get("host") || "";
  if (origin && new URL(origin).host !== host) {
    return NextResponse.json({ error: "请求来源不合法" }, { status: 403 });
  }
  return null;
}
