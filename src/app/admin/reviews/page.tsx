"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/admin/GlassCard";

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  source: "google" | "tripadvisor" | "facebook" | "manual";
  sentiment?: {
    score: number;
    comparative: number;
    label: "positive" | "negative" | "neutral";
    topics: string[];
  };
};

type ReviewsResponse = {
  reviews: Review[];
  summary: {
    total: number;
    avgRating: number;
    byLabel: { positive: number; neutral: number; negative: number };
    positivePct: number;
    topTopics: { topic: string; count: number }[];
  };
};

const sentimentColor: Record<string, string> = {
  positive: "bg-teal/20 text-teal-light border-teal/30",
  neutral: "bg-white/[0.06] text-warm-white/50 border-white/10",
  negative: "bg-red-400/15 text-red-400 border-red-400/30",
};

const sourceLabel: Record<string, string> = {
  google: "Google",
  tripadvisor: "TripAdvisor",
  facebook: "Facebook",
  manual: "Manual",
};

export default function ReviewsPage() {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    author: "",
    rating: 5,
    text: "",
    date: new Date().toISOString().slice(0, 10),
    source: "google" as Review["source"],
  });

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/reviews");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addReview() {
    if (!form.text.trim()) return;
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews: [form] }),
    });
    setForm({ author: "", rating: 5, text: "", date: new Date().toISOString().slice(0, 10), source: "google" });
    setShowForm(false);
    refresh();
  }

  async function removeReview(id: string) {
    await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
    refresh();
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">REVIEWS</h1>
        <p className="text-warm-white/40 text-sm font-body">Loading…</p>
      </div>
    );
  }

  const summary = data?.summary;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">REVIEWS</h1>
          <p className="text-warm-white/40 text-sm font-body">AI sentiment + topic tagging across all sources</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-coral text-deep px-5 py-2 text-xs font-body tracking-[0.2em] uppercase rounded-sm"
        >
          + Add Review
        </button>
      </div>

      {/* Summary cards */}
      {summary && summary.total > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard variant="stat" className="p-5">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Total Reviews</p>
            <p className="text-display text-3xl text-warm-white relative z-10">{summary.total}</p>
          </GlassCard>
          <GlassCard variant="stat" className="p-5">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Average Rating</p>
            <p className="text-display text-3xl text-warm-white relative z-10">
              {summary.avgRating.toFixed(1)} <span className="text-amber-400 text-xl">★</span>
            </p>
          </GlassCard>
          <GlassCard variant="stat" className="p-5">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Positive Sentiment</p>
            <p className="text-display text-3xl text-teal-light relative z-10">{summary.positivePct}%</p>
          </GlassCard>
          <GlassCard variant="stat" className="p-5">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Top Topic</p>
            <p className="text-display text-2xl text-warm-white relative z-10 capitalize">
              {summary.topTopics[0]?.topic ?? "—"}
            </p>
            <p className="text-warm-white/30 text-xs font-body mt-1 relative z-10">
              {summary.topTopics[0] ? `${summary.topTopics[0].count} mentions` : "No data yet"}
            </p>
          </GlassCard>
        </div>
      )}

      {/* Topic chips */}
      {summary && summary.topTopics.length > 0 && (
        <GlassCard className="p-5 mb-8">
          <h3 className="text-warm-white text-sm font-body font-medium mb-3">Most-mentioned topics</h3>
          <div className="flex flex-wrap gap-2">
            {summary.topTopics.map((t) => (
              <span
                key={t.topic}
                className="text-xs font-body bg-teal/10 text-teal-light border border-teal/20 px-3 py-1.5 rounded-sm capitalize"
              >
                {t.topic} · {t.count}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Add review form */}
      {showForm && (
        <GlassCard className="p-6 mb-8">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Add a review</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Author name"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="bg-white/[0.05] border border-teal/20 text-warm-white py-2 px-3 text-sm font-body outline-none rounded-sm"
            />
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value as Review["source"] })}
              className="bg-white/[0.05] border border-teal/20 text-warm-white py-2 px-3 text-sm font-body outline-none rounded-sm"
            >
              <option value="google">Google</option>
              <option value="tripadvisor">TripAdvisor</option>
              <option value="facebook">Facebook</option>
              <option value="manual">Manual</option>
            </select>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="bg-white/[0.05] border border-teal/20 text-warm-white py-2 px-3 text-sm font-body outline-none rounded-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-white/[0.05] border border-teal/20 text-warm-white py-2 px-3 text-sm font-body outline-none rounded-sm"
            />
          </div>
          <textarea
            placeholder="Review text…"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={4}
            className="w-full bg-white/[0.05] border border-teal/20 text-warm-white py-2 px-3 text-sm font-body outline-none rounded-sm mb-4"
          />
          <div className="flex gap-3">
            <button onClick={addReview} className="bg-teal text-deep px-5 py-2 text-xs font-body tracking-[0.2em] uppercase rounded-sm">
              Save & analyze
            </button>
            <button onClick={() => setShowForm(false)} className="text-warm-white/40 text-xs font-body">
              Cancel
            </button>
          </div>
        </GlassCard>
      )}

      {/* Reviews list */}
      {data?.reviews.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-warm-white/40 text-sm font-body">No reviews yet.</p>
          <p className="text-warm-white/30 text-xs font-body mt-2">Once Google Business verification is complete, reviews auto-sync here with sentiment + topic tagging.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {data?.reviews.map((r) => (
            <GlassCard key={r.id} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-warm-white text-sm font-body font-medium">{r.author}</p>
                  <p className="text-warm-white/40 text-xs font-body">
                    {sourceLabel[r.source]} · {r.date}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-amber-400 text-sm">{"★".repeat(r.rating)}<span className="text-warm-white/20">{"★".repeat(5 - r.rating)}</span></span>
                  {r.sentiment && (
                    <span className={`text-[10px] font-body px-2 py-1 rounded-sm uppercase tracking-wider border ${sentimentColor[r.sentiment.label]}`}>
                      {r.sentiment.label}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-warm-white/70 text-sm font-body leading-relaxed">{r.text}</p>
              {r.sentiment && r.sentiment.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {r.sentiment.topics.map((t) => (
                    <span key={t} className="text-[10px] font-body bg-white/[0.04] text-warm-white/50 px-2 py-0.5 rounded-sm capitalize">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => removeReview(r.id)}
                className="text-warm-white/20 hover:text-red-400/70 text-[10px] font-body mt-3 tracking-wider uppercase"
              >
                Remove
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
