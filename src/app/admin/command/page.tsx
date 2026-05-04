"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/admin/GlassCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

type CommandData = {
  demo: boolean;
  updated: string;
  kpis: {
    active_visitors: number;
    mtd_spend: number;
    mtd_revenue: number;
    mtd_bookings: number;
    mtd_conversions: number;
    avg_roas: number;
  };
  spend_series: Array<{ date: string; meta: number; google: number; tiktok: number }>;
  ads: {
    meta: AdPlatform;
    google: AdPlatform;
    tiktok: AdPlatform;
  };
  bookings: {
    configured?: boolean;
    setup?: string | null;
    upcoming: Array<{ id: string; guest: string; tour: string; date: string; guests: number; revenue: number; source: string }>;
    next_group: { tour: string; date: string; confirmed_guests: number; target_guests: number } | null;
  };
  performance_comp: {
    mtd_sales: number;
    commission_3pct_mtd: number;
    group_trips_this_season: number;
    group_commission_ytd: number;
    initial_term_total_estimate: number;
  };
  outreach: {
    tier1: { sent: number; opened: number; replied: number; published: number; total: number };
    tier2: { submitted: number; replied: number; published: number; total: number };
  };
  n8n: {
    instance_url: string | null;
    configured?: boolean;
    setup?: string | null;
    workflows: Array<{ name: string; status: string; priority: string }>;
    receivers?: Array<{ name: string; status: string; purpose: string }>;
  };
  phase: {
    current: string;
    next_actions: string[];
  };
};

type AdPlatform = {
  configured: boolean;
  setup?: string | null;
  spend?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  cpm?: number;
  cpc?: number;
  cpa?: number;
  roas?: number;
  top_campaigns?: Array<{
    id: string;
    platform: string;
    name: string;
    status: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
};

const TEAL = "#4A9DB2";
const CREAM = "#FFF9F0";
const AMBER = "#FBBF24";
const CORAL = "#F472B6";

const CLAUDE_PROMPTS = [
  {
    title: "Weekly report",
    prompt:
      "Using the meta-ads, toprank, and google-ads-mcp MCPs, pull the last 7 days of Bajablue ad performance. Return a client-ready summary: total spend, total bookings, CPA, ROAS, top 3 creatives, worst 3, and 3 recommended actions.",
  },
  {
    title: "Audit underperformers",
    prompt:
      "Find all Google Ads keywords with CPA > 2x target, and Meta ads with CPM in the top 90th percentile but zero conversions in 14 days. List them with pause recommendations.",
  },
  {
    title: "Draft new creative",
    prompt:
      "Pull top 5 Meta Reels via pipeboard. Identify hook patterns, pacing, CTA style. Draft 3 new Reel scripts: shot list + on-screen text + voiceover.",
  },
  {
    title: "Launch multi-platform campaign",
    prompt:
      "Using adspirer, build Google + Meta + TikTok campaign for Master Seafari. Target: US+Canada adventure travelers 35-60. Budget: $60/day combined. Return structure before creating live.",
  },
];

export default function CommandPage() {
  const [data, setData] = useState<CommandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDemo(params.get("demo") === "1");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const qs = demo ? "?demo=1" : "";
    fetch(`/api/command${qs}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [demo]);

  function toggleDemo() {
    const next = !demo;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("demo", "1");
    else url.searchParams.delete("demo");
    window.history.replaceState({}, "", url.toString());
    setDemo(next);
  }

  function copyPrompt(prompt: string) {
    navigator.clipboard.writeText(prompt);
  }

  if (loading || !data) {
    return (
      <div>
        <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">COMMAND CENTER</h1>
        <p className="text-warm-white/40 text-sm font-body">Loading live data…</p>
      </div>
    );
  }

  const spendChart = {
    labels: data.spend_series.map((d) =>
      new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    ),
    datasets: [
      {
        label: "Meta",
        data: data.spend_series.map((d) => d.meta),
        borderColor: TEAL,
        backgroundColor: "rgba(74,157,178,0.12)",
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Google",
        data: data.spend_series.map((d) => d.google),
        borderColor: CREAM,
        backgroundColor: "rgba(255,249,240,0.06)",
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "TikTok",
        data: data.spend_series.map((d) => d.tiktok),
        borderColor: CORAL,
        backgroundColor: "rgba(244,114,182,0.06)",
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const chartOpts: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: { color: "rgba(228,238,240,0.55)", font: { size: 10 }, boxWidth: 8, boxHeight: 8, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: "rgba(15,40,50,0.98)",
        borderColor: "rgba(54,133,154,0.3)",
        borderWidth: 1,
        titleColor: CREAM,
        bodyColor: "rgba(228,238,240,0.85)",
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: $${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "rgba(228,238,240,0.4)", font: { size: 10 } }, border: { display: false } },
      y: {
        grid: { color: "rgba(74,157,178,0.08)" },
        ticks: { color: "rgba(228,238,240,0.4)", font: { size: 10 }, callback: (v) => `$${v}` },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  const outreachProgress = (done: number, total: number) =>
    total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`h-2 w-2 rounded-full animate-pulse ${demo ? "bg-amber-400" : "bg-teal-light"}`} />
            <p className={`text-[10px] font-body tracking-[0.3em] uppercase ${demo ? "text-amber-400" : "text-teal-light"}`}>
              {demo ? "Demo data · preview" : `Live · ${data.phase.current}`}
            </p>
          </div>
          <h1 className="text-display text-warm-white text-3xl tracking-wide mb-1">COMMAND CENTER</h1>
          <p className="text-warm-white/40 text-sm font-body">
            Every live system for Bajablue in one place — ads, bookings, revenue, outreach, automation.
          </p>
        </div>
        <button
          onClick={toggleDemo}
          className={`text-[10px] font-body px-3 py-1.5 rounded-sm tracking-wider uppercase border self-start ${
            demo
              ? "bg-amber-400/20 text-amber-400 border-amber-400/40"
              : "bg-white/[0.03] text-warm-white/50 border-teal/20 hover:text-warm-white/80"
          }`}
        >
          {demo ? "Exit Demo" : "Show Demo Data"}
        </button>
      </div>

      {/* TOP ROW — 6 KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Active now" value={data.kpis.active_visitors} color="teal" pulse />
        <KpiCard label="MTD Spend" value={`$${data.kpis.mtd_spend.toLocaleString()}`} />
        <KpiCard label="MTD Revenue" value={`$${data.kpis.mtd_revenue.toLocaleString()}`} color="teal" />
        <KpiCard label="Bookings MTD" value={data.kpis.mtd_bookings} />
        <KpiCard label="Conversions" value={data.kpis.mtd_conversions} />
        <KpiCard label="Avg ROAS" value={`${data.kpis.avg_roas}x`} color="teal" />
      </div>

      {/* SPEND CHART */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-warm-white text-sm font-body font-medium">Cross-platform ad spend · last 14 days</h2>
          <p className="text-warm-white/30 text-[10px] font-body tracking-wider uppercase">Meta · Google · TikTok</p>
        </div>
        <div className="h-[240px]">
          <Line data={spendChart} options={chartOpts} />
        </div>
      </GlassCard>

      {/* AD PLATFORMS ROW */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <AdPlatformCard platform="Meta Ads" color={TEAL} data={data.ads.meta} mcp="pipeboard-meta · adspirer" />
        <AdPlatformCard platform="Google Ads" color={CREAM} data={data.ads.google} mcp="toprank · google-ads-official" />
        <AdPlatformCard platform="TikTok Ads" color={CORAL} data={data.ads.tiktok} mcp="adspirer" />
      </div>

      {/* BOOKINGS + PERFORMANCE COMP */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-warm-white text-sm font-body font-medium">Upcoming WeTravel departures</h2>
            <span className="text-warm-white/30 text-[10px] font-body tracking-wider uppercase">
              {data.bookings.configured === false ? "Webhook pending" : "Live"}
            </span>
          </div>
          {data.bookings.upcoming.length === 0 ? (
            <EmptyState
              message={data.bookings.setup ?? "Bookings will populate here once WeTravel webhook is connected to /api/webhooks/wetravel."}
            />
          ) : (
            <div className="space-y-2">
              {data.bookings.upcoming.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between py-2 border-b border-white/[0.04] text-sm"
                >
                  <div>
                    <p className="text-warm-white font-medium">{b.guest}</p>
                    <p className="text-warm-white/40 text-xs">
                      {b.tour} · {b.date} · {b.guests} {b.guests === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-light font-medium">${b.revenue.toLocaleString()}</p>
                    <p className="text-warm-white/30 text-[10px] uppercase tracking-wider">{b.source}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.bookings.next_group && (
            <div className="mt-6 bg-teal/10 border border-teal/20 p-4 rounded-sm">
              <p className="text-teal-light text-[10px] font-body tracking-[0.2em] uppercase mb-1">Next group trip (your 10%)</p>
              <p className="text-warm-white text-base font-body">
                {data.bookings.next_group.tour} · {data.bookings.next_group.date}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 bg-deep/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-teal-light"
                    style={{ width: `${(data.bookings.next_group.confirmed_guests / data.bookings.next_group.target_guests) * 100}%` }}
                  />
                </div>
                <p className="text-warm-white/60 text-xs font-body tabular-nums">
                  {data.bookings.next_group.confirmed_guests} / {data.bookings.next_group.target_guests}
                </p>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-warm-white text-sm font-body font-medium mb-4">Performance cut</h2>
          <div className="space-y-4">
            <PerfRow label="3% of sales · MTD" value={`$${data.performance_comp.commission_3pct_mtd.toLocaleString()}`} />
            <PerfRow label="10% on group trips · YTD" value={`$${data.performance_comp.group_commission_ytd.toLocaleString()}`} />
            <PerfRow label="Group trips completed" value={String(data.performance_comp.group_trips_this_season)} />
            <div className="h-px bg-white/[0.08] my-2" />
            <PerfRow
              label="Initial Term estimate"
              value={`$${data.performance_comp.initial_term_total_estimate.toLocaleString()}`}
              accent
            />
          </div>
        </GlassCard>
      </div>

      {/* OUTREACH + N8N ROW */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-6">
          <h2 className="text-warm-white text-sm font-body font-medium mb-4">Outreach pipeline</h2>
          <div className="space-y-5">
            <OutreachRow
              tier="Tier 1 · Bloggers + regional"
              sent={data.outreach.tier1.sent}
              replied={data.outreach.tier1.replied}
              published={data.outreach.tier1.published}
              total={data.outreach.tier1.total}
              progress={outreachProgress(data.outreach.tier1.sent, data.outreach.tier1.total)}
            />
            <OutreachRow
              tier="Tier 2 · Premium publications"
              sent={data.outreach.tier2.submitted}
              replied={data.outreach.tier2.replied}
              published={data.outreach.tier2.published}
              total={data.outreach.tier2.total}
              progress={outreachProgress(data.outreach.tier2.submitted, data.outreach.tier2.total)}
              label="Submitted"
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-warm-white text-sm font-body font-medium">n8n workflows</h2>
            <span
              className={`text-[10px] font-body tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
                data.n8n.configured
                  ? "bg-teal/15 text-teal-light border-teal/30"
                  : "bg-white/[0.04] text-warm-white/40 border-white/10"
              }`}
            >
              {data.n8n.configured ? "Instance live" : "Not configured"}
            </span>
          </div>
          {data.n8n.setup && (
            <p className="text-warm-white/50 text-xs font-body mb-3 italic">{data.n8n.setup}</p>
          )}
          <div className="space-y-2">
            {data.n8n.workflows.map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/[0.04] text-sm"
              >
                <span className="text-warm-white/75">{w.name}</span>
                <span className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
                      w.priority === "critical"
                        ? "bg-red-400/15 text-red-400 border-red-400/30"
                        : w.priority === "high"
                        ? "bg-amber-400/15 text-amber-400 border-amber-400/30"
                        : "bg-teal/10 text-teal-light border-teal/20"
                    }`}
                  >
                    {w.priority}
                  </span>
                  <span
                    className={`text-[9px] font-body tracking-widest uppercase ${
                      w.status === "json-ready"
                        ? "text-teal-light"
                        : w.status === "active"
                        ? "text-emerald-400"
                        : "text-warm-white/40"
                    }`}
                  >
                    {w.status.replace("-", " ")}
                  </span>
                </span>
              </div>
            ))}
          </div>
          {data.n8n.receivers && data.n8n.receivers.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-warm-white/50 text-[10px] font-body tracking-[0.3em] uppercase mb-3">
                bajablue.mx receiver endpoints
              </p>
              <div className="space-y-1.5">
                {data.n8n.receivers.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <code className="text-teal-light font-mono">{r.name}</code>
                    <span
                      className={`text-[9px] font-body tracking-widest uppercase px-1.5 py-0.5 rounded-sm border ${
                        r.status === "deployed"
                          ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                          : "bg-white/[0.04] text-warm-white/40 border-white/10"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* CLAUDE PROMPTS */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-warm-white text-sm font-body font-medium mb-1">Claude prompt shortcuts</h2>
        <p className="text-warm-white/40 text-xs font-body mb-4">
          Copy any prompt into Claude Desktop — each runs through the MCPs installed from the Ad Tool Stack.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {CLAUDE_PROMPTS.map((p) => (
            <div
              key={p.title}
              className="flex items-start justify-between gap-3 p-3 bg-white/[0.03] border border-teal/10 rounded-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-warm-white text-sm font-medium font-body mb-1">{p.title}</p>
                <p className="text-warm-white/50 text-xs font-body leading-relaxed line-clamp-2">{p.prompt}</p>
              </div>
              <button
                onClick={() => copyPrompt(p.prompt)}
                className="text-[9px] font-body tracking-widest uppercase bg-teal/20 text-teal-light hover:bg-teal/30 px-2 py-1 rounded-sm flex-shrink-0"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* PHASE / NEXT UP */}
      <GlassCard variant="warning" className="p-6">
        <h2 className="text-amber-400 text-sm font-body font-medium mb-2">Next actions · {data.phase.current}</h2>
        <ol className="space-y-2">
          {data.phase.next_actions.map((a, i) => (
            <li key={i} className="flex gap-3 text-sm font-body text-warm-white/75">
              <span className="text-teal-light font-medium flex-shrink-0">{i + 1}.</span>
              <span>{a}</span>
            </li>
          ))}
        </ol>
      </GlassCard>

      <p className="text-warm-white/30 text-[10px] font-body tracking-widest uppercase text-center mt-8">
        Updated {new Date(data.updated).toLocaleString()}
      </p>
    </div>
  );
}

function KpiCard({
  label,
  value,
  color = "default",
  pulse = false,
}: {
  label: string;
  value: string | number;
  color?: "default" | "teal";
  pulse?: boolean;
}) {
  return (
    <GlassCard variant="stat" className="p-5">
      <div className="flex items-start justify-between relative z-10">
        <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">{label}</p>
        {pulse && <span className="h-1.5 w-1.5 rounded-full bg-teal-light animate-pulse mt-1" />}
      </div>
      <p className={`text-display text-3xl relative z-10 ${color === "teal" ? "text-teal-light" : "text-warm-white"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </GlassCard>
  );
}

function AdPlatformCard({
  platform,
  color,
  data,
  mcp,
}: {
  platform: string;
  color: string;
  data: AdPlatform;
  mcp: string;
}) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-warm-white text-sm font-body font-medium">{platform}</h3>
        <span
          className={`text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-sm border ${
            data.configured
              ? "bg-teal/15 text-teal-light border-teal/30"
              : "bg-white/[0.04] text-warm-white/40 border-white/10"
          }`}
        >
          {data.configured ? "Connected" : "Not connected"}
        </span>
      </div>

      {data.setup && !data.configured ? (
        <EmptyState message={data.setup} small />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Metric label="Spend" value={`$${(data.spend ?? 0).toLocaleString()}`} />
            <Metric label="Conv." value={String(data.conversions ?? 0)} />
            <Metric label="CPA" value={data.cpa ? `$${data.cpa}` : "—"} />
            <Metric label="ROAS" value={data.roas ? `${data.roas}x` : "—"} color={color} />
          </div>
          {(data.top_campaigns ?? []).length > 0 && (
            <>
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">Top campaigns</p>
              <div className="space-y-1.5">
                {data.top_campaigns!.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs font-body">
                    <span className="text-warm-white/75 truncate mr-2">{c.name}</span>
                    <span className="text-teal-light flex-shrink-0">{c.conversions} conv</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <p className="text-warm-white/30 text-[9px] font-body tracking-widest uppercase mt-4 pt-3 border-t border-white/[0.05]">
        via {mcp}
      </p>
    </GlassCard>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-warm-white/40 text-[9px] font-body tracking-[0.2em] uppercase">{label}</p>
      <p className="text-warm-white text-lg font-body font-light mt-0.5" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}

function PerfRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm font-body">
      <span className="text-warm-white/55">{label}</span>
      <span className={`font-medium ${accent ? "text-teal-light text-lg" : "text-warm-white"}`}>{value}</span>
    </div>
  );
}

function OutreachRow({
  tier,
  sent,
  replied,
  published,
  total,
  progress,
  label = "Sent",
}: {
  tier: string;
  sent: number;
  replied: number;
  published: number;
  total: number;
  progress: number;
  label?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-warm-white/80 text-sm font-body font-medium">{tier}</p>
        <p className="text-warm-white/40 text-xs font-body">
          {sent} / {total}
        </p>
      </div>
      <div className="bg-deep/60 rounded-full h-1.5 overflow-hidden mb-3">
        <div className="h-full bg-teal-light" style={{ width: `${progress}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs font-body">
        <OutreachStat label={label} value={sent} />
        <OutreachStat label="Replied" value={replied} accent />
        <OutreachStat label="Published" value={published} accent />
      </div>
    </div>
  );
}

function OutreachStat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.05] rounded-sm p-2 text-center">
      <p className={`text-lg font-body font-light ${accent ? "text-teal-light" : "text-warm-white"}`}>{value}</p>
      <p className="text-warm-white/40 text-[9px] font-body tracking-widest uppercase mt-0.5">{label}</p>
    </div>
  );
}

function EmptyState({ message, small = false }: { message: string; small?: boolean }) {
  return (
    <div className={`text-center ${small ? "py-6" : "py-10"}`}>
      <p className={`text-warm-white/35 font-body ${small ? "text-xs" : "text-sm"} leading-relaxed max-w-md mx-auto`}>
        {message}
      </p>
    </div>
  );
}
