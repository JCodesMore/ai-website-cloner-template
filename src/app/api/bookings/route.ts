import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const wetravelToken = process.env.WETRAVEL_API_TOKEN;
  const webhookSecret = process.env.WETRAVEL_WEBHOOK_SECRET;

  if (!wetravelToken && !webhookSecret) {
    return NextResponse.json({
      configured: false,
      setup: "WeTravel not yet connected. Set WETRAVEL_API_TOKEN (Pro plan) or wire the webhook at /api/webhooks/wetravel and set WETRAVEL_WEBHOOK_SECRET.",
      bookings: [],
    });
  }

  // Real implementation would fetch from WeTravel API or read from Firestore (webhook-fed)
  // Placeholder response shape — empty until first real booking arrives
  return NextResponse.json({
    configured: true,
    bookings: [],
    totals: {
      confirmed: 0,
      pending: 0,
      revenue_mtd: 0,
      revenue_ytd: 0,
      upcoming: 0,
    },
  });
}
