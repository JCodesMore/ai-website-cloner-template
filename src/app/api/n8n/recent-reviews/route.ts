import { NextRequest, NextResponse } from "next/server";
import { verifyN8nIngress } from "@/lib/n8n/ingress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReviewsRequest = {
  window_hours?: number;
  sources?: string[];
  place_id?: string;
  tripadvisor_rss?: string;
};

type NormalizedReview = {
  source: "google" | "tripadvisor";
  rating: number;
  author: string;
  text: string;
  url: string;
  posted_at: string;
};

/**
 * Workflow 08 (negative review watchdog) polls this every 6 hours.
 * Aggregates reviews from Google Places + TripAdvisor RSS, filters to the
 * given time window, and returns a normalized array.
 *
 * Falls back to empty list when API keys / place IDs are missing — workflow
 * will then short-circuit to "no flagged reviews".
 */
export async function POST(req: NextRequest) {
  const unauthorized = verifyN8nIngress(req);
  if (unauthorized) return unauthorized;

  let body: ReviewsRequest;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const windowHours = body.window_hours ?? 6;
  const cutoff = Date.now() - windowHours * 60 * 60 * 1000;
  const placeId = body.place_id || process.env.GOOGLE_PLACE_ID;
  const tripadvisorRss = body.tripadvisor_rss || process.env.TRIPADVISOR_RSS_URL;
  const sources = body.sources || ["google", "tripadvisor"];

  const reviews: NormalizedReview[] = [];
  const errors: string[] = [];

  // ---- Google Reviews via Places API ----
  if (sources.includes("google")) {
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!googleApiKey || !placeId) {
      errors.push("Google Reviews skipped: GOOGLE_PLACES_API_KEY or place_id missing");
    } else {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews&key=${googleApiKey}`;
        const r = await fetch(url, { next: { revalidate: 0 } });
        if (r.ok) {
          const data = (await r.json()) as { result?: { reviews?: Array<Record<string, unknown>> } };
          for (const rev of data.result?.reviews || []) {
            const tsSec = parseInt(String(rev.time || 0), 10);
            const tsMs = tsSec * 1000;
            if (tsMs < cutoff) continue;
            reviews.push({
              source: "google",
              rating: parseInt(String(rev.rating || 0), 10),
              author: String(rev.author_name || "Anonymous"),
              text: String(rev.text || ""),
              url: String(rev.author_url || `https://search.google.com/local/reviews?placeid=${placeId}`),
              posted_at: new Date(tsMs).toISOString(),
            });
          }
        } else {
          errors.push(`Google Reviews HTTP ${r.status}`);
        }
      } catch (e) {
        errors.push(`Google Reviews fetch failed: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }
  }

  // ---- TripAdvisor RSS ----
  if (sources.includes("tripadvisor")) {
    if (!tripadvisorRss) {
      errors.push("TripAdvisor skipped: tripadvisor_rss URL missing");
    } else {
      try {
        const r = await fetch(tripadvisorRss, { next: { revalidate: 0 } });
        if (r.ok) {
          const xml = await r.text();
          const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
          for (const item of items) {
            const ratingMatch = item.match(/<ta:rating>(\d+)<\/ta:rating>/) || item.match(/(\d)\s*of\s*5/i);
            const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
            const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
            const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
            const authorMatch = item.match(/<author>([\s\S]*?)<\/author>/) || item.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/);

            if (!ratingMatch || !dateMatch) continue;
            const ts = new Date(dateMatch[1].trim()).getTime();
            if (ts < cutoff) continue;

            reviews.push({
              source: "tripadvisor",
              rating: parseInt(ratingMatch[1], 10),
              author: (authorMatch?.[1] || "Anonymous").trim().replace(/<\!\[CDATA\[|\]\]>/g, ""),
              text: (descMatch?.[1] || titleMatch?.[1] || "").trim().replace(/<\!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").slice(0, 500),
              url: (linkMatch?.[1] || "").trim(),
              posted_at: new Date(ts).toISOString(),
            });
          }
        } else {
          errors.push(`TripAdvisor RSS HTTP ${r.status}`);
        }
      } catch (e) {
        errors.push(`TripAdvisor RSS fetch failed: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    window_hours: windowHours,
    cutoff: new Date(cutoff).toISOString(),
    reviews,
    count: reviews.length,
    errors,
  });
}
