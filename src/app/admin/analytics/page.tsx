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
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type MetricRow = { x: string; y: number };

type Stats = {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  comparison?: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
  };
};

type Response =
  | { configured: false; message: string; setupSteps: string[] }
  | {
      configured: true;
      days: number;
      unit: "day" | "hour";
      stats: Stats | null;
      pageviews: { pageviews: MetricRow[]; sessions: MetricRow[] } | null;
      active: { visitors: number } | null;
      metrics: Record<string, MetricRow[]>;
    };

const TEAL = "#4A9DB2";
const TEAL_DIM = "rgba(74,157,178,0.15)";
const CREAM = "#FFF9F0";
const AMBER = "#FBBF24";
const CORAL = "#F472B6";
const PURPLE = "#C084FC";
const GRAY = "rgba(228,238,240,0.15)";

const DOUGHNUT_PALETTE = [TEAL, CREAM, AMBER, CORAL, PURPLE, "#36859A", "#E4EEF0", "#C8754F"];

export default function AnalyticsPage() {
  const [data, setData] = useState<Response | null>(null);
  const [days, setDays] = useState(7);
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
    const qs = new URLSearchParams({ days: String(days), ...(demo ? { demo: "1" } : {}) });
    fetch(`/api/analytics?${qs}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [days, demo]);

  useEffect(() => {
    if (!data || (data as { configured: boolean }).configured !== true) return;
    const interval = setInterval(() => {
      const qs = new URLSearchParams({ days: String(days), ...(demo ? { demo: "1" } : {}) });
      fetch(`/api/analytics?${qs}`).then((r) => r.json()).then((d) => setData(d));
    }, 30000);
    return () => clearInterval(interval);
  }, [data, days, demo]);

  function toggleDemo() {
    const next = !demo;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("demo", "1");
    else url.searchParams.delete("demo");
    window.history.replaceState({}, "", url.toString());
    setDemo(next);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">ANALYTICS</h1>
        <p className="text-warm-white/40 text-sm font-body">Loading live data from Umami…</p>
      </div>
    );
  }

  if (data && data.configured === false) {
    return (
      <div>
        <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">ANALYTICS</h1>
        <p className="text-warm-white/40 text-sm font-body mb-8">Live visitor tracking · privacy-first · zero cookies</p>
        <GlassCard variant="warning" className="p-8">
          <h2 className="text-amber-400 text-base font-body font-medium mb-3">Umami not connected yet</h2>
          <p className="text-warm-white/60 text-sm font-body mb-6 leading-relaxed">{data.message}</p>
          <ol className="space-y-2 text-sm font-body text-warm-white/70">
            {data.setupSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-teal-light font-medium flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </GlassCard>
      </div>
    );
  }

  if (!data || !data.configured) return null;

  const stats = data.stats;
  const pageviewsSeries = data.pageviews?.pageviews ?? [];
  const sessionsSeries = data.pageviews?.sessions ?? [];

  const timeLabels = pageviewsSeries.map((p) =>
    data.unit === "hour"
      ? new Date(p.x).toLocaleTimeString(undefined, { hour: "numeric" })
      : new Date(p.x).toLocaleDateString(undefined, { month: "short", day: "numeric" })
  );

  const lineData = {
    labels: timeLabels,
    datasets: [
      {
        label: "Pageviews",
        data: pageviewsSeries.map((p) => p.y),
        borderColor: TEAL,
        backgroundColor: (ctx: { chart: ChartJS }) => {
          const c = ctx.chart.ctx;
          const g = c.createLinearGradient(0, 0, 0, 300);
          g.addColorStop(0, "rgba(74,157,178,0.4)");
          g.addColorStop(1, "rgba(74,157,178,0)");
          return g;
        },
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: TEAL,
        fill: true,
      },
      {
        label: "Visitors",
        data: sessionsSeries.map((p) => p.y),
        borderColor: CREAM,
        backgroundColor: "rgba(255,249,240,0.06)",
        borderWidth: 1.5,
        borderDash: [4, 4],
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: CREAM,
        fill: false,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          color: "rgba(228,238,240,0.5)",
          font: { size: 10, family: "'Inter Tight', sans-serif" },
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,40,50,0.98)",
        borderColor: "rgba(54,133,154,0.3)",
        borderWidth: 1,
        titleColor: CREAM,
        titleFont: { size: 11, family: "'Inter Tight', sans-serif", weight: 500 },
        bodyColor: "rgba(228,238,240,0.8)",
        bodyFont: { size: 11, family: "'Inter Tight', sans-serif" },
        padding: 10,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(228,238,240,0.4)", font: { size: 10 } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(74,157,178,0.08)" },
        ticks: { color: "rgba(228,238,240,0.4)", font: { size: 10 }, precision: 0 },
        border: { display: false },
        beginAtZero: true,
      },
    },
  };

  const makeDoughnut = (rows: MetricRow[], title: string) => {
    const top = rows.slice(0, 6);
    return {
      title,
      data: {
        labels: top.map((r) => r.x || "(none)"),
        datasets: [
          {
            data: top.map((r) => r.y),
            backgroundColor: DOUGHNUT_PALETTE,
            borderColor: "#0F2832",
            borderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
    };
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(228,238,240,0.65)",
          font: { size: 10, family: "'Inter Tight', sans-serif" },
          boxWidth: 10,
          boxHeight: 10,
          padding: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15,40,50,0.98)",
        borderColor: "rgba(54,133,154,0.3)",
        borderWidth: 1,
        titleColor: CREAM,
        bodyColor: "rgba(228,238,240,0.8)",
        padding: 10,
        callbacks: {
          label: (ctx) => {
            const total = (ctx.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
            const v = ctx.parsed as number;
            const pct = total > 0 ? ((v / total) * 100).toFixed(1) : "0";
            return ` ${ctx.label}: ${v.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  const barOptions = (horizontal = false): ChartOptions<"bar"> => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15,40,50,0.98)",
        borderColor: "rgba(54,133,154,0.3)",
        borderWidth: 1,
        titleColor: CREAM,
        bodyColor: "rgba(228,238,240,0.8)",
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: horizontal ? "rgba(74,157,178,0.08)" : "transparent" },
        ticks: { color: "rgba(228,238,240,0.5)", font: { size: 10 } },
        border: { display: false },
        beginAtZero: true,
      },
      y: {
        grid: { color: horizontal ? "transparent" : "rgba(74,157,178,0.08)" },
        ticks: { color: "rgba(228,238,240,0.65)", font: { size: 10 } },
        border: { display: false },
        beginAtZero: true,
      },
    },
  });

  const bounceRate = stats && stats.visits > 0 ? ((stats.bounces / stats.visits) * 100).toFixed(1) : "0";
  const avgSessionSec = stats && stats.visits > 0 ? Math.round(stats.totaltime / stats.visits) : 0;
  const pagesPerSession = stats && stats.visits > 0 ? (stats.pageviews / stats.visits).toFixed(2) : "0";

  const topPages = data.metrics.url ?? [];
  const topReferrers = data.metrics.referrer ?? [];
  const topEvents = data.metrics.event ?? [];
  const topUtm = data.metrics.utm_source ?? [];
  const topCountries = data.metrics.country ?? [];
  const topCities = data.metrics.city ?? [];

  const countryBar = {
    labels: topCountries.slice(0, 8).map((c) => c.x),
    datasets: [
      {
        label: "Visitors",
        data: topCountries.slice(0, 8).map((c) => c.y),
        backgroundColor: "rgba(74,157,178,0.7)",
        borderColor: TEAL,
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };

  const hasData = (stats?.pageviews ?? 0) > 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`h-2 w-2 rounded-full animate-pulse ${demo ? "bg-amber-400" : "bg-teal-light"}`} />
            <p className={`text-[10px] font-body tracking-[0.3em] uppercase ${demo ? "text-amber-400" : "text-teal-light"}`}>
              {demo ? "Demo Data · Preview Mode" : "Live · Umami Cloud"}
            </p>
          </div>
          <h1 className="text-display text-warm-white text-3xl tracking-wide mb-1">ANALYTICS</h1>
          <p className="text-warm-white/40 text-sm font-body">
            {demo ? "Fake data for preview only. Click below to return to live." : "Privacy-first visitor tracking · auto-refreshes every 30s"}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleDemo}
            className={`text-[10px] font-body px-3 py-1.5 rounded-sm tracking-wider uppercase transition-colors border ${
              demo
                ? "bg-amber-400/20 text-amber-400 border-amber-400/40"
                : "bg-white/[0.03] text-warm-white/50 border-teal/20 hover:text-warm-white/80"
            }`}
          >
            {demo ? "Exit Demo" : "Show Demo Data"}
          </button>
          <div className="flex gap-2">
          {[1, 7, 14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`text-[10px] font-body px-3 py-1.5 rounded-sm tracking-wider uppercase transition-colors ${
                days === d
                  ? "bg-teal/30 text-teal-light border border-teal/40"
                  : "bg-white/[0.03] text-warm-white/40 border border-teal/10 hover:text-warm-white/70"
              }`}
            >
              {d === 1 ? "24h" : `${d}d`}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Live row: active visitors + top-line */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <GlassCard variant="stat" className="p-5 relative overflow-hidden lg:col-span-1">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-light animate-pulse" />
            <span className="text-teal-light text-[9px] font-body tracking-widest uppercase">Now</span>
          </div>
          <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Active</p>
          <p className="text-display text-5xl text-teal-light relative z-10">{data.active?.visitors ?? 0}</p>
          <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">on site right now</p>
        </GlassCard>
        <MetricCard label="Pageviews" value={stats?.pageviews ?? 0} prev={stats?.comparison?.pageviews} />
        <MetricCard label="Visitors" value={stats?.visitors ?? 0} prev={stats?.comparison?.visitors} />
        <MetricCard label="Sessions" value={stats?.visits ?? 0} prev={stats?.comparison?.visits} />
        <MetricCard label="Bounce Rate" value={Number(bounceRate)} suffix="%" invertColor />
        <MetricCard label="Avg Session" value={avgSessionSec} suffix="s" />
      </div>

      {/* Supplementary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MiniStat label="Pages per session" value={pagesPerSession} />
        <MiniStat label="Total time on site" value={`${Math.round((stats?.totaltime ?? 0) / 60)} min`} />
        <MiniStat label="Unique referrers" value={topReferrers.length} />
        <MiniStat label="Countries reached" value={topCountries.length} />
      </div>

      {/* Traffic over time */}
      <GlassCard className="p-6 mb-6">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-warm-white text-sm font-body font-medium">Traffic over time</h2>
          <p className="text-warm-white/30 text-[10px] font-body tracking-wider uppercase">
            Grouped by {data.unit}
          </p>
        </div>
        <div className="h-[280px]">
          {hasData ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <EmptyChart message="No pageviews yet — traffic appears here as soon as visitors hit the site." />
          )}
        </div>
      </GlassCard>

      {/* Audience doughnuts */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Device</h3>
          <div className="h-[220px]">
            {data.metrics.device?.length ? (
              <Doughnut data={makeDoughnut(data.metrics.device, "Device").data} options={doughnutOptions} />
            ) : (
              <EmptyChart message="No device data yet" />
            )}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Browser</h3>
          <div className="h-[220px]">
            {data.metrics.browser?.length ? (
              <Doughnut data={makeDoughnut(data.metrics.browser, "Browser").data} options={doughnutOptions} />
            ) : (
              <EmptyChart message="No browser data yet" />
            )}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Operating system</h3>
          <div className="h-[220px]">
            {data.metrics.os?.length ? (
              <Doughnut data={makeDoughnut(data.metrics.os, "OS").data} options={doughnutOptions} />
            ) : (
              <EmptyChart message="No OS data yet" />
            )}
          </div>
        </GlassCard>
      </div>

      {/* Geography */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Top countries</h3>
          <div className="h-[260px]">
            {topCountries.length ? (
              <Bar data={countryBar} options={barOptions(false)} />
            ) : (
              <EmptyChart message="Visitor countries will populate as traffic arrives" />
            )}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Top cities</h3>
          <RankedList rows={topCities.slice(0, 10)} emptyMsg="No city data yet" />
        </GlassCard>
      </div>

      {/* Content + Referrers */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Top pages</h3>
          <RankedList rows={topPages.slice(0, 10)} emptyMsg="No page data yet" />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Top referrers</h3>
          <RankedList rows={topReferrers.slice(0, 10)} fallback="Direct / typed" emptyMsg="No referrers yet" />
        </GlassCard>
      </div>

      {/* Language + UTM + Events */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Language</h3>
          <RankedList rows={(data.metrics.language ?? []).slice(0, 8)} emptyMsg="No language data yet" />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">UTM sources</h3>
          <RankedList rows={topUtm.slice(0, 8)} emptyMsg="No UTM-tagged traffic yet" />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-warm-white text-sm font-body font-medium mb-4">Events</h3>
          <RankedList rows={topEvents.slice(0, 8)} emptyMsg="No custom events yet" />
        </GlassCard>
      </div>

      <p className="text-warm-white/30 text-[10px] font-body tracking-wider uppercase text-center mt-8">
        Live from Umami Cloud · Updates every 30 seconds · {new Date().toLocaleString()}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  prev,
  invertColor = false,
  suffix = "",
}: {
  label: string;
  value: number;
  prev?: number;
  invertColor?: boolean;
  suffix?: string;
}) {
  const change = prev === undefined ? 0 : value - prev;
  const isUp = change > 0;
  const isFlat = change === 0;
  const good = invertColor ? !isUp : isUp;
  const color = isFlat ? "text-warm-white/40" : good ? "text-teal-light" : "text-red-400/70";
  return (
    <GlassCard variant="stat" className="p-5">
      <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">{label}</p>
      <p className="text-display text-3xl text-warm-white relative z-10">
        {typeof value === "number" ? value.toLocaleString() : value}
        {suffix}
      </p>
      <p className={`text-xs font-body mt-1 relative z-10 ${color}`}>
        {prev === undefined
          ? "\u00A0"
          : isFlat
          ? "— no change"
          : `${isUp ? "▲" : "▼"} ${Math.abs(change).toLocaleString()} vs prev`}
      </p>
    </GlassCard>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-card p-4 rounded-sm">
      <p className="text-warm-white/30 text-[9px] font-body tracking-[0.3em] uppercase mb-2">{label}</p>
      <p className="text-warm-white text-xl font-body font-light">{value}</p>
    </div>
  );
}

function RankedList({ rows, fallback, emptyMsg }: { rows: MetricRow[]; fallback?: string; emptyMsg?: string }) {
  if (!rows.length) {
    return <p className="text-warm-white/30 text-xs font-body">{emptyMsg ?? "No data yet"}</p>;
  }
  const max = Math.max(...rows.map((r) => r.y), 1);
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.x} className="relative">
          <div className="flex items-center justify-between text-sm font-body py-1.5 relative z-10">
            <span className="text-warm-white/80 truncate mr-3">{r.x || fallback || "(none)"}</span>
            <span className="text-teal-light flex-shrink-0">{r.y.toLocaleString()}</span>
          </div>
          <div
            className="absolute left-0 top-0 bottom-0 bg-teal/10 rounded-sm transition-all"
            style={{ width: `${(r.y / max) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center text-center">
      <p className="text-warm-white/30 text-xs font-body max-w-xs">{message}</p>
    </div>
  );
}
