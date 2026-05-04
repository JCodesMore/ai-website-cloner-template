import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type MCPRequest = {
  jsonrpc: "2.0";
  id: number | string;
  method: string;
  params?: Record<string, unknown>;
};

const TOOLS = [
  {
    name: "get_site_scores",
    description: "Get current SEO and AI Search visibility scores for Bajablue Tours, plus historical timeline.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_pages",
    description: "List all 12 pages on bajablue.mx with their status, sections, and last-updated date.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_tours",
    description: "Get all three tour offerings (Ocean Safari, Blue Expedition, Master Seafari) with pricing, duration, season, and what's included.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_analytics_summary",
    description: "Get last-7-days website analytics: pageviews, unique visitors, top pages, top referrers (requires UMAMI_API_KEY).",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "number", description: "Number of days to look back (default 7, max 30)" },
      },
    },
  },
  {
    name: "get_instagram_stats",
    description: "Get current Instagram follower count + last 5 posts with engagement (requires INSTAGRAM_ACCESS_TOKEN).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_recent_reviews",
    description: "Get the most recent 5 Google reviews for Bajablue with sentiment labels.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "How many reviews (default 5)" },
      },
    },
  },
];

const SITE_SCORES = {
  seo: { current: 89, baseline: 12, source: "internal audit" },
  ai_search: { current: 70, baseline: 0, source: "GEO audit (llms.txt, AI crawler directives)" },
  schema_types: 10,
  issues_fixed: 49,
  issues_total: 62,
  timeline: [
    { phase: "Squarespace baseline", score: 12 },
    { phase: "New Next.js site", score: 62 },
    { phase: "SEO fixes", score: 76 },
    { phase: "AI Search optimization", score: 82 },
    { phase: "Schema markup", score: 86 },
    { phase: "Content & H1s", score: 89 },
  ],
};

const TOURS = [
  {
    name: "Ocean Safari",
    slug: "ocean-safari",
    duration: "6 hours",
    price: "$3,000 Mexican Pesos per person",
    season: "Year-round",
    description: "Day trip to Cerralvo Island — snorkel with mobula rays, dolphins, seasonal megafauna.",
  },
  {
    name: "Blue Expedition",
    slug: "blue-expedition",
    duration: "3 water days · 4 nights · 5 days",
    price: "$35,000 Mexican Pesos per person",
    season: "Seasonal",
    description: "Three full days on the water plus boutique hostel stay with all meals included.",
  },
  {
    name: "Master Seafari",
    slug: "master-seafari",
    duration: "5 water days · 6 nights · 7 days",
    price: "$54,000 Mexican Pesos per person",
    season: "April – June",
    description: "The flagship — 5 days on the water for serious nature lovers and ocean travelers.",
  },
];

const PAGES = [
  { path: "/", name: "Homepage", status: "built" },
  { path: "/tours", name: "Tours Hub", status: "built" },
  { path: "/tours/ocean-safari", name: "Ocean Safari", status: "built" },
  { path: "/tours/blue-expedition", name: "Blue Expedition", status: "built" },
  { path: "/tours/master-seafari", name: "Master Seafari", status: "built" },
  { path: "/gallery", name: "Gallery", status: "built" },
  { path: "/about", name: "About", status: "built" },
  { path: "/accommodations", name: "Accommodations", status: "built" },
  { path: "/faq", name: "FAQ", status: "built" },
  { path: "/contact", name: "Contact", status: "built" },
  { path: "/privacy", name: "Privacy Policy", status: "built" },
  { path: "/terms", name: "Terms of Service", status: "built" },
];

const cleanEnv = (value?: string) => value?.replace(/\\n/g, "").trim();

async function fetchUmamiSummary(days: number) {
  const apiUrl = cleanEnv(process.env.UMAMI_API_URL);
  const apiKey = cleanEnv(process.env.UMAMI_API_KEY);
  const siteId = cleanEnv(process.env.UMAMI_WEBSITE_ID);
  if (!apiUrl || !apiKey || !siteId) {
    return { error: "Umami not configured. Set UMAMI_API_URL, UMAMI_API_KEY, UMAMI_WEBSITE_ID." };
  }
  const now = Date.now();
  const startAt = now - days * 86400000;
  const base = apiUrl.replace(/\/$/, "");
  const pathPrefix = base.includes("umami.is") ? "/v1" : "/api";
  const res = await fetch(`${base}${pathPrefix}/websites/${siteId}/stats?startAt=${startAt}&endAt=${now}`, {
    headers: { "x-umami-api-key": apiKey },
    cache: "no-store",
  });
  if (!res.ok) return { error: `Umami API returned ${res.status}` };
  return res.json();
}

async function fetchInstagramStats() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!token || !accountId) {
    return { error: "Instagram not configured. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID." };
  }
  const fields = "followers_count,media_count,name,username";
  const res = await fetch(`https://graph.facebook.com/v19.0/${accountId}?fields=${fields}&access_token=${token}`);
  if (!res.ok) return { error: `Instagram API returned ${res.status}` };
  return res.json();
}

async function fetchRecentReviews(limit: number) {
  const storeUrl = process.env.REVIEWS_STORE_URL || "";
  if (!storeUrl) {
    return { error: "Reviews cache not configured. Reviews appear here after first cron run." };
  }
  try {
    const res = await fetch(storeUrl);
    if (!res.ok) return { error: `Reviews cache returned ${res.status}` };
    const data = await res.json();
    return Array.isArray(data?.reviews) ? { reviews: data.reviews.slice(0, limit) } : { reviews: [] };
  } catch (e) {
    return { error: `Failed to fetch reviews: ${String(e)}` };
  }
}

async function handleToolCall(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "get_site_scores":
      return SITE_SCORES;
    case "list_pages":
      return PAGES;
    case "get_tours":
      return TOURS;
    case "get_analytics_summary":
      return fetchUmamiSummary(Math.min(Number(args.days) || 7, 30));
    case "get_instagram_stats":
      return fetchInstagramStats();
    case "get_recent_reviews":
      return fetchRecentReviews(Math.min(Number(args.limit) || 5, 20));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function GET() {
  return NextResponse.json({
    name: "bajablue-mcp",
    version: "1.0.0",
    description: "MCP server exposing live Bajablue dashboard data (scores, pages, tours, analytics, social, reviews).",
    tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
    protocol: "mcp/1.0",
    connect: "POST JSON-RPC 2.0 requests to this endpoint. Methods: initialize, tools/list, tools/call.",
  });
}

export async function POST(req: NextRequest) {
  let body: MCPRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400 }
    );
  }

  const { id, method, params } = body;

  if (method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "bajablue-mcp", version: "1.0.0" },
      },
    });
  }

  if (method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS },
    });
  }

  if (method === "tools/call") {
    const toolName = (params?.name as string) || "";
    const toolArgs = (params?.arguments as Record<string, unknown>) || {};
    try {
      const result = await handleToolCall(toolName, toolArgs);
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          isError: false,
        },
      });
    } catch (e) {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: `Error: ${String(e)}` }],
          isError: true,
        },
      });
    }
  }

  return NextResponse.json(
    { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } },
    { status: 404 }
  );
}
