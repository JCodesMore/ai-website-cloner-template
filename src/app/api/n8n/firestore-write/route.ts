import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyN8nIngress } from "@/lib/n8n/ingress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FirestoreWritePayload = {
  collection: string;
  doc_id?: string;
  data: Record<string, unknown>;
};

const ALLOWED_COLLECTIONS = new Set([
  "bookings",
  "leads",
  "reviews_flagged",
  "n8n_runs",
  "departures",
]);

export async function POST(req: NextRequest) {
  const unauthorized = verifyN8nIngress(req);
  if (unauthorized) return unauthorized;

  let payload: FirestoreWritePayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.collection || !ALLOWED_COLLECTIONS.has(payload.collection)) {
    return NextResponse.json(
      { ok: false, error: `Collection not allowed. Allowed: ${[...ALLOWED_COLLECTIONS].join(", ")}` },
      { status: 400 }
    );
  }
  if (!payload.data || typeof payload.data !== "object") {
    return NextResponse.json({ ok: false, error: "Missing data object" }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "Firestore admin not configured (missing FIREBASE_ADMIN_* env vars)" },
      { status: 503 }
    );
  }

  try {
    const collectionRef = db.collection(payload.collection);
    const enrichedData = {
      ...payload.data,
      _ingested_at: new Date().toISOString(),
      _source: "n8n",
    };

    if (payload.doc_id) {
      await collectionRef.doc(payload.doc_id).set(enrichedData, { merge: true });
      return NextResponse.json({
        ok: true,
        collection: payload.collection,
        doc_id: payload.doc_id,
        operation: "set-merge",
      });
    } else {
      const docRef = await collectionRef.add(enrichedData);
      return NextResponse.json({
        ok: true,
        collection: payload.collection,
        doc_id: docRef.id,
        operation: "add",
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown Firestore error";
    console.error("[n8n firestore-write] Firestore error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
