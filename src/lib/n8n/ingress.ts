import { NextRequest, NextResponse } from "next/server";

/**
 * Shared helper for verifying inbound n8n webhook calls hitting the bajablue.mx
 * /api/n8n/* receiver endpoints. n8n forwards an `x-n8n-secret` header that
 * must match the BAJABLUE_INGRESS_SECRET env var (set on both Vercel and the
 * Hetzner n8n container).
 *
 * Returns null on success, or a NextResponse with 401/500 to short-circuit.
 */
export function verifyN8nIngress(req: NextRequest): NextResponse | null {
  const expected = process.env.BAJABLUE_INGRESS_SECRET;

  if (!expected) {
    console.error("[n8n ingress] BAJABLUE_INGRESS_SECRET not set on bajablue.mx");
    return NextResponse.json(
      { ok: false, error: "Ingress secret not configured on receiver" },
      { status: 500 }
    );
  }

  const incoming = req.headers.get("x-n8n-secret") || req.headers.get("x-bajablue-secret");
  if (!incoming || incoming !== expected) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}
