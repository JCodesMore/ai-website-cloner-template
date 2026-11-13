import type { NextRequest } from "next/server";
import { isBot, recordPageview } from "@/lib/server/analytics";

const text = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");

/** Pageview beacon from the public site (see components/sites/showlanka/analytics.tsx). */
export async function POST(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (isBot(ua) || request.headers.get("purpose") === "prefetch") return new Response(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const path = text(body.path, 300);
  if (!path.startsWith("/") || path.startsWith("/admin")) return new Response(null, { status: 204 });

  let referrerHost = "";
  try {
    const host = new URL(text(body.referrer, 500)).hostname;
    if (host !== request.nextUrl.hostname) referrerHost = host;
  } catch {}

  const h = request.headers;
  // Analytics is best-effort: no database → drop the pageview.
  try {
    recordPageview({
      path,
      referrerHost,
      utmSource: text(body.utm_source),
      utmMedium: text(body.utm_medium),
      utmCampaign: text(body.utm_campaign),
      country: h.get("cf-ipcountry") || h.get("x-vercel-ip-country") || h.get("x-country-code") || "",
      ua,
      ip: h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "",
    });
  } catch {}
  return new Response(null, { status: 204 });
}
