import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyN8nIngress } from "@/lib/n8n/ingress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HeadcountRequest = {
  trip_id: string | null;
  start_date: string | null;
};

const BONUS_THRESHOLD = 10;
const BONUS_RATE = 0.1; // 10% per Section 8 of contract

/**
 * Workflow 06 calls this endpoint after every WeTravel booking.created event
 * to recompute total headcount for the affected departure. Returns whether
 * the 10-guest bonus threshold was crossed (true only on the booking that
 * crossed it, not on subsequent bookings beyond 10).
 */
export async function POST(req: NextRequest) {
  const unauthorized = verifyN8nIngress(req);
  if (unauthorized) return unauthorized;

  let body: HeadcountRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.trip_id || !body.start_date) {
    return NextResponse.json(
      { ok: false, error: "trip_id and start_date required" },
      { status: 400 }
    );
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      {
        ok: false,
        error: "Firestore admin not configured",
        crossed_ten_threshold: false,
        total_guests: 0,
      },
      { status: 503 }
    );
  }

  try {
    const bookingsSnapshot = await db
      .collection("bookings")
      .where("trip.id", "==", body.trip_id)
      .where("trip.start_date", "==", body.start_date)
      .where("status", "in", ["created", "completed"])
      .get();

    let totalGuests = 0;
    let totalRevenue = 0;
    let tripName = "";
    let currency = "USD";
    let priorTotalGuests = 0;
    let mostRecentTimestamp = "";

    bookingsSnapshot.forEach((doc) => {
      const data = doc.data();
      const guests = parseInt(String(data.guests_count || 1), 10);
      const amount = parseFloat(String(data.amount_total || data.amount || 0));
      totalGuests += guests;
      totalRevenue += amount;
      tripName = tripName || String(data.trip?.name || "Unknown trip");
      currency = String(data.currency || "USD");

      const ts = String(data.created_at || "");
      if (ts > mostRecentTimestamp) {
        mostRecentTimestamp = ts;
        priorTotalGuests = totalGuests - guests;
      }
    });

    const crossedThreshold = priorTotalGuests < BONUS_THRESHOLD && totalGuests >= BONUS_THRESHOLD;
    const bonusAmount = crossedThreshold ? parseFloat((totalRevenue * BONUS_RATE).toFixed(2)) : 0;

    // Persist a snapshot for the 10-guest dashboard
    if (crossedThreshold) {
      await db.collection("departures").doc(`${body.trip_id}_${body.start_date}`).set(
        {
          trip_id: body.trip_id,
          start_date: body.start_date,
          trip_name: tripName,
          guests_count: totalGuests,
          revenue_total: totalRevenue,
          currency,
          bonus_triggered_at: new Date().toISOString(),
          bonus_amount: bonusAmount,
        },
        { merge: true }
      );
    }

    return NextResponse.json({
      ok: true,
      trip_id: body.trip_id,
      start_date: body.start_date,
      trip_name: tripName,
      total_guests: totalGuests,
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      currency,
      crossed_ten_threshold: crossedThreshold,
      bonus_amount: bonusAmount,
      bonus_rate: BONUS_RATE,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown Firestore error";
    console.error("[n8n departure-headcount] error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
