import { requireAdmin } from "@/lib/admin-auth";
import { getUserInfo } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const username = await requireAdmin();
  if (!username) return NextResponse.json({ username: null }, { status: 401 });
  const user = await getUserInfo(username);
  return NextResponse.json({ username, ...user });
}
