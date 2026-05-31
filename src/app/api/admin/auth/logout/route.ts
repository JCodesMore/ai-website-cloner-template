import { clearAdminSession, invalidateAllSessions } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const csrfCheck = checkCsrf(request as unknown as import("next/server").NextRequest);
  if (csrfCheck) return csrfCheck;

  invalidateAllSessions();
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
