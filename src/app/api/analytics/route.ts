import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const METRIC_TYPES = [
  "url",
  "referrer",
  "browser",
  "os",
  "device",
  "country",
  "region",
  "city",
  "language",
  "event",
  "title",
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;

const cleanEnv = (value?: string) => value?.replace(/\\n/g, "").trim();

function buildDemo(days: number) {
  const endAt = Date.now();
  const startAt = endAt - days * 86400000;
  const unit = days <= 2 ? "hour" : "day";
  const buckets = unit === "hour" ? days * 24 : days;

  const pageviewSeries: Array<{ x: string; y: number }> = [];
  const sessionSeries: Array<{ x: string; y: number }> = [];
  let pv = 0;
  let vs = 0;
  for (let i = 0; i < buckets; i++) {
    const t = new Date(startAt + ((endAt - startAt) * i) / buckets);
    const trend = 40 + i * 3 + Math.round(Math.sin(i / 2) * 20) + Math.round(Math.random() * 15);
    const sess = Math.round(trend * 0.7);
    pageviewSeries.push({ x: t.toISOString(), y: trend });
    sessionSeries.push({ x: t.toISOString(), y: sess });
    pv += trend;
    vs += sess;
  }

  return {
    configured: true,
    demo: true,
    days,
    unit,
    stats: {
      pageviews: pv,
      visitors: Math.round(vs * 0.8),
      visits: vs,
      bounces: Math.round(vs * 0.38),
      totaltime: vs * 142,
      comparison: {
        pageviews: Math.round(pv * 0.72),
        visitors: Math.round(vs * 0.65),
        visits: Math.round(vs * 0.7),
        bounces: Math.round(vs * 0.45),
        totaltime: Math.round(vs * 118),
      },
    },
    pageviews: { pageviews: pageviewSeries, sessions: sessionSeries },
    active: { visitors: 4 },
    metrics: {
      url: [
        { x: "/", y: Math.round(pv * 0.32) },
        { x: "/tours/master-seafari", y: Math.round(pv * 0.14) },
        { x: "/tours", y: Math.round(pv * 0.12) },
        { x: "/tours/ocean-safari", y: Math.round(pv * 0.11) },
        { x: "/gallery", y: Math.round(pv * 0.08) },
        { x: "/about", y: Math.round(pv * 0.07) },
        { x: "/accommodations", y: Math.round(pv * 0.06) },
        { x: "/tours/blue-expedition", y: Math.round(pv * 0.05) },
        { x: "/faq", y: Math.round(pv * 0.03) },
        { x: "/contact", y: Math.round(pv * 0.02) },
      ],
      referrer: [
        { x: "google.com", y: Math.round(vs * 0.41) },
        { x: "instagram.com", y: Math.round(vs * 0.22) },
        { x: "", y: Math.round(vs * 0.15) },
        { x: "facebook.com", y: Math.round(vs * 0.08) },
        { x: "tripadvisor.com", y: Math.round(vs * 0.06) },
        { x: "bing.com", y: Math.round(vs * 0.03) },
        { x: "t.co", y: Math.round(vs * 0.02) },
        { x: "reddit.com", y: Math.round(vs * 0.02) },
      ],
      browser: [
        { x: "Chrome", y: Math.round(vs * 0.54) },
        { x: "Safari", y: Math.round(vs * 0.29) },
        { x: "Edge", y: Math.round(vs * 0.08) },
        { x: "Firefox", y: Math.round(vs * 0.06) },
        { x: "Samsung Internet", y: Math.round(vs * 0.02) },
        { x: "Opera", y: Math.round(vs * 0.01) },
      ],
      os: [
        { x: "iOS", y: Math.round(vs * 0.38) },
        { x: "Android", y: Math.round(vs * 0.25) },
        { x: "macOS", y: Math.round(vs * 0.18) },
        { x: "Windows", y: Math.round(vs * 0.16) },
        { x: "Linux", y: Math.round(vs * 0.03) },
      ],
      device: [
        { x: "Mobile", y: Math.round(vs * 0.63) },
        { x: "Desktop", y: Math.round(vs * 0.31) },
        { x: "Tablet", y: Math.round(vs * 0.06) },
      ],
      country: [
        { x: "United States", y: Math.round(vs * 0.42) },
        { x: "Mexico", y: Math.round(vs * 0.18) },
        { x: "Canada", y: Math.round(vs * 0.11) },
        { x: "United Kingdom", y: Math.round(vs * 0.08) },
        { x: "Germany", y: Math.round(vs * 0.06) },
        { x: "Spain", y: Math.round(vs * 0.05) },
        { x: "France", y: Math.round(vs * 0.04) },
        { x: "Australia", y: Math.round(vs * 0.03) },
        { x: "Netherlands", y: Math.round(vs * 0.02) },
        { x: "Brazil", y: Math.round(vs * 0.01) },
      ],
      region: [],
      city: [
        { x: "Los Angeles", y: Math.round(vs * 0.12) },
        { x: "Mexico City", y: Math.round(vs * 0.09) },
        { x: "La Paz", y: Math.round(vs * 0.08) },
        { x: "San Diego", y: Math.round(vs * 0.07) },
        { x: "Austin", y: Math.round(vs * 0.06) },
        { x: "New York", y: Math.round(vs * 0.06) },
        { x: "Toronto", y: Math.round(vs * 0.05) },
        { x: "Seattle", y: Math.round(vs * 0.04) },
        { x: "London", y: Math.round(vs * 0.04) },
        { x: "Berlin", y: Math.round(vs * 0.03) },
      ],
      language: [
        { x: "en-US", y: Math.round(vs * 0.58) },
        { x: "es-MX", y: Math.round(vs * 0.19) },
        { x: "en-GB", y: Math.round(vs * 0.08) },
        { x: "es-ES", y: Math.round(vs * 0.06) },
        { x: "de", y: Math.round(vs * 0.04) },
        { x: "fr", y: Math.round(vs * 0.03) },
        { x: "pt-BR", y: Math.round(vs * 0.02) },
      ],
      event: [
        { x: "whatsapp_click", y: Math.round(vs * 0.19) },
        { x: "tour_cta_click", y: Math.round(vs * 0.14) },
        { x: "accommodation_booking_click", y: Math.round(vs * 0.08) },
        { x: "video_play", y: Math.round(vs * 0.06) },
        { x: "gallery_open", y: Math.round(vs * 0.05) },
      ],
      title: [
        { x: "Bajablue Tours | Marine Expeditions in the Sea of Cortez", y: Math.round(pv * 0.32) },
        { x: "Master Seafari — 7-Day Immersive Marine Expedition", y: Math.round(pv * 0.14) },
      ],
      utm_source: [
        { x: "instagram", y: Math.round(vs * 0.14) },
        { x: "facebook", y: Math.round(vs * 0.08) },
        { x: "newsletter", y: Math.round(vs * 0.04) },
        { x: "tripadvisor", y: Math.round(vs * 0.03) },
      ],
      utm_medium: [
        { x: "social", y: Math.round(vs * 0.22) },
        { x: "email", y: Math.round(vs * 0.04) },
        { x: "referral", y: Math.round(vs * 0.03) },
      ],
      utm_campaign: [
        { x: "spring_2026", y: Math.round(vs * 0.11) },
        { x: "orca_season", y: Math.round(vs * 0.07) },
        { x: "mobula_reels", y: Math.round(vs * 0.06) },
      ],
    },
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isDemo = url.searchParams.get("demo") === "1";
  const days = Math.min(Number(url.searchParams.get("days")) || 7, 90);

  if (isDemo) {
    return NextResponse.json(buildDemo(days));
  }

  const apiUrl = cleanEnv(process.env.UMAMI_API_URL);
  const apiKey = cleanEnv(process.env.UMAMI_API_KEY);
  const siteId = cleanEnv(process.env.UMAMI_WEBSITE_ID);

  if (!apiUrl || !apiKey || !siteId) {
    return NextResponse.json({
      configured: false,
      message: "Umami not configured. Set UMAMI_API_URL, UMAMI_API_KEY, UMAMI_WEBSITE_ID in Vercel env vars.",
      setupSteps: [
        "Sign up at https://cloud.umami.is (free — 10,000 events/month)",
        "Create a website for bajablue.mx",
        "Copy the Website ID from Settings → Websites",
        "Create an API key in Settings → API",
        "Add UMAMI_API_URL=https://api.umami.is, UMAMI_API_KEY=..., UMAMI_WEBSITE_ID=... to Vercel env vars",
        "Redeploy — tracking script auto-activates",
      ],
    });
  }

  const endAt = Date.now();
  const startAt = endAt - days * 86400000;
  const unit = days <= 2 ? "hour" : "day";

  const base = apiUrl.replace(/\/$/, "");
  const pathPrefix = base.includes("umami.is") ? "/v1" : "/api";
  const headers = { "x-umami-api-key": apiKey };
  const qs = `startAt=${startAt}&endAt=${endAt}`;

  async function fetchJson(path: string) {
    try {
      const r = await fetch(`${base}${pathPrefix}${path}`, { headers, cache: "no-store" });
      if (!r.ok) return null;
      return await r.json();
    } catch {
      return null;
    }
  }

  const [stats, pageviews, active, ...metricResults] = await Promise.all([
    fetchJson(`/websites/${siteId}/stats?${qs}`),
    fetchJson(`/websites/${siteId}/pageviews?${qs}&unit=${unit}`),
    fetchJson(`/websites/${siteId}/active`),
    ...METRIC_TYPES.map((type) => fetchJson(`/websites/${siteId}/metrics?${qs}&type=${type}&limit=15`)),
  ]);

  const metrics: Record<string, Array<{ x: string; y: number }>> = {};
  METRIC_TYPES.forEach((type, i) => {
    metrics[type] = Array.isArray(metricResults[i]) ? metricResults[i] : [];
  });

  return NextResponse.json({
    configured: true,
    days,
    unit,
    stats,
    pageviews,
    active,
    metrics,
  });
}
