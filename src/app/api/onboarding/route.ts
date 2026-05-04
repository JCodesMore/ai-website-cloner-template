import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type SaveStepPayload = {
  token: string;       // shared secret token in URL
  stepId: string;      // which step
  data: Record<string, unknown>;  // field values (no secrets)
  completed: boolean;  // is this step now done
  timestamp?: string;
};

const STORAGE_PREFIX = "onboarding/";

/**
 * POST /api/onboarding
 *
 * Saves a single step's submission. Sensitive fields (type=secret) should
 * NEVER be in the payload — the wizard only sends the boolean "sent via
 * 1Password" confirmation.
 *
 * Notifies Telegram if configured so Nico sees live progress.
 */
export async function POST(req: NextRequest) {
  let body: SaveStepPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Token check — minimal authorization, the URL itself is the token.
  // Trim because at one point ONBOARDING_TOKEN was set in Vercel with a
  // trailing \n which silently 401'd every submission. Trim catches that
  // and any other accidental whitespace going forward.
  const expectedToken = (process.env.ONBOARDING_TOKEN ?? "bajablue-team-2026").trim();
  const submittedToken = (body.token ?? "").trim();
  if (submittedToken !== expectedToken) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }

  if (!body.stepId || typeof body.stepId !== "string") {
    return NextResponse.json({ ok: false, error: "stepId required" }, { status: 400 });
  }

  // Persist to Firestore via admin SDK
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const db = getAdminDb();
    if (db) {
      await db
        .collection("onboarding")
        .doc(body.stepId)
        .set(
          {
            stepId: body.stepId,
            data: body.data ?? {},
            completed: body.completed ?? false,
            updatedAt: body.timestamp ?? new Date().toISOString(),
          },
          { merge: true }
        );
    }
  } catch (err) {
    console.error("[onboarding] Firestore save failed", err);
    // Continue — Telegram notification is independent
  }

  // Notify Nico via Telegram (best-effort)
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  if (telegramToken && telegramChatId && body.completed) {
    const lines = [
      "*Bajablue client completed onboarding step*",
      "",
      `*Step:* ${body.stepId}`,
      "",
      "*Data:*",
      "```",
      JSON.stringify(body.data ?? {}, null, 2),
      "```",
      "",
      `_${new Date().toISOString()}_`,
    ];

    fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: lines.join("\n"),
        parse_mode: "Markdown",
      }),
    }).catch((err) => console.error("[onboarding] Telegram notify failed", err));
  }

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/onboarding?token=...
 *
 * Returns the current onboarding state — all completed steps and their data.
 * Used to resume a session and to power the dashboard progress widget.
 */
export async function GET(req: NextRequest) {
  const token = (req.nextUrl.searchParams.get("token") ?? "").trim();
  const expectedToken = (process.env.ONBOARDING_TOKEN ?? "bajablue-team-2026").trim();

  if (token !== expectedToken) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }

  try {
    const { getAdminDb } = await import("@/lib/firebase/admin");
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ ok: true, steps: {} });
    }

    const snapshot = await db.collection("onboarding").get();
    const steps: Record<string, unknown> = {};
    snapshot.forEach((doc) => {
      steps[doc.id] = doc.data();
    });

    return NextResponse.json({ ok: true, steps });
  } catch (err) {
    console.error("[onboarding] Firestore read failed", err);
    return NextResponse.json({ ok: true, steps: {} });
  }
}
