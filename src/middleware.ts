import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except login)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  // Check session cookie
  const session = request.cookies.get("__session")?.value;

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists — let it through
  // Full verification happens server-side in the admin layout
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
