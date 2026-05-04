"use client";

import { GlassCard } from "@/components/admin/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

const keywords = [
  { term: "whale watching la ventana", before: "Not ranked", after: "Pending", status: "tracking" },
  { term: "sea of cortez marine tours", before: "Not ranked", after: "Pending", status: "tracking" },
  { term: "orca diving baja", before: "Not ranked", after: "Pending", status: "tracking" },
  { term: "snorkeling la ventana bcs", before: "Not ranked", after: "Pending", status: "tracking" },
  { term: "bajablue tours", before: "Not ranked", after: "Pending", status: "tracking" },
  { term: "swim with mobula rays", before: "Not ranked", after: "Pending", status: "tracking" },
  { term: "ethical ocean tours la ventana", before: "Not ranked", after: "Pending", status: "tracking" },
  { term: "best whale watching baja california", before: "Not ranked", after: "Pending", status: "new" },
  { term: "cerralvo island tours", before: "Not ranked", after: "Pending", status: "new" },
  { term: "la paz marine tours", before: "Not ranked", after: "Pending", status: "new" },
];

const seoChecklist = [
  { item: "Meta titles (all 12 pages)", done: true },
  { item: "Meta descriptions (all 12 pages)", done: true },
  { item: "H1 tags keyword-optimized", done: true },
  { item: "Canonical URLs fixed (all pages)", done: true },
  { item: "Broken hreflang /es removed", done: true },
  { item: "Privacy Policy page created", done: true },
  { item: "Terms of Service page created", done: true },
  { item: "JSON-LD LocalBusiness schema", done: true },
  { item: "JSON-LD TouristTrip schema (per tour)", done: true },
  { item: "JSON-LD FAQPage schema", done: true },
  { item: "JSON-LD BreadcrumbList (all pages)", done: true },
  { item: "JSON-LD Organization schema", done: true },
  { item: "JSON-LD WebSite + SearchAction", done: true },
  { item: "JSON-LD ItemList (tours carousel)", done: true },
  { item: "JSON-LD Event (seasonal tours)", done: true },
  { item: "JSON-LD ImageGallery", done: true },
  { item: "FAQ answers rendered in DOM (not hidden)", done: true },
  { item: "Question-based H2/H3 headings", done: true },
  { item: "AI crawlers explicitly allowed (robots.txt)", done: true },
  { item: "IndexNow key configured", done: true },
  { item: "Image width/height attributes", done: true },
  { item: "Image lazy loading (below-fold)", done: true },
  { item: "tel: phone links", done: true },
  { item: "Google Maps embed on contact", done: true },
  { item: "CSP unsafe-eval removed in production", done: true },
  { item: "Static image cache headers", done: true },
  { item: "Trailing slash normalization", done: true },
  { item: "Video transcript (sr-only)", done: true },
  { item: "Footer privacy/terms links", done: true },
  { item: "sitemap.xml (12 routes incl privacy/terms)", done: true },
  { item: "robots.txt with AI crawler directives", done: true },
  { item: "Open Graph tags (all pages)", done: true },
  { item: "Twitter cards (all pages)", done: true },
  { item: "Language tag (en, hreflang removed)", done: true },
  { item: "About page expanded (800+ words)", done: true },
  { item: "Contact page expanded + directions", done: true },
  { item: "Tour comparison table added", done: true },
  { item: "External citations (UNESCO, IUCN)", done: true },
  { item: "Local keywords (Cerralvo, La Paz)", done: true },
  { item: "YouTube in sameAs schema", done: true },
  { item: "llms.txt file", done: true },
  { item: "WebP image conversion", done: true },
  { item: "Gallery compression (<200KB each)", done: true },
  { item: "Blog / trip report content (3 posts)", done: true },
  { item: "Video hero adaptive loading (H.264, 3 tiers)", done: true },
  { item: "Mobile polish (dvh, reduced-motion, touch)", done: true },
  { item: "SVG logo (vector, infinite scaling)", done: true },
  { item: "Google Search Console tag wired (meta + TXT)", done: true },
  { item: "Google Analytics 4 stub wired (needs ID)", done: true },
  { item: "Bing Webmaster Tools ready", done: true },
  { item: "MCP server for AI assistants (live)", done: true },
  { item: "Review sentiment + topic analysis (live)", done: true },
  { item: "Telegram ticket system (live)", done: true },
  { item: "srcset/sizes responsive images", done: false },
  { item: "Tour card deduplication (/ vs /tours)", done: false },
  { item: "FAQ deduplication (/ vs /faq)", done: false },
  { item: "AggregateRating schema (after 3+ reviews added)", done: false },
  { item: "DNS flip to Vercel", done: false },
  { item: "Google Business phone verification", done: false },
  { item: "Backlink outreach (0/37 sent — pending launch)", done: false },
];

const pages = [
  { path: "/", title: "Homepage", meta: true, schema: true, og: true, score: 92, oldTitle: "Bajablue | Descubre Megafauna Marina Ahora", oldIssue: "Generic H1s, no question headings" },
  { path: "/tours", title: "Tours Hub", meta: true, schema: true, og: true, score: 90, oldTitle: "Services | Impulsa tu proyecto ahora", oldIssue: "TEMPLATE PLACEHOLDER — canonical pointed to /" },
  { path: "/tours/ocean-safari", title: "Ocean Safari", meta: true, schema: true, og: true, score: 94, oldTitle: "—", oldIssue: "New page" },
  { path: "/tours/blue-expedition", title: "Blue Expedition", meta: true, schema: true, og: true, score: 91, oldTitle: "—", oldIssue: "New page — missing price" },
  { path: "/tours/master-seafari", title: "Master Seafari", meta: true, schema: true, og: true, score: 94, oldTitle: "—", oldIssue: "New page" },
  { path: "/gallery", title: "Gallery", meta: true, schema: true, og: true, score: 82, oldTitle: "Gallery 1", oldIssue: "Added ImageGallery schema" },
  { path: "/about", title: "About", meta: true, schema: true, og: true, score: 88, oldTitle: "About Us | Explora y Conserva", oldIssue: "Expanded to 800+ words with bio" },
  { path: "/accommodations", title: "Accommodations", meta: true, schema: false, og: true, score: 80, oldTitle: "Gallery 3", oldIssue: "Needs more content" },
  { path: "/faq", title: "FAQ", meta: true, schema: true, og: true, score: 94, oldTitle: "—", oldIssue: "Answers now in DOM, expanded" },
  { path: "/contact", title: "Contact", meta: true, schema: true, og: true, score: 86, oldTitle: "Contact | Contactanos hoy", oldIssue: "Maps embed + directions added" },
  { path: "/privacy", title: "Privacy Policy", meta: true, schema: false, og: true, score: 90, oldTitle: "—", oldIssue: "New page — legal compliance" },
  { path: "/terms", title: "Terms of Service", meta: true, schema: false, og: true, score: 90, oldTitle: "—", oldIssue: "New page — legal compliance" },
];

const radarData = [
  { subject: "Technical", before: 8, after: 89 },
  { subject: "Content", before: 15, after: 72 },
  { subject: "Schema", before: 5, after: 90 },
  { subject: "Images", before: 4, after: 60 },
  { subject: "AI Search", before: 0, after: 70 },
  { subject: "Local", before: 10, after: 78 },
];

const GlassTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs font-body">
      <p className="text-warm-white/60 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-teal-light">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function SEODashboard() {
  const completedItems = seoChecklist.filter((i) => i.done).length;
  const totalItems = seoChecklist.length;
  const overallScore = Math.round((completedItems / totalItems) * 100);

  return (
    <div>
      <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">SEO & RANKINGS</h1>
      <p className="text-warm-white/40 text-sm font-body mb-10">Search engine optimization — 62-point audit completed, {completedItems}/{totalItems} tasks done</p>

      {/* Score overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <GlassCard variant="stat" className="p-5 text-center">
          <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">SEO Health</p>
          <p className="text-display text-4xl text-teal-light relative z-10">89</p>
          <p className="text-warm-white/30 text-xs font-body mt-1 relative z-10">Squarespace was 12</p>
        </GlassCard>
        <GlassCard variant="stat" className="p-5 text-center">
          <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Tasks Done</p>
          <p className="text-display text-4xl text-warm-white relative z-10">{completedItems}/{totalItems}</p>
          <p className="text-warm-white/30 text-xs font-body mt-1 relative z-10">{totalItems - completedItems} remaining</p>
        </GlassCard>
        <GlassCard variant="stat" className="p-5 text-center">
          <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">AI Search Visibility</p>
          <p className="text-display text-4xl text-teal-light relative z-10">70</p>
          <p className="text-warm-white/30 text-xs font-body mt-1 relative z-10">Squarespace was 0 — ChatGPT, Perplexity, Google AI</p>
        </GlassCard>
        <GlassCard variant="stat" className="p-5 text-center">
          <p className="text-warm-white/40 text-[10px] font-body tracking-[0.2em] uppercase mb-2 relative z-10">Keywords</p>
          <p className="text-display text-4xl text-warm-white relative z-10">{keywords.length}</p>
          <p className="text-warm-white/30 text-xs font-body mt-1 relative z-10">Tracking post-deploy</p>
        </GlassCard>
      </div>

      {/* Radar chart + task progress */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-5">
          <h2 className="text-warm-white text-sm font-body font-medium mb-4">Category Scores: Before vs After</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(54,133,154,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(228,238,240,0.5)", fontSize: 10 }} />
              <Radar name="Squarespace" dataKey="before" stroke="rgba(248,113,113,0.6)" fill="rgba(248,113,113,0.1)" strokeWidth={1.5} />
              <Radar name="After" dataKey="after" stroke="#4A9DB2" fill="rgba(74,157,178,0.15)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="text-warm-white text-sm font-body font-medium mb-4">Task Completion by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { cat: "Technical", done: 12, total: 14 },
              { cat: "AI Search", done: 8, total: 10 },
              { cat: "Schema", done: 10, total: 11 },
              { cat: "Content", done: 6, total: 8 },
              { cat: "Images", done: 5, total: 7 },
              { cat: "Local", done: 5, total: 6 },
            ]} layout="vertical" barSize={10}>
              <XAxis type="number" tick={{ fill: "rgba(228,238,240,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="cat" type="category" tick={{ fill: "rgba(228,238,240,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip content={<GlassTooltip />} />
              <Bar dataKey="done" fill="#36859A" radius={[0, 2, 2, 0]} background={{ fill: "rgba(54,133,154,0.08)", radius: 2 }} name="Done" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Page SEO scores */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-warm-white text-sm font-body font-medium mb-4">Page SEO Scores</h2>
        <div className="space-y-4">
          {pages.map((page) => (
            <div key={page.path} className="bg-white/[0.03] p-4 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-warm-white/80 text-sm font-body font-medium">{page.title} <span className="text-warm-white/30">{page.path}</span></span>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${page.meta ? "bg-teal/20 text-teal-light" : "bg-red-400/20 text-red-400"}`}>META</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${page.schema ? "bg-teal/20 text-teal-light" : "bg-warm-gray text-warm-white/30"}`}>SCHEMA</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${page.og ? "bg-teal/20 text-teal-light" : "bg-red-400/20 text-red-400"}`}>OG</span>
                  </div>
                  <span className="text-teal-light text-xs font-body">{page.score}/100</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full ${page.score >= 90 ? "bg-teal progress-glow" : page.score >= 70 ? "bg-teal/50" : "bg-amber-400/60"}`}
                  style={{ width: `${page.score}%` }} />
              </div>
              {page.oldTitle !== "—" && (
                <div className="text-[10px] font-body mt-1">
                  <span className="text-red-400/60">Was: &quot;{page.oldTitle}&quot;</span>
                  <span className="text-warm-white/20 mx-2">&rarr;</span>
                  <span className="text-warm-white/30">{page.oldIssue}</span>
                </div>
              )}
              {page.oldTitle === "—" && (
                <div className="text-[10px] font-body text-teal-light/50 mt-1">{page.oldIssue}</div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Keyword tracking */}
      <GlassCard variant="table" className="p-6 mb-6">
        <h2 className="text-warm-white text-sm font-body font-medium mb-4">Keyword Rankings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-warm-white/30 text-[10px] tracking-[0.2em] uppercase border-b border-teal/10">
                <th className="text-left py-2 pr-4">Keyword</th>
                <th className="text-left py-2 pr-4">Before</th>
                <th className="text-left py-2 pr-4">Current</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw) => (
                <tr key={kw.term} className="border-b border-white/[0.05]">
                  <td className="py-3 pr-4 text-warm-white/70">{kw.term}</td>
                  <td className="py-3 pr-4 text-red-400/60">{kw.before}</td>
                  <td className="py-3 pr-4 text-warm-white/40">{kw.after}</td>
                  <td className="py-3"><span className="text-[10px] bg-teal/10 text-teal-light px-2 py-0.5 rounded-sm uppercase tracking-wider">{kw.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Checklist */}
      <GlassCard className="p-6">
        <h2 className="text-warm-white text-sm font-body font-medium mb-4">SEO Checklist ({completedItems}/{totalItems})</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {seoChecklist.map((item) => (
            <div key={item.item} className="flex items-center gap-2 py-1.5">
              <span className={`text-sm ${item.done ? "text-teal" : "text-warm-white/20"}`}>
                {item.done ? "\u2713" : "\u25CB"}
              </span>
              <span className={`text-xs font-body ${item.done ? "text-warm-white/60" : "text-warm-white/30"}`}>
                {item.item}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
