import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ── Security headers ──
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }

  // ── Admin route protection ──
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin")) {
    return response;
  }

  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("ymq_admin_session")?.value;
    if (!session) {
      const redirect = NextResponse.redirect(new URL("/admin/login", request.url));
      redirect.headers.set("X-Content-Type-Options", "nosniff");
      redirect.headers.set("X-Frame-Options", "DENY");
      redirect.headers.set("X-XSS-Protection", "1; mode=block");
      redirect.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      return redirect;
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|statics/).*)",
};
