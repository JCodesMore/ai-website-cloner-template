import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifyN8nIngress } from "@/lib/n8n/ingress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BriefingRequest = {
  date?: string;
  timezone?: string;
};

type Booking = {
  customer_name: string;
  trip_name: string;
  guests: number;
  amount: number;
  currency: string;
  source: string;
};

type BriefingResponse = {
  date: string;
  timezone: string;
  bookings: {
    count: number;
    list: Booking[];
    revenue_total: number;
    currency: string;
  };
  ad_spend: {
    meta: number;
    google: number;
    total: number;
    currency: string;
  };
  top_queries: Array<{ query: string; clicks: number; position: number }>;
  next_departure: {
    trip_name: string;
    start_date: string;
    guests_count: number;
  } | null;
  action_items: string[];
};

/**
 * Aggregates the data n8n workflow 05 needs to render the client 7am briefing.
 * Pulls from Firestore (bookings, departures), and surfaces empty placeholders
 * for ad spend + GSC queries which require client onboarding to wire up.
 */
export async function POST(req: NextRequest) {
  const unauthorized = verifyN8nIngress(req);
  if (unauthorized) return unauthorized;

  let body: BriefingRequest;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const date = body.date || new Date().toISOString().slice(0, 10);
  const timezone = body.timezone || "America/Mazatlan";

  const db = getAdminDb();
  const response: BriefingResponse = {
    date,
    timezone,
    bookings: { count: 0, list: [], revenue_total: 0, currency: "USD" },
    ad_spend: { meta: 0, google: 0, total: 0, currency: "USD" },
    top_queries: [],
    next_departure: null,
    action_items: [],
  };

  if (!db) {
    response.action_items.push(
      "Firebase Admin SDK not configured on Vercel — set FIREBASE_ADMIN_* env vars to unlock booking aggregation."
    );
    return NextResponse.json(response);
  }

  // ---- Yesterday's bookings ----
  try {
    const startOfYesterday = new Date(`${date}T00:00:00-07:00`);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfToday = new Date(`${date}T00:00:00-07:00`);

    const snapshot = await db
      .collection("bookings")
      .where("created_at", ">=", startOfYesterday.toISOString())
      .where("created_at", "<", startOfToday.toISOString())
      .get();

    let revenueTotal = 0;
    const list: Booking[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const amount = parseFloat(String(data.amount_total || data.amount || 0));
      revenueTotal += amount;
      list.push({
        customer_name: data.customer?.full_name || "Unknown",
        trip_name: data.trip?.name || "Unknown trip",
        guests: parseInt(String(data.guests_count || 1), 10),
        amount,
        currency: String(data.currency || "USD"),
        source: String(data.source || "direct"),
      });
    });

    response.bookings = {
      count: list.length,
      list,
      revenue_total: parseFloat(revenueTotal.toFixed(2)),
      currency: list[0]?.currency || "USD",
    };
  } catch (e) {
    console.error("[daily-briefing] bookings query failed:", e);
  }

  // ---- Next departure ----
  try {
    const today = new Date().toISOString().slice(0, 10);
    const departuresSnapshot = await db
      .collection("departures")
      .where("start_date", ">=", today)
      .orderBy("start_date", "asc")
      .limit(1)
      .get();

    if (!departuresSnapshot.empty) {
      const next = departuresSnapshot.docs[0].data();
      response.next_departure = {
        trip_name: String(next.trip_name || "Unknown"),
        start_date: String(next.start_date || ""),
        guests_count: parseInt(String(next.guests_count || 0), 10),
      };
    }
  } catch (e) {
    console.error("[daily-briefing] departures query failed:", e);
  }

  // ---- Action items (built from heuristics) ----
  if (response.bookings.count === 0) {
    response.action_items.push("No bookings yesterday — review Meta ad delivery and consider posting a fresh Reel.");
  }
  if (response.next_departure && response.next_departure.guests_count >= 8 && response.next_departure.guests_count < 10) {
    response.action_items.push(
      `Next departure (${response.next_departure.start_date}) has ${response.next_departure.guests_count} guests — 1-2 more triggers the 10% bonus.`
    );
  }
  if (!process.env.META_CAPI_ACCESS_TOKEN) {
    response.action_items.push("Meta CAPI not configured — server-side Purchase events not firing.");
  }
  if (!process.env.GOOGLE_PLACE_ID) {
    response.action_items.push("Google Place ID not set — review watchdog (workflow 08) cannot poll Google reviews.");
  }

  return NextResponse.json(response);
}
