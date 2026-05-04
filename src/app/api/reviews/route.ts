import { NextRequest, NextResponse } from "next/server";
import Sentiment from "sentiment";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  source: "google" | "tripadvisor" | "facebook" | "manual";
  sentiment?: { score: number; comparative: number; label: "positive" | "negative" | "neutral"; topics: string[] };
};

const sentiment = new Sentiment();

const DATA_DIR = "/tmp/bajablue-reviews";
const DATA_FILE = path.join(DATA_DIR, "reviews.json");

const TOPIC_KEYWORDS = {
  orcas: /\borc(a|as)\b|\bkiller whales?\b/i,
  whales: /\b(humpback|blue whale|gray whale|sperm whale|whale)s?\b/i,
  mobulas: /\bmobula|\bmanta|\bray(s)?\b/i,
  guide: /\bguide\b|\bcrew\b|\bfounder\b|\bteam\b/i,
  food: /\blunch\b|\bfood\b|\bsnack(s)?\b|\bdrink(s)?\b|\bmeal\b/i,
  boat: /\bboat\b|\bpanga\b|\bvessel\b/i,
  hostel: /\bhostel\b|\bstay\b|\broom\b|\baccommodation\b/i,
  experience: /\bexperience\b|\btrip\b|\btour\b|\bday\b/i,
  media: /\bphoto(s|graphy)?\b|\bvideo\b|\bfootage\b/i,
  safety: /\bsafe\b|\bsafety\b|\blife jacket\b/i,
};

function detectTopics(text: string): string[] {
  return Object.entries(TOPIC_KEYWORDS)
    .filter(([, rx]) => rx.test(text))
    .map(([k]) => k);
}

function analyzeReview(review: Review): Review {
  const result = sentiment.analyze(review.text);
  const label: "positive" | "negative" | "neutral" =
    result.score > 1 ? "positive" : result.score < -1 ? "negative" : "neutral";
  return {
    ...review,
    sentiment: {
      score: result.score,
      comparative: Number(result.comparative.toFixed(3)),
      label,
      topics: detectTopics(review.text),
    },
  };
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function loadReviews(): Promise<Review[]> {
  if (!existsSync(DATA_FILE)) return [];
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveReviews(reviews: Review[]) {
  await ensureDataDir();
  await writeFile(DATA_FILE, JSON.stringify(reviews, null, 2), "utf-8");
}

export async function GET() {
  const reviews = await loadReviews();
  const analyzed = reviews.map(analyzeReview);

  const total = analyzed.length;
  const avgRating = total ? analyzed.reduce((s, r) => s + r.rating, 0) / total : 0;
  const byLabel = {
    positive: analyzed.filter((r) => r.sentiment?.label === "positive").length,
    neutral: analyzed.filter((r) => r.sentiment?.label === "neutral").length,
    negative: analyzed.filter((r) => r.sentiment?.label === "negative").length,
  };
  const topicCounts: Record<string, number> = {};
  analyzed.forEach((r) =>
    (r.sentiment?.topics ?? []).forEach((t) => {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    })
  );
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([topic, count]) => ({ topic, count }));

  return NextResponse.json({
    reviews: analyzed.sort((a, b) => (a.date < b.date ? 1 : -1)),
    summary: {
      total,
      avgRating: Number(avgRating.toFixed(2)),
      byLabel,
      positivePct: total ? Math.round((byLabel.positive / total) * 100) : 0,
      topTopics,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.reviews)) {
    return NextResponse.json({ ok: false, error: "Expected { reviews: Review[] }" }, { status: 400 });
  }

  const existing = await loadReviews();
  const incoming: Review[] = body.reviews.map((r: Partial<Review>) => ({
    id: r.id || `${r.source || "manual"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: r.author || "Anonymous",
    rating: typeof r.rating === "number" ? r.rating : 5,
    text: r.text || "",
    date: r.date || new Date().toISOString().slice(0, 10),
    source: (r.source as Review["source"]) || "manual",
  }));

  const merged = [...existing, ...incoming];
  const deduped = Array.from(new Map(merged.map((r) => [r.id, r])).values());
  await saveReviews(deduped);

  return NextResponse.json({ ok: true, count: deduped.length });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  const existing = await loadReviews();
  const filtered = existing.filter((r) => r.id !== id);
  await saveReviews(filtered);
  return NextResponse.json({ ok: true, count: filtered.length });
}
