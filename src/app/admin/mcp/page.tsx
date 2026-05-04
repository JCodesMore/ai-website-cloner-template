"use client";

import { GlassCard } from "@/components/admin/GlassCard";
import { useState } from "react";

const TOOLS = [
  {
    name: "get_site_scores",
    desc: "Current SEO and AI Search scores, baseline vs now, historical timeline.",
  },
  { name: "list_pages", desc: "All 12 pages, their status, last updated." },
  { name: "get_tours", desc: "Ocean Safari, Blue Expedition, Master Seafari — pricing and what's included." },
  { name: "get_analytics_summary", desc: "Last 7 days: pageviews, visitors, top pages, top referrers (needs Umami)." },
  { name: "get_instagram_stats", desc: "Live follower count + last 5 posts with engagement (needs Meta API)." },
  { name: "get_recent_reviews", desc: "Most recent Google reviews with sentiment labels." },
];

export default function MCPPage() {
  const [copied, setCopied] = useState(false);
  const endpoint =
    typeof window !== "undefined" ? `${window.location.origin}/api/mcp` : "https://bajablue.mx/api/mcp";

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        bajablue: {
          transport: {
            type: "http",
            url: endpoint,
          },
        },
      },
    },
    null,
    2
  );

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">AI CONNECTION (MCP)</h1>
      <p className="text-warm-white/40 text-sm font-body mb-10">
        Plug your dashboard into Claude, ChatGPT, or any AI tool that speaks MCP.
      </p>

      {/* Explainer */}
      <GlassCard className="p-6 mb-8">
        <h2 className="text-warm-white text-base font-body font-medium mb-3">What is this?</h2>
        <p className="text-warm-white/60 text-sm font-body leading-relaxed mb-3">
          MCP (Model Context Protocol) is how AI assistants talk to your business systems. With this
          endpoint connected, you can ask Claude things like:
        </p>
        <ul className="space-y-2 text-sm font-body text-warm-white/70 list-disc pl-5">
          <li>&quot;How&apos;s my Bajablue traffic this week compared to last?&quot;</li>
          <li>&quot;What are my most-mentioned topics in recent reviews?&quot;</li>
          <li>&quot;Draft 3 Instagram captions based on my top-performing posts this month.&quot;</li>
          <li>&quot;Summarize my site&apos;s current SEO score and where it came from.&quot;</li>
        </ul>
      </GlassCard>

      {/* Endpoint */}
      <GlassCard className="p-6 mb-8">
        <h3 className="text-warm-white text-sm font-body font-medium mb-3">Your MCP endpoint</h3>
        <div className="flex gap-3 items-center">
          <code className="flex-1 bg-black/40 border-l-2 border-teal text-teal-light font-mono text-sm px-4 py-3 rounded-sm overflow-x-auto">
            {endpoint}
          </code>
          <button
            onClick={() => copy(endpoint)}
            className="bg-teal/20 text-teal-light text-xs font-body tracking-[0.2em] uppercase px-4 py-3 rounded-sm hover:bg-teal/30 flex-shrink-0"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-warm-white/40 text-xs font-body mt-3">
          This endpoint accepts POST requests using JSON-RPC 2.0 per the MCP spec. Protocol version 2024-11-05.
        </p>
      </GlassCard>

      {/* Claude Desktop config */}
      <GlassCard className="p-6 mb-8">
        <h3 className="text-warm-white text-sm font-body font-medium mb-3">Claude Desktop setup</h3>
        <p className="text-warm-white/60 text-sm font-body mb-4">
          Add to <code className="text-teal-light bg-black/30 px-2 py-0.5 rounded text-xs">~/Library/Application Support/Claude/claude_desktop_config.json</code>
        </p>
        <div className="relative">
          <pre className="bg-black/40 text-teal-light/90 font-mono text-xs px-4 py-3 rounded-sm overflow-x-auto leading-relaxed">
{claudeConfig}
          </pre>
          <button
            onClick={() => copy(claudeConfig)}
            className="absolute top-2 right-2 bg-teal/20 text-teal-light text-[10px] font-body tracking-widest uppercase px-2 py-1 rounded-sm hover:bg-teal/30"
          >
            Copy
          </button>
        </div>
      </GlassCard>

      {/* Available tools */}
      <GlassCard className="p-6">
        <h3 className="text-warm-white text-sm font-body font-medium mb-4">Available tools ({TOOLS.length})</h3>
        <div className="space-y-3">
          {TOOLS.map((t) => (
            <div key={t.name} className="flex items-start gap-4 py-2 border-b border-white/[0.05]">
              <code className="text-teal-light font-mono text-sm flex-shrink-0 w-52">{t.name}</code>
              <span className="text-warm-white/60 text-sm font-body">{t.desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
