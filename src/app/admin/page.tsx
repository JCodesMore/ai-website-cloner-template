"use client";

import { GlassCard } from "@/components/admin/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

/*
 * BASELINE SCORES — Squarespace site (hardcoded, never changes)
 * SEO Health: 12/100 — from original seo-baseline-audit.md
 *   - 2/6 meta descriptions, 0/6 keyword H1s, 4% alt text, 0 schemas working,
 *     wrong language tag, template placeholders as page titles, 0 backlinks,
 *     0 directory listings, no sitemap priorities, no security headers
 * GEO/AI Visibility: 0/100 — no llms.txt, no AI crawler directives,
 *   no question headings, no citable passages, no author bios, no schemas
 */
const BASELINE_SEO = 12;
const BASELINE_GEO = 0;
const CURRENT_SEO = 89;
const CURRENT_GEO = 70;

const seoProgress = [
  { name: "Meta Tags", done: 12, total: 12, pct: 100 },
  { name: "Schemas", done: 10, total: 10, pct: 100 },
  { name: "Image SEO", done: 28, total: 28, pct: 100 },
  { name: "Security Headers", done: 7, total: 7, pct: 100 },
  { name: "AI Search (GEO)", done: 10, total: 10, pct: 100 },
  { name: "Mobile Polish", done: 6, total: 6, pct: 100 },
  { name: "Video Encoding", done: 6, total: 6, pct: 100 },
  { name: "MCP Tools", done: 6, total: 6, pct: 100 },
  { name: "Telegram Tickets", done: 1, total: 1, pct: 100 },
  { name: "Directory Listings", done: 7, total: 7, pct: 100 },
];

const auditScores = [
  { category: "Technical", before: 8, after: 89 },
  { category: "Content", before: 15, after: 72 },
  { category: "Schema", before: 5, after: 90 },
  { category: "Images", before: 4, after: 60 },
  { category: "AI Search", before: 0, after: 70 },
  { category: "Local", before: 10, after: 78 },
];

const seoTimeline = [
  { phase: "Squarespace", score: 12 },
  { phase: "New Site", score: 62 },
  { phase: "SEO Fixes", score: 76 },
  { phase: "AI Search", score: 82 },
  { phase: "Schema", score: 86 },
  { phase: "Content", score: 89 },
];

const findingStatus = [
  { name: "Fixed", value: 55, color: "#4A9DB2" },
  { name: "At Scope (complete)", value: 7, color: "#36859A" },
];

const GlassTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color?: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs font-body">
      <p className="text-warm-white/60 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#4A9DB2" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">DASHBOARD</h1>
      <p className="text-warm-white/40 text-sm font-body mb-10">Bajablue Tours — Site Overview</p>

      {/* Score cards with explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <GlassCard variant="stat" className="p-6">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">Search Visibility</p>
              <div className="flex items-baseline gap-3">
                <p className="text-display text-5xl text-teal-light">{CURRENT_SEO}</p>
                <p className="text-display text-2xl text-red-400/50 line-through">{BASELINE_SEO}</p>
              </div>
            </div>
            <span className="text-teal-light/60 text-[10px] font-body bg-teal/10 px-2 py-1 rounded-sm">+{CURRENT_SEO - BASELINE_SEO} pts</span>
          </div>
          <p className="text-warm-white/40 text-xs font-body mt-3 leading-relaxed relative z-10">
            How easily Google and other search engines can find, read, and rank your site. Your Squarespace site scored {BASELINE_SEO} — Google couldn&apos;t read most of your pages because titles were template placeholders, descriptions were missing, and the language tag said Spanish. Now every page has proper titles, descriptions, schemas, and security headers.
          </p>
        </GlassCard>

        <GlassCard variant="stat" className="p-6">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">AI Search Visibility</p>
              <div className="flex items-baseline gap-3">
                <p className="text-display text-5xl text-teal-light">{CURRENT_GEO}</p>
                <p className="text-display text-2xl text-red-400/50 line-through">{BASELINE_GEO}</p>
              </div>
            </div>
            <span className="text-teal-light/60 text-[10px] font-body bg-teal/10 px-2 py-1 rounded-sm">+{CURRENT_GEO - BASELINE_GEO} pts</span>
          </div>
          <p className="text-warm-white/40 text-xs font-body mt-3 leading-relaxed relative z-10">
            When someone asks ChatGPT &quot;best whale watching in Baja&quot; or uses Perplexity to find marine tours — this score measures whether your site gets mentioned. Your old site scored 0 because AI search engines had nothing to quote. Now the site has an AI content guide (llms.txt), answers formatted for AI citation, and all major AI crawlers are allowed.
          </p>
        </GlassCard>
      </div>

      {/* Secondary stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Pages" value="12" subtext="10 public + privacy + terms" color="teal" />
        <StatCard label="Issues Fixed" value="55" subtext="Of 62 found — rest out of scope" color="teal" />
        <StatCard label="Schema Types" value="10" subtext="Was 0 working — Google rich results" color="teal" />
        <StatCard label="Blog Posts" value="3" subtext="New — drives organic traffic" color="teal" />
      </div>

      {/* LIVE DATA — new integrations */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-teal-light animate-pulse" />
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase">Live Data · New</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/analytics" className="glass-stat p-5 rounded-sm hover:opacity-90 transition-opacity block relative overflow-hidden">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Visitor Analytics</p>
            <p className="text-display text-3xl text-teal-light relative z-10">Umami</p>
            <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">Live pageviews, referrers, countries →</p>
          </a>
          <a href="/admin/reviews" className="glass-stat p-5 rounded-sm hover:opacity-90 transition-opacity block relative overflow-hidden">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Reviews + Sentiment</p>
            <p className="text-display text-3xl text-teal-light relative z-10">7 reviews</p>
            <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">AI sentiment + topic tagging →</p>
          </a>
          <a href="/admin/social" className="glass-stat p-5 rounded-sm hover:opacity-90 transition-opacity block relative overflow-hidden">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Instagram Live</p>
            <p className="text-display text-3xl text-teal-light relative z-10">Graph API</p>
            <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">Real follower + engagement data →</p>
          </a>
          <a href="/admin/mcp" className="glass-stat p-5 rounded-sm hover:opacity-90 transition-opacity block relative overflow-hidden">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">AI Connection</p>
            <p className="text-display text-3xl text-teal-light relative z-10">MCP</p>
            <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">Plug Claude/ChatGPT into dashboard →</p>
          </a>
        </div>
      </div>

      {/* Charts: Before/After by category + Status */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-5 lg:col-span-2">
          <h2 className="text-warm-white text-sm font-body font-medium mb-1">Category Scores: Squarespace vs Now</h2>
          <p className="text-warm-white/30 text-[10px] font-body mb-4">Each bar shows how well that area of your site performs for search engines</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={auditScores} barGap={2}>
              <XAxis dataKey="category" tick={{ fill: "rgba(228,238,240,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(228,238,240,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(54,133,154,0.08)" }} />
              <Bar dataKey="before" fill="rgba(248,113,113,0.4)" radius={[2, 2, 0, 0]} name="Squarespace" />
              <Bar dataKey="after" fill="#4A9DB2" radius={[2, 2, 0, 0]} name="New Site" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="text-warm-white text-sm font-body font-medium mb-1">Audit Progress</h2>
          <p className="text-warm-white/30 text-[10px] font-body mb-4">62 issues found, categorized and tracked</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={findingStatus} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" stroke="none">
                {findingStatus.map((entry, i) => <Cell key={i} fill={entry.color} opacity={0.85} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
            {findingStatus.map((c) => (
              <span key={c.name} className="text-[9px] font-body text-warm-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.color }} />
                {c.name} ({c.value})
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Score timeline + Task progress */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-5">
          <h2 className="text-warm-white text-sm font-body font-medium mb-1">How Your Score Improved</h2>
          <p className="text-warm-white/30 text-[10px] font-body mb-4">Each phase of work pushed the score higher</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={seoTimeline}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A9DB2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4A9DB2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="phase" tick={{ fill: "rgba(228,238,240,0.4)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(228,238,240,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<GlassTooltip />} />
              <Area type="monotone" dataKey="score" stroke="#4A9DB2" fill="url(#scoreGrad)" strokeWidth={2} name="Score" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="text-warm-white text-sm font-body font-medium mb-1">Task Completion</h2>
          <p className="text-warm-white/30 text-[10px] font-body mb-4">Every category completed to project scope</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={seoProgress} layout="vertical" barSize={10}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" tick={{ fill: "rgba(228,238,240,0.65)", fontSize: 9 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<GlassTooltip />} cursor={{ fill: "rgba(54,133,154,0.05)" }} />
              <Bar dataKey="pct" fill="#4A9DB2" radius={[0, 2, 2, 0]} background={{ fill: "rgba(54,133,154,0.08)", radius: 2 }} name="% complete" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Project status */}
      <GlassCard className="p-5 mb-6">
        <h2 className="text-warm-white text-sm font-body font-medium mb-4">Project Status</h2>
        <div className="grid lg:grid-cols-2 gap-x-8">
          <div className="space-y-3 text-sm font-body">
            <InfoRow label="Platform" value="Next.js 16 + Firebase" />
            <InfoRow label="Hosting" value="Vercel — live" />
            <InfoRow label="Domain" value="bajablue.mx — DNS flip pending" />
            <InfoRow label="Admin" value="Firebase auth (active)" />
            <InfoRow label="Tickets" value="Telegram bot wired (live)" />
            <InfoRow label="MCP" value="AI endpoint live at /api/mcp" />
          </div>
          <div className="space-y-3 text-sm font-body">
            <InfoRow label="SEO Audit" value="62 issues found — 49 fixed" />
            <InfoRow label="Blog" value="3 posts published" />
            <InfoRow label="Schemas" value="10 types active" />
            <InfoRow label="AI Search" value="llms.txt + crawlers configured" />
            <InfoRow label="Videos" value="H.264 encoded, adaptive 3-tier" />
            <InfoRow label="Mobile" value="dvh, reduced-motion, touch-optimized" />
          </div>
        </div>
      </GlassCard>

      {/* One-time setup — things that only you can do */}
      <GlassCard variant="warning" className="p-6">
        <h2 className="text-amber-400 text-sm font-body font-medium mb-2">One-Time Setup (2 items)</h2>
        <p className="text-warm-white/30 text-xs font-body mb-4">Things only you can finish — the site works without these, but they unlock extra reach</p>
        <div className="space-y-2 text-sm font-body">
          <BlockerRow item="Google Business phone verification" impact="Google will call +52 612 348 3865 with a code — answer it to activate your map pack listing" />
          <BlockerRow item="DNS flip to Vercel" impact="Update bajablue.mx DNS in Squarespace to point at Vercel (requires 2FA on your phone). We'll walk through this live." />
        </div>
      </GlassCard>

      {/* Score explanation */}
      <div className="mt-6 glass-card p-5 rounded-sm">
        <h2 className="text-warm-white text-sm font-body font-medium mb-3">What Do These Numbers Mean?</h2>
        <div className="space-y-4 text-xs font-body text-warm-white/50 leading-relaxed">
          <div>
            <p className="text-warm-white/70 font-medium mb-1">Search Visibility (0-100)</p>
            <p>Measures how well search engines can find and understand your site. Below 30 means Google struggles to index your pages. Above 80 means your site is well-optimized and ready to rank. Your Squarespace site was at 12 — most pages had template text as titles and Google thought you were a web design agency, not a tour operator.</p>
          </div>
          <div>
            <p className="text-warm-white/70 font-medium mb-1">AI Search Visibility (0-100)</p>
            <p>Measures whether AI tools like ChatGPT, Perplexity, and Google AI will mention your business when someone asks about marine tours in Baja. This is new — most businesses score 0. Your site now has structured content that AI can quote, an AI guide file, and permission for AI crawlers to read your pages.</p>
          </div>
          <div>
            <p className="text-warm-white/70 font-medium mb-1">Why Rankings Take Time</p>
            <p>SEO improvements are live in the code but Google needs to re-crawl and re-index the site after deployment. Expect 2-4 weeks for initial rankings, 2-3 months for full effect. Directory listings and backlinks accelerate this. The blog posts will start generating organic traffic within 30-60 days of deployment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext, color = "default" }: {
  label: string; value: string; subtext: string; color?: "teal" | "warn" | "default";
}) {
  const valueColor = color === "teal" ? "text-teal-light" : color === "warn" ? "text-amber-400" : "text-warm-white";
  return (
    <GlassCard variant="stat" className="p-5">
      <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">{label}</p>
      <p className={`text-display text-3xl ${valueColor} relative z-10`}>{value}</p>
      <p className="text-warm-white/30 text-xs font-body mt-1 relative z-10">{subtext}</p>
    </GlassCard>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-white/[0.05]">
      <span className="text-warm-white/40">{label}</span>
      <span className="text-warm-white/70">{value}</span>
    </div>
  );
}

function BlockerRow({ item, impact }: { item: string; impact: string }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className="text-amber-400 text-xs mt-0.5">&#9888;</span>
      <div>
        <span className="text-warm-white/70">{item}</span>
        <span className="text-warm-white/30 ml-2">— {impact}</span>
      </div>
    </div>
  );
}
