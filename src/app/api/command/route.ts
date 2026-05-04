import { NextResponse } from "next/server";

export const runtime = "nodejs";

type DaySeries = { date: string; meta: number; google: number; tiktok: number };
type CampaignRow = {
  id: string;
  platform: "meta" | "google" | "tiktok";
  name: string;
  status: "active" | "paused" | "learning";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
};
type BookingRow = {
  id: string;
  guest: string;
  tour: "Ocean Safari" | "Blue Expedition" | "Master Seafari";
  date: string;
  guests: number;
  revenue: number;
  source: string;
};

function buildDemo() {
  const today = new Date();
  const days: DaySeries[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    days.push({
      date: d.toISOString().slice(0, 10),
      meta: Math.round(25 + Math.random() * 20 + (13 - i) * 0.6),
      google: Math.round(18 + Math.random() * 15 + (13 - i) * 0.4),
      tiktok: Math.round(8 + Math.random() * 10),
    });
  }

  const campaigns: CampaignRow[] = [
    { id: "c1", platform: "meta", name: "Master Seafari · Reels · US+CA", status: "active", spend: 182, impressions: 48200, clicks: 1104, conversions: 8, revenue: 14850 },
    { id: "c2", platform: "meta", name: "Ocean Safari · Retargeting · 30d", status: "active", spend: 94, impressions: 18100, clicks: 823, conversions: 11, revenue: 4400 },
    { id: "c3", platform: "google", name: "Brand · bajablue tours", status: "active", spend: 38, impressions: 2140, clicks: 412, conversions: 9, revenue: 6300 },
    { id: "c4", platform: "google", name: "whale watching la ventana", status: "active", spend: 115, impressions: 6210, clicks: 284, conversions: 4, revenue: 2100 },
    { id: "c5", platform: "google", name: "orca diving baja", status: "learning", spend: 66, impressions: 3050, clicks: 92, conversions: 1, revenue: 540 },
    { id: "c6", platform: "meta", name: "Blue Expedition · Cold · LAL 1%", status: "paused", spend: 41, impressions: 9800, clicks: 201, conversions: 0, revenue: 0 },
  ];

  const bookings: BookingRow[] = [
    { id: "b1", guest: "Sarah Mitchell", tour: "Master Seafari", date: "2026-05-12", guests: 2, revenue: 2700, source: "google-ads" },
    { id: "b2", guest: "James & Ana Rodriguez", tour: "Ocean Safari", date: "2026-05-15", guests: 4, revenue: 600, source: "meta-ads" },
    { id: "b3", guest: "The Larsson Family", tour: "Ocean Safari", date: "2026-05-20", guests: 6, revenue: 900, source: "direct" },
    { id: "b4", guest: "Dr. Emma Walsh", tour: "Master Seafari", date: "2026-06-08", guests: 1, revenue: 2700, source: "meta-ads" },
    { id: "b5", guest: "Michael Chen", tour: "Blue Expedition", date: "2026-06-02", guests: 1, revenue: 1750, source: "organic" },
  ];

  const mtdSpend = days.reduce((s, d) => s + d.meta + d.google + d.tiktok, 0);
  const mtdRevenue = bookings.reduce((s, b) => s + b.revenue, 0) * 2.8;
  const mtdBookings = bookings.length * 3;
  const mtdConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return {
    demo: true,
    updated: new Date().toISOString(),
    kpis: {
      active_visitors: 4,
      mtd_spend: Math.round(mtdSpend),
      mtd_revenue: Math.round(mtdRevenue),
      mtd_bookings: mtdBookings,
      mtd_conversions: mtdConversions,
      avg_roas: Number((mtdRevenue / mtdSpend).toFixed(2)),
    },
    spend_series: days,
    ads: {
      meta: {
        configured: false,
        spend: 317,
        impressions: 76100,
        clicks: 2128,
        conversions: 19,
        cpm: Number((317 / 76.1).toFixed(2)),
        cpc: Number((317 / 2128).toFixed(2)),
        cpa: Number((317 / 19).toFixed(2)),
        roas: Number((19250 / 317).toFixed(2)),
        top_campaigns: campaigns.filter((c) => c.platform === "meta"),
      },
      google: {
        configured: false,
        spend: 219,
        impressions: 11400,
        clicks: 788,
        conversions: 14,
        cpc: Number((219 / 788).toFixed(2)),
        cpa: Number((219 / 14).toFixed(2)),
        roas: Number((8940 / 219).toFixed(2)),
        top_campaigns: campaigns.filter((c) => c.platform === "google"),
      },
      tiktok: {
        configured: false,
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
      },
    },
    bookings: {
      upcoming: bookings,
      next_group: { tour: "Master Seafari", date: "2026-06-15", confirmed_guests: 7, target_guests: 10 },
    },
    performance_comp: {
      mtd_sales: Math.round(mtdRevenue),
      commission_3pct_mtd: Number((mtdRevenue * 0.03).toFixed(0)),
      group_trips_this_season: 2,
      group_commission_ytd: 2700,
      initial_term_total_estimate: Number((mtdRevenue * 0.03 * 6 + 2700 * 3).toFixed(0)),
    },
    outreach: {
      tier1: { sent: 3, opened: 2, replied: 1, published: 0, total: 14 },
      tier2: { submitted: 0, replied: 0, published: 0, total: 30 },
    },
    n8n: {
      instance_url: null,
      workflows: [
        { name: "01 — WeTravel booking → Telegram alert", status: "json-ready", priority: "critical" },
        { name: "02 — WeTravel booking → Meta Conversions API", status: "json-ready", priority: "critical" },
        { name: "03 — WeTravel booking → Firestore + commission", status: "json-ready", priority: "critical" },
        { name: "04 — Instagram comment 'BOOK' → auto-DM", status: "json-ready", priority: "high" },
        { name: "05 — Daily 7am briefing email (Mazatlán)", status: "json-ready", priority: "high" },
        { name: "06 — 10-guest departure trigger (10% bonus)", status: "json-ready", priority: "critical" },
        { name: "07 — Contact form → Telegram lead alert", status: "json-ready", priority: "high" },
        { name: "08 — Negative review watchdog (6h poll)", status: "json-ready", priority: "medium" },
      ],
      receivers: [
        { name: "/api/n8n/firestore-write", status: "deployed", purpose: "Firestore writes for bookings/leads/reviews" },
        { name: "/api/n8n/daily-briefing", status: "deployed", purpose: "Aggregates yesterday's bookings + ad spend" },
        { name: "/api/n8n/departure-headcount", status: "deployed", purpose: "10-guest threshold detection" },
        { name: "/api/n8n/recent-reviews", status: "deployed", purpose: "Google + TripAdvisor review polling" },
      ],
    },
    phase: {
      current: "Phase 1 — Phase 2 Scope Build",
      next_actions: [
        "Collect WeTravel trip URLs from the Bajablue team",
        "Confirm WeTravel plan level (Pro unlocks API)",
        "Embed WeTravel CTAs on 3 tour pages",
        "Install toprank MCP (first of the stack)",
        "Create Stripe/Meta Conversion API webhook receiver",
        "Send Tier 1 outreach batch (3 emails)",
        "Stand up n8n instance + WeTravel webhook workflow",
      ],
    },
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isDemo = url.searchParams.get("demo") === "1";

  if (isDemo) {
    return NextResponse.json(buildDemo());
  }

  // Real mode — stitch together live data where available
  const metaToken = process.env.META_ADS_ACCESS_TOKEN;
  const metaAccountId = process.env.META_ADS_ACCOUNT_ID;
  const googleConfigured = Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_ADS_CLIENT_ID);
  const wetravelToken = process.env.WETRAVEL_API_TOKEN;
  const n8nUrl = process.env.N8N_INSTANCE_URL;

  const response = {
    demo: false,
    updated: new Date().toISOString(),
    kpis: {
      active_visitors: 0,
      mtd_spend: 0,
      mtd_revenue: 0,
      mtd_bookings: 0,
      mtd_conversions: 0,
      avg_roas: 0,
    },
    spend_series: [],
    ads: {
      meta: {
        configured: Boolean(metaToken && metaAccountId),
        setup: !metaToken
          ? "Set META_ADS_ACCESS_TOKEN and META_ADS_ACCOUNT_ID env vars. Get a system-user long-lived token from business.facebook.com → Business Settings → Users → System Users."
          : null,
      },
      google: {
        configured: googleConfigured,
        setup: !googleConfigured
          ? "Set GOOGLE_ADS_DEVELOPER_TOKEN + GOOGLE_ADS_CLIENT_ID + GOOGLE_ADS_CLIENT_SECRET + GOOGLE_ADS_REFRESH_TOKEN env vars. See Google Ads API OAuth 2.0 guide."
          : null,
      },
      tiktok: {
        configured: false,
        setup: "TikTok Ads API requires a Business Center account + app review. Low priority for Month 1.",
      },
    },
    bookings: {
      configured: Boolean(wetravelToken),
      setup: !wetravelToken
        ? "Set WETRAVEL_API_TOKEN env var. Pro plan required for API + webhook access."
        : null,
      upcoming: [],
      next_group: null,
    },
    performance_comp: {
      mtd_sales: 0,
      commission_3pct_mtd: 0,
      group_trips_this_season: 0,
      group_commission_ytd: 0,
      initial_term_total_estimate: 0,
    },
    outreach: {
      tier1: { sent: 0, opened: 0, replied: 0, published: 0, total: 14 },
      tier2: { submitted: 0, replied: 0, published: 0, total: 30 },
    },
    n8n: {
      instance_url: n8nUrl ?? null,
      configured: Boolean(n8nUrl),
      setup: !n8nUrl
        ? "8 workflow JSONs are authored at n8n/workflows/. Spin up n8n (Hetzner Docker — see n8n/README.md), set N8N_INSTANCE_URL, then import each JSON via Workflows → Import."
        : null,
      workflows: [
        { name: "01 — WeTravel booking → Telegram alert", status: "json-ready", priority: "critical" },
        { name: "02 — WeTravel booking → Meta Conversions API", status: "json-ready", priority: "critical" },
        { name: "03 — WeTravel booking → Firestore + commission", status: "json-ready", priority: "critical" },
        { name: "04 — Instagram comment 'BOOK' → auto-DM", status: "json-ready", priority: "high" },
        { name: "05 — Daily 7am briefing email (Mazatlán)", status: "json-ready", priority: "high" },
        { name: "06 — 10-guest departure trigger (10% bonus)", status: "json-ready", priority: "critical" },
        { name: "07 — Contact form → Telegram lead alert", status: "json-ready", priority: "high" },
        { name: "08 — Negative review watchdog (6h poll)", status: "json-ready", priority: "medium" },
      ],
      receivers: [
        { name: "/api/n8n/firestore-write", status: "deployed", purpose: "Firestore writes for bookings/leads/reviews" },
        { name: "/api/n8n/daily-briefing", status: "deployed", purpose: "Aggregates yesterday's bookings + ad spend" },
        { name: "/api/n8n/departure-headcount", status: "deployed", purpose: "10-guest threshold detection" },
        { name: "/api/n8n/recent-reviews", status: "deployed", purpose: "Google + TripAdvisor review polling" },
      ],
    },
    phase: {
      current: "Phase 0 — Lock-In",
      next_actions: [
        "Collect WeTravel trip URLs from the Bajablue team",
        "Confirm WeTravel plan level (Pro unlocks API)",
        "Get Meta Ads system-user token",
        "Complete Google Ads OAuth",
        "Embed WeTravel CTAs on 3 tour pages",
        "Install toprank MCP",
        "Stand up n8n instance",
        "Send first Tier 1 outreach batch",
      ],
    },
  };

  return NextResponse.json(response);
}
