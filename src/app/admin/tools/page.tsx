"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/admin/GlassCard";

type ToolStatus = "not-installed" | "installed" | "connected" | "error";

type Tool = {
  slug: string;
  name: string;
  tagline: string;
  what: string;
  repo: string;
  stars?: number | string;
  license: string;
  platform: string;
  installCmd: string;
  configFile?: string;
  configSnippet?: string;
  docsUrl: string;
  capabilities: string[];
  bestFor: string;
};

const TOOLS: Tool[] = [
  {
    slug: "toprank",
    name: "toprank",
    tagline: "Google Ads + GSC + PageSpeed from Claude Code",
    what: "9 skills that let Claude query Google Search Console, PageSpeed Insights, and the Google Ads API — then push fixes directly. Writes, not read-only.",
    repo: "nowork-studio/toprank",
    license: "MIT",
    platform: "Claude Code plugin",
    installCmd: "claude plugin install github:nowork-studio/toprank",
    docsUrl: "https://github.com/nowork-studio/toprank",
    capabilities: [
      "Query Google Ads campaigns, keywords, ad groups",
      "Pause/adjust keywords, bids, budgets from Claude",
      "Pull GSC impressions + position data per page",
      "Run PageSpeed audits with one prompt",
      "Ship fixes directly from Claude Code",
    ],
    bestFor: "Google Ads + SEO work, day-to-day optimization",
  },
  {
    slug: "pipeboard-meta",
    name: "Pipeboard Meta Ads MCP",
    tagline: "AI-first Meta Ads analysis + management",
    what: "The most mature Meta Ads MCP. Query Facebook + Instagram campaigns, analyze creative performance, generate AI reports, adjust campaigns.",
    repo: "pipeboard-co/meta-ads-mcp",
    stars: 791,
    license: "BSL 1.1 → Apache 2.0 (2029)",
    platform: "Claude Desktop MCP",
    installCmd: "npx -y @pipeboard/meta-ads-mcp",
    configFile: "~/Library/Application Support/Claude/claude_desktop_config.json",
    configSnippet: JSON.stringify(
      {
        mcpServers: {
          "meta-ads": {
            command: "npx",
            args: ["-y", "@pipeboard/meta-ads-mcp"],
            env: { META_ACCESS_TOKEN: "<your-token>" },
          },
        },
      },
      null,
      2
    ),
    docsUrl: "https://github.com/pipeboard-co/meta-ads-mcp",
    capabilities: [
      "Read all Meta (Facebook + Instagram) ad accounts",
      "Campaign + ad set + ad-level analysis",
      "Creative asset performance breakdown",
      "AI-generated weekly reports",
      "Adjust budgets, pause underperformers",
    ],
    bestFor: "Deep Meta-only analysis, Reels ad optimization",
  },
  {
    slug: "adspirer",
    name: "adspirer-mcp-plugin",
    tagline: "91 tools across Google + Meta + TikTok + LinkedIn",
    what: "Cross-platform ad management plugin. 91 tools for keyword research, campaign creation, performance analysis across four platforms. The density play.",
    repo: "amekala/adspirer-mcp-plugin",
    license: "Open source",
    platform: "Claude Code plugin",
    installCmd: "claude plugin install github:amekala/adspirer-mcp-plugin",
    docsUrl: "https://github.com/amekala/adspirer-mcp-plugin",
    capabilities: [
      "Manage Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads from one plugin",
      "Keyword research across platforms",
      "Campaign creation (structured brief → ready-to-launch)",
      "Unified performance reporting",
      "Cross-platform budget reallocation",
    ],
    bestFor: "Running multi-platform campaigns from one brief",
  },
  {
    slug: "google-ads-official",
    name: "Google Ads MCP (official)",
    tagline: "Google's own read-only MCP — source of truth",
    what: "Google's open-sourced Google Ads API MCP server. Read-only, so can't modify campaigns — but it's the authoritative reference for cross-checking what toprank + adspirer are seeing.",
    repo: "google-marketing-solutions/google_ads_mcp",
    license: "Apache 2.0",
    platform: "Claude Desktop MCP (Python)",
    installCmd: "pip install google-ads-mcp",
    docsUrl: "https://github.com/google-marketing-solutions/google_ads_mcp",
    capabilities: [
      "Query all Google Ads data (campaigns, keywords, ad groups, assets)",
      "Run Google Ads Query Language (GAQL) from Claude",
      "Read-only — safe to run alongside write-capable MCPs",
      "Backed by Google, maintained officially",
    ],
    bestFor: "Sanity-check before making changes via write-capable MCPs",
  },
  {
    slug: "n8n",
    name: "n8n",
    tagline: "Self-hosted automation engine",
    what: "The glue for scheduled workflows. WeTravel booking → Meta Conversion API, daily budget checks, anomaly Telegram alerts, weekly report generation. Free, Docker-deployable, 100+ integrations.",
    repo: "n8n-io/n8n",
    license: "Fair-code (free for self-hosted)",
    platform: "Self-hosted Docker",
    installCmd: "docker run -it --rm -p 5678:5678 n8nio/n8n",
    docsUrl: "https://docs.n8n.io",
    capabilities: [
      "Scheduled workflows (hourly, daily, cron)",
      "Webhooks (WeTravel → Meta Conversion API)",
      "Telegram alerts on anomalies",
      "Connect any REST API to any other API",
      "Visual no-code workflow builder",
    ],
    bestFor: "The ONE platform that ties WeTravel bookings to Meta/Google optimization",
  },
];

const CLAUDE_PROMPTS = [
  {
    slug: "weekly-report",
    title: "Weekly report",
    prompt:
      "Using the meta-ads, toprank, and google-ads-mcp MCPs, pull the last 7 days of Bajablue ad performance. Return a client-ready summary: total spend, total bookings, CPA, ROAS, top 3 performing creatives, top 3 worst performers, and 3 recommended actions. Compare to the prior 7 days where possible.",
    tools: ["pipeboard-meta", "toprank", "google-ads-official"],
  },
  {
    slug: "audit-campaigns",
    title: "Campaign audit",
    prompt:
      "Audit every active campaign across Google Ads and Meta. Return a prioritized list: the 5 most urgent fixes (budget waste, keyword mismatches, creative fatigue, audience issues). For each, include estimated dollar impact and how to fix it. Use toprank for Google Ads and pipeboard for Meta.",
    tools: ["toprank", "pipeboard-meta"],
  },
  {
    slug: "pause-losers",
    title: "Pause underperformers",
    prompt:
      "Find all Google Ads keywords with CPA greater than 2x the campaign target, or Meta ads with CPM above the 90th percentile for the account with zero conversions in the last 14 days. List them, then pause the ones I approve using toprank (Google) or pipeboard (Meta).",
    tools: ["toprank", "pipeboard-meta"],
  },
  {
    slug: "draft-creative",
    title: "Draft new creative from top performers",
    prompt:
      "Pull the top 5 performing Meta Reels from the last 30 days via pipeboard. Identify what their hooks have in common (first 2 seconds), pacing, CTA style, hashtags. Draft 3 new Reel scripts that use the same formula but new wildlife angles from Bajablue: orca hunting, mobula aggregation, sperm whale encounter. Format as shot list + on-screen text + voiceover script.",
    tools: ["pipeboard-meta"],
  },
  {
    slug: "cross-check",
    title: "Cross-check Google Ads numbers",
    prompt:
      "Pull the same 7-day Google Ads performance using both toprank and the official google-ads-mcp. Flag any discrepancies. This is a sanity check before I trust automated changes.",
    tools: ["toprank", "google-ads-official"],
  },
  {
    slug: "launch-campaign",
    title: "Launch a new campaign from a brief",
    prompt:
      "Using adspirer, build a skeleton campaign on Google Search, Meta, and TikTok for the Master Seafari tour. Target: US + Canada adventure travelers age 35-60. Budget: $30/day Google, $20/day Meta, $10/day TikTok. Headline angle: 'swim with orcas in Mexico'. Landing page: bajablue.mx/tours/master-seafari. Return the campaign structure for my review before creating anything live.",
    tools: ["adspirer"],
  },
];

const N8N_WORKFLOWS = [
  {
    name: "WeTravel → Meta Conversion API",
    trigger: "Webhook (WeTravel booking confirmed)",
    actions: ["POST to Meta Conversion API", "POST to Google Ads conversion", "Fire Umami event", "Telegram alert"],
    priority: "critical",
  },
  {
    name: "Daily budget + anomaly check",
    trigger: "Cron (7am + 7pm)",
    actions: ["Query Meta + Google spend", "Compare to daily target", "Telegram alert if >20% deviation"],
    priority: "high",
  },
  {
    name: "Weekly report generator",
    trigger: "Cron (Monday 8am)",
    actions: ["Pull metrics via MCPs", "Build PDF report", "Email to the Bajablue team + save to Drive"],
    priority: "high",
  },
  {
    name: "WeTravel → Telegram booking pings",
    trigger: "Webhook (WeTravel booking confirmed)",
    actions: ["Format booking details", "Send to team Telegram + Bajablue bot"],
    priority: "medium",
  },
  {
    name: "Review sync (Google + TripAdvisor)",
    trigger: "Cron (daily)",
    actions: ["Scrape new reviews", "POST to /api/reviews", "Dashboard auto-updates sentiment"],
    priority: "medium",
  },
];

const storageKey = (k: string) => `bjb-tool-${k}`;

export default function ToolsPage() {
  const [statuses, setStatuses] = useState<Record<string, ToolStatus>>({});
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    const loaded: Record<string, ToolStatus> = {};
    TOOLS.forEach((t) => {
      if (typeof window !== "undefined") {
        loaded[t.slug] = (localStorage.getItem(storageKey(t.slug)) as ToolStatus) ?? "not-installed";
      }
    });
    setStatuses(loaded);
  }, []);

  function setStatus(slug: string, status: ToolStatus) {
    setStatuses((prev) => {
      const next = { ...prev, [slug]: status };
      localStorage.setItem(storageKey(slug), status);
      return next;
    });
  }

  function copy(text: string, slug: string) {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  const installedCount = Object.values(statuses).filter((s) => s === "installed" || s === "connected").length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-teal-light animate-pulse" />
            <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase">
              Ad Stack · MCP Command Center
            </p>
          </div>
          <h1 className="text-display text-warm-white text-3xl tracking-wide mb-1">AD TOOL STACK</h1>
          <p className="text-warm-white/40 text-sm font-body">
            Every MCP + automation tool in one place. Install, configure, and launch from here.
          </p>
        </div>
        <GlassCard variant="stat" className="p-5 min-w-[200px]">
          <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Stack progress</p>
          <p className="text-display text-3xl text-teal-light relative z-10">
            {installedCount} / {TOOLS.length}
          </p>
          <p className="text-warm-white/40 text-xs font-body mt-1 relative z-10">tools installed</p>
        </GlassCard>
      </div>

      {/* The Tool Stack */}
      <div className="space-y-4 mb-12">
        {TOOLS.map((tool) => {
          const status = statuses[tool.slug] ?? "not-installed";
          return (
            <GlassCard key={tool.slug} className="p-6">
              <div className="grid lg:grid-cols-[1fr_auto] gap-6">
                <div>
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h3 className="text-warm-white text-xl font-body font-medium">{tool.name}</h3>
                    <StatusBadge status={status} />
                    <span className="text-warm-white/40 text-[10px] font-body px-2 py-0.5 rounded-sm bg-white/[0.05] uppercase tracking-wider">
                      {tool.license}
                    </span>
                    {tool.stars && (
                      <span className="text-amber-400/70 text-[10px] font-body px-2 py-0.5 rounded-sm bg-amber-400/10">
                        ★ {tool.stars}
                      </span>
                    )}
                    <span className="text-teal-light/60 text-[10px] font-body px-2 py-0.5 rounded-sm bg-teal/10">
                      {tool.platform}
                    </span>
                  </div>
                  <p className="text-teal-light text-sm font-body font-medium mb-3">{tool.tagline}</p>
                  <p className="text-warm-white/65 text-sm font-body leading-relaxed mb-4">{tool.what}</p>

                  <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">What it does</p>
                  <ul className="space-y-1 mb-4">
                    {tool.capabilities.map((c) => (
                      <li key={c} className="text-warm-white/70 text-sm font-body flex gap-2">
                        <span className="text-teal-light">—</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-warm-white/50 text-xs font-body italic">
                    <span className="text-warm-white/40">Best for:</span> {tool.bestFor}
                  </p>
                </div>

                <div className="flex flex-col gap-3 min-w-0 lg:min-w-[280px]">
                  <div>
                    <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">Install command</p>
                    <div className="relative">
                      <pre className="bg-black/40 text-teal-light/90 font-mono text-xs px-3 py-2 rounded-sm overflow-x-auto border-l-2 border-teal/40">
                        {tool.installCmd}
                      </pre>
                      <button
                        onClick={() => copy(tool.installCmd, `cmd-${tool.slug}`)}
                        className="absolute top-1 right-1 text-[9px] font-body tracking-widest uppercase bg-teal/20 text-teal-light hover:bg-teal/30 px-2 py-0.5 rounded-sm"
                      >
                        {copiedSlug === `cmd-${tool.slug}` ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {tool.configSnippet && (
                    <div>
                      <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">
                        Add to <code className="text-teal-light">{tool.configFile}</code>
                      </p>
                      <div className="relative">
                        <pre className="bg-black/40 text-teal-light/90 font-mono text-[10px] px-3 py-2 rounded-sm overflow-x-auto border-l-2 border-teal/40 max-h-[120px] overflow-y-auto">
                          {tool.configSnippet}
                        </pre>
                        <button
                          onClick={() => copy(tool.configSnippet!, `cfg-${tool.slug}`)}
                          className="absolute top-1 right-1 text-[9px] font-body tracking-widest uppercase bg-teal/20 text-teal-light hover:bg-teal/30 px-2 py-0.5 rounded-sm"
                        >
                          {copiedSlug === `cfg-${tool.slug}` ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap mt-2">
                    <a
                      href={`https://github.com/${tool.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-body tracking-widest uppercase bg-white/[0.04] text-warm-white/70 border border-teal/10 hover:text-warm-white px-3 py-1.5 rounded-sm"
                    >
                      GitHub →
                    </a>
                    <a
                      href={tool.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-body tracking-widest uppercase bg-white/[0.04] text-warm-white/70 border border-teal/10 hover:text-warm-white px-3 py-1.5 rounded-sm"
                    >
                      Docs →
                    </a>
                  </div>

                  <div>
                    <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2">Status</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {(["not-installed", "installed", "connected"] as ToolStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatus(tool.slug, s)}
                          className={`text-[9px] font-body tracking-widest uppercase px-2 py-1 rounded-sm border transition-colors ${
                            status === s
                              ? "bg-teal/20 text-teal-light border-teal/40"
                              : "bg-white/[0.02] text-warm-white/40 border-teal/10 hover:text-warm-white/70"
                          }`}
                        >
                          {s.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Claude Prompt Library */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="text-display text-warm-white text-2xl tracking-wide mb-1">PROMPT LIBRARY</h2>
          <p className="text-warm-white/40 text-sm font-body">
            Copy any of these into Claude Code or Claude Desktop. Each runs through the MCPs above.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {CLAUDE_PROMPTS.map((p) => (
            <GlassCard key={p.slug} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-warm-white text-sm font-body font-medium">{p.title}</h3>
                <button
                  onClick={() => copy(p.prompt, `prompt-${p.slug}`)}
                  className="text-[9px] font-body tracking-widest uppercase bg-teal/20 text-teal-light hover:bg-teal/30 px-2 py-1 rounded-sm"
                >
                  {copiedSlug === `prompt-${p.slug}` ? "Copied" : "Copy prompt"}
                </button>
              </div>
              <p className="text-warm-white/65 text-xs font-body leading-relaxed mb-3">{p.prompt}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tools.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-body bg-white/[0.04] text-warm-white/50 px-2 py-0.5 rounded-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* n8n Workflows */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-display text-warm-white text-2xl tracking-wide mb-1">N8N WORKFLOW BACKLOG</h2>
          <p className="text-warm-white/40 text-sm font-body">
            Build these workflows in your n8n instance. Each one removes a recurring manual task.
          </p>
        </div>
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead className="bg-white/[0.03] border-b border-teal/10">
              <tr>
                <th className="text-left py-3 px-5 text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase">Workflow</th>
                <th className="text-left py-3 px-5 text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase">Trigger</th>
                <th className="text-left py-3 px-5 text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase">Actions</th>
                <th className="text-left py-3 px-5 text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase">Priority</th>
              </tr>
            </thead>
            <tbody>
              {N8N_WORKFLOWS.map((w, i) => (
                <tr key={i} className="border-b border-white/[0.03]">
                  <td className="py-3 px-5 text-warm-white font-medium">{w.name}</td>
                  <td className="py-3 px-5 text-warm-white/60 text-xs">{w.trigger}</td>
                  <td className="py-3 px-5 text-warm-white/60 text-xs">
                    {w.actions.map((a, ai) => (
                      <div key={ai}>→ {a}</div>
                    ))}
                  </td>
                  <td className="py-3 px-5">
                    <PriorityBadge priority={w.priority as "critical" | "high" | "medium"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* First moves */}
      <GlassCard variant="warning" className="p-6">
        <h2 className="text-amber-400 text-sm font-body font-medium mb-3">Recommended install order</h2>
        <ol className="space-y-2 text-sm font-body text-warm-white/75">
          <li className="flex gap-3">
            <span className="text-amber-400 font-medium">1.</span>
            <span>Install <strong className="text-warm-white">toprank</strong> first — MIT license, one command, works on your existing Google Ads access. Prove the stack.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-400 font-medium">2.</span>
            <span>Install <strong className="text-warm-white">Pipeboard Meta Ads MCP</strong> once the client grants Meta Ads access.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-400 font-medium">3.</span>
            <span>Install <strong className="text-warm-white">adspirer-mcp-plugin</strong> third — big install, wider coverage, add TikTok + LinkedIn when ready.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-400 font-medium">4.</span>
            <span>Add <strong className="text-warm-white">Google Ads official MCP</strong> as read-only cross-check layer.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-400 font-medium">5.</span>
            <span>Stand up <strong className="text-warm-white">n8n</strong> last — build the WeTravel → Meta Conversion API workflow first. Everything else is optimization.</span>
          </li>
        </ol>
      </GlassCard>
    </div>
  );
}

function StatusBadge({ status }: { status: ToolStatus }) {
  const style = {
    "not-installed": "bg-white/[0.04] text-warm-white/40 border-white/10",
    installed: "bg-amber-400/15 text-amber-400 border-amber-400/30",
    connected: "bg-teal/20 text-teal-light border-teal/40",
    error: "bg-red-400/15 text-red-400 border-red-400/30",
  }[status];
  const label = {
    "not-installed": "Not installed",
    installed: "Installed",
    connected: "Connected",
    error: "Error",
  }[status];
  return (
    <span className={`text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-sm border ${style}`}>
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "critical" | "high" | "medium" }) {
  const style = {
    critical: "bg-red-400/20 text-red-400 border-red-400/30",
    high: "bg-amber-400/20 text-amber-400 border-amber-400/30",
    medium: "bg-teal/15 text-teal-light border-teal/30",
  }[priority];
  return (
    <span className={`text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-sm border ${style}`}>
      {priority}
    </span>
  );
}
