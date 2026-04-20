import { NextResponse } from "next/server";

/**
 * POST /api/assessment
 *
 * Accepts a completed assessment submission (SMB Liability Checkup or
 * FAIIR AI Self-Check) and persists it to Supabase when configured.
 *
 * Fail-open design: if Supabase env vars are missing or the insert fails,
 * the route still returns 200 so the user's result view is never blocked
 * on lead capture. We log enough server-side to reconstruct in dev.
 *
 * Required env (set in Netlify site settings / .env.local):
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY   (server only — do NOT expose to client)
 *
 * Supabase table: public.assessment_responses (see migration
 * 0002_assessment_responses.sql in the FAIIR backend).
 */

export const runtime = "nodejs";
// Intentionally dynamic — this route writes; no caching.
export const dynamic = "force-dynamic";

interface AreaScore {
  id: string;
  score: number;
  max: number;
  tier: "red" | "yellow" | "green";
}

interface Payload {
  assessmentId: "smb" | "faiir";
  email: string | null;
  wantsTips: boolean;
  answers: Record<string, 0 | 1 | 2>;
  score: {
    overall: number;
    max: number;
    tier: "red" | "yellow" | "green";
    areas: AreaScore[];
  };
}

function isPayload(x: unknown): x is Payload {
  if (!x || typeof x !== "object") return false;
  const p = x as Record<string, unknown>;
  if (p.assessmentId !== "smb" && p.assessmentId !== "faiir") return false;
  if (p.email !== null && typeof p.email !== "string") return false;
  if (typeof p.wantsTips !== "boolean") return false;
  if (!p.answers || typeof p.answers !== "object") return false;
  if (!p.score || typeof p.score !== "object") return false;
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!isPayload(body)) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Best-effort user-agent + referer capture for provenance.
  const referer = request.headers.get("referer") ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  const row = {
    assessment_id: body.assessmentId,
    email: body.email,
    wants_tips: body.wantsTips,
    answers: body.answers,
    overall_score: body.score.overall,
    overall_max: body.score.max,
    overall_tier: body.score.tier,
    area_scores: body.score.areas,
    referer,
    user_agent: userAgent,
  };

  if (!url || !serviceKey) {
    // Not yet wired. Log and return ok so the UI can still show results.
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[assessment] Supabase env not configured — would insert:",
        row,
      );
    }
    return NextResponse.json({ ok: true, persisted: false });
  }

  try {
    const res = await fetch(`${url}/rest/v1/assessment_responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[assessment] Supabase insert failed", res.status, text);
      return NextResponse.json({ ok: true, persisted: false });
    }

    return NextResponse.json({ ok: true, persisted: true });
  } catch (err) {
    console.error("[assessment] Supabase insert error", err);
    return NextResponse.json({ ok: true, persisted: false });
  }
}
