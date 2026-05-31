import { NextResponse } from "next/server";
import { getCurrentUser, getUserInfo } from "@/lib/auth";

export async function GET() {
  const username = await getCurrentUser();
  if (!username) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }
  const user = await getUserInfo(username);
  return NextResponse.json(
    { authenticated: true, ...user },
    { headers: { "Cache-Control": "no-store" } }
  );
}
