import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/onboarding/reset
 *
 * Wipes the entire onboarding collection. Token-protected to prevent abuse.
 */
export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const expectedToken = process.env.ONBOARDING_TOKEN ?? "bajablue-team-2026";
  if (body.token !== expectedToken) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }

  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ ok: false, error: "Firestore unavailable" }, { status: 500 });
    }

    const snap = await db.collection("onboarding").get();
    const batch = db.batch();
    snap.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({ ok: true, deleted: snap.size });
  } catch (err) {
    console.error("[onboarding/reset] failed", err);
    return NextResponse.json({ ok: false, error: "Reset failed" }, { status: 500 });
  }
}
