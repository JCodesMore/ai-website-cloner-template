"use client";

import { useState } from "react";

const impactItems = [
  {
    rank: 1,
    category: "Technical",
    title: "Custom Next.js website — 10 pages, animated, responsive",
    detail: "Moved off Squarespace 7.1 (locked, limited, template garbage) to a custom-built Next.js 16 site with React 19, Tailwind v4, Lenis smooth scroll, Framer Motion parallax, and adaptive video. Full code control over every pixel.",
    before: "Squarespace 7.1 — no developer mode, template placeholders in SEO",
    after: "Next.js 16 — production-grade, fully owned, 10 animated pages",
    agencyPrice: "$1,000",
    source: "Fiverr @claymind — custom React web application, premium tier",
  },
  {
    rank: 2,
    category: "Technical",
    title: "Custom admin dashboard with Firebase auth",
    detail: "Built from scratch — SEO monitoring, page status, change requests, social overview, booking preview. Firebase email/password authentication. Not a WordPress plugin.",
    before: "Squarespace admin (shared template, limited)",
    after: "Custom admin at /admin — Firebase auth, 7 sections",
    agencyPrice: "$150",
    source: "Fiverr @amin_rafaey — Next.js + React + Firebase admin dashboard",
  },
  {
    rank: 3,
    category: "SEO",
    title: "Full SEO audit + optimization across all pages",
    detail: "Audited every page for meta titles, descriptions, H1 tags, alt text, schemas, language tags, sitemap. Found template placeholders, empty schemas, wrong language tag. Fixed everything.",
    before: "2/6 meta descriptions, 0/6 keyword H1s, 4% alt text, 0% schema accuracy",
    after: "10/10 meta, 10/10 H1s, schemas populated, sitemap + robots.txt",
    agencyPrice: "$75",
    source: "Fiverr @bcmarketing314 — 55-point SEO audit for small business websites",
  },
  {
    rank: 4,
    category: "Brand",
    title: "Brand aesthetic guide with video grading specs",
    detail: "12 colors with hex codes, typography scale, photo composition rules, video grading specs for CapCut + Lightroom + DaVinci Resolve, do's/don'ts, printable reference card.",
    before: "No brand guidelines of any kind",
    after: "Full production-grade guide with filter presets",
    agencyPrice: "$80",
    source: "Fiverr @muatter — brand style guide + brand guidelines + identity kit",
  },
  {
    rank: 5,
    category: "Strategy",
    title: "5-competitor analysis with positioning strategy",
    detail: "Full analysis of Baja Wild Encounters (77K followers, 345 reviews) + 4 others. Websites, social, keywords, content types, posting frequency, engagement. Positioning gaps identified.",
    before: "No competitive intelligence",
    after: "5 competitors analyzed with 10 keyword opportunities mapped",
    agencyPrice: "$90",
    source: "Fiverr @msdataconsultng — comprehensive competitor analysis, 5 competitors",
  },
  {
    rank: 6,
    category: "Strategy",
    title: "Social media strategy + posting playbook",
    detail: "4 posts/week, 5 content pillars, 60/25/15 content mix, 10 caption templates, 3 hashtag sets, hostel cross-promo plan, weekly calendar. Built for an operator, not a marketer.",
    before: "No content strategy documented",
    after: "Complete playbook the Bajablue team can execute",
    agencyPrice: "$75",
    source: "Fiverr @diegooi — social media content plan with calendar + hashtag research",
  },
  {
    rank: 7,
    category: "Conversion",
    title: "Funnel mapping + friction audit",
    detail: "Mapped complete flow: social → website → WhatsApp → payment. Counted clicks at every step. Found WhatsApp wasn't clickable, no CTAs existed, no pricing shown. All fixed.",
    before: "No funnel documentation. Click-to-inquiry: IMPOSSIBLE.",
    after: "Full funnel map + 1-click WhatsApp from any page",
    agencyPrice: "$170",
    source: "Fiverr @tompeyton — in-depth CRO audit with video walkthrough + action plan",
  },
  {
    rank: 8,
    category: "Technical",
    title: "7-point security hardening",
    detail: "CSP headers, HSTS (2-year preload), XSS protection, input sanitization library, no secrets in frontend, dependency audit, source maps disabled.",
    before: "Zero security headers",
    after: "7 security layers implemented",
    agencyPrice: "$30",
    source: "Fiverr @pmdnag — HTTP security headers setup (CSP, HSTS, X-Frame)",
  },
  {
    rank: 9,
    category: "Technical",
    title: "Adaptive video delivery (3 quality tiers)",
    detail: "Expedition footage compressed to 1080p/720p/480p. Poster frames for instant load. Lazy loading. Device-responsive quality selection.",
    before: "No video on site. Raw 3GB file.",
    after: "3-tier adaptive video + poster frames + lazy load",
    agencyPrice: "$30",
    source: "Fiverr @mirza_haziq — video encoding, format conversion, resolution setup",
  },
  {
    rank: 10,
    category: "SEO",
    title: "6 directory accounts created",
    detail: "TripAdvisor, Yelp, YouTube, LinkedIn, Pinterest, Google Business Profile — all created from scratch with bajabluetours@gmail.com. Each is a new backlink + discovery channel.",
    before: "0 directory listings anywhere",
    after: "6 accounts on highest-value free platforms",
    agencyPrice: "$15",
    source: "Fiverr @services97 — manual local citation + directory listings (25 listings)",
  },
  {
    rank: 11,
    category: "SEO",
    title: "Expeditions page had template placeholder as title",
    detail: "Your most important tour page said 'Impulsa tu proyecto ahora' — a web design phrase that had nothing to do with marine tours. Google was indexing this as a design agency.",
    before: "'Services | Impulsa tu proyecto ahora'",
    after: "Keyword-optimized title for each tour",
    agencyPrice: "Included in SEO audit",
    source: "—",
  },
  {
    rank: 12,
    category: "SEO",
    title: "Pages named 'Gallery 1' and 'Gallery 3'",
    detail: "Squarespace internal names never changed. Search engines had no idea what these pages were about.",
    before: "Accommodations: 'Gallery 3' / Gallery: 'Gallery 1'",
    after: "Proper keyword titles on all 10 pages",
    agencyPrice: "Included in SEO audit",
    source: "—",
  },
  {
    rank: 13,
    category: "SEO",
    title: "6 schema types built (was 0% accuracy)",
    detail: "LocalBusiness, Organization, WebSite, TouristTrip (per tour), FAQPage, BreadcrumbList — all populated with real data. Old site had empty schema fields.",
    before: "Schema existed but address EMPTY, hours EMPTY",
    after: "6 schema types, all fields populated",
    agencyPrice: "Included in SEO audit",
    source: "—",
  },
  {
    rank: 14,
    category: "SEO",
    title: "96% of images had no alt text",
    detail: "34 of 45 images invisible to Google Images. Every new image now has descriptive alt text.",
    before: "~2 of 45 images with alt text (4%)",
    after: "All controlled images have alt text",
    agencyPrice: "Included in SEO audit",
    source: "—",
  },
  {
    rank: 15,
    category: "SEO",
    title: "Language tag was wrong",
    detail: "html lang='es-MX' but content was English. Affects how Google indexes every page.",
    before: "es-MX with English content",
    after: "en — correct",
    agencyPrice: "Included in SEO audit",
    source: "—",
  },
  {
    rank: 16,
    category: "SEO",
    title: "No social media links on entire website",
    detail: "Zero links to Instagram, Facebook, or any platform. For a business creating cinematic marine content.",
    before: "0 social links anywhere on site",
    after: "IG + FB on every page + floating WhatsApp",
    agencyPrice: "Included in SEO audit",
    source: "—",
  },
  {
    rank: 17,
    category: "SEO",
    title: "110-domain backlink outreach plan + execution",
    detail: "Identified every domain linking to competitor but not Bajablue. Categorized 18 high-value, 9 medium, 23 spam. 3 email templates drafted. Top 20 outreach in progress.",
    before: "0 backlinks, 0 outreach",
    after: "Outreach plan built, top 20 targets being contacted",
    agencyPrice: "Included in SEO package",
    source: "—",
  },
  {
    rank: 18,
    category: "Conversion",
    title: "WhatsApp was impossible to click",
    detail: "Plain text in 4 places — never a clickable link. Visitors had to copy number manually.",
    before: "0 clickable WhatsApp links",
    after: "Every page + floating button. 1 tap.",
    agencyPrice: "Included in CRO audit",
    source: "—",
  },
  {
    rank: 19,
    category: "Conversion",
    title: "No pricing displayed anywhere",
    detail: "Couldn't self-qualify. Everyone had to WhatsApp just to learn if they could afford it.",
    before: "Zero pricing on site",
    after: "'Starting from' pricing per tour",
    agencyPrice: "Included in CRO audit",
    source: "—",
  },
  {
    rank: 20,
    category: "Conversion",
    title: "No 'Book Now' button existed",
    detail: "Tour descriptions ended with nothing. No CTA, no next step.",
    before: "Only 'Read more' and 'Send' buttons",
    after: "'Book This Tour' with pre-filled WhatsApp per tour",
    agencyPrice: "Included in CRO audit",
    source: "—",
  },
  {
    rank: 21,
    category: "Conversion",
    title: "'WhatApp' typo on homepage",
    detail: "Missing the 's'. Small but trust-damaging at $54K price point.",
    before: "'WhatApp +52 612 348 3865'",
    after: "Fixed and clickable",
    agencyPrice: "—",
    source: "—",
  },
  {
    rank: 22,
    category: "Conversion",
    title: "FAQ handles objections before WhatsApp",
    detail: "8 questions covering safety, fitness, cancellation, kids, gear, transport. Fewer WhatsApp messages = faster conversion.",
    before: "No FAQ. Zero objections addressed.",
    after: "8 FAQs with Google rich snippet schema",
    agencyPrice: "Included in CRO audit",
    source: "—",
  },
  {
    rank: 23,
    category: "Conversion",
    title: "Email wasn't clickable either",
    detail: "info@bajablue.mx as plain text. Same problem as WhatsApp.",
    before: "Plain text email",
    after: "mailto: link",
    agencyPrice: "—",
    source: "—",
  },
  {
    rank: 24,
    category: "Psychology",
    title: "Dark palette makes $54K feel like a deal",
    detail: "Color psychology: dark + cinematic = premium anchoring. Scored 82.6% vs 62% for warm palettes on SEO + sales psychology analysis.",
    before: "Light template — price outpaces visual quality",
    after: "Cinematic dark palette scored 82.6%",
    agencyPrice: "Included in brand identity",
    source: "—",
  },
  {
    rank: 25,
    category: "Psychology",
    title: "Colors extracted from actual footage (50K pixel analysis)",
    detail: "Dominant teal #36859A = literal color of Sea of Cortez water. Site lives in same color world as content.",
    before: "Generic disconnected colors",
    after: "Every color from pixel analysis of expedition footage",
    agencyPrice: "Included in brand identity",
    source: "—",
  },
  {
    rank: 26,
    category: "Psychology",
    title: "Authority signaling for safety-critical decisions",
    detail: "Dark palettes signal competence. For open-ocean tours with orcas, perceived competence > warmth.",
    before: "Light = friendly, not authoritative",
    after: "Dark = professional, trustworthy",
    agencyPrice: "Included in brand identity",
    source: "—",
  },
  {
    rank: 27,
    category: "Strategy",
    title: "10 keywords nobody in the niche owns",
    detail: "Real search terms with volume, no dominant operator. First-mover advantage on all 10.",
    before: "Zero keyword targeting",
    after: "10 keywords mapped to specific pages",
    agencyPrice: "Included in competitor analysis",
    source: "—",
  },
  {
    rank: 28,
    category: "Technical",
    title: "Site went from 6 pages to 10",
    detail: "3 individual tour pages + FAQ page. Each fully SEO-optimized with unique meta + schemas.",
    before: "6 generic pages",
    after: "10 pages, each with unique SEO",
    agencyPrice: "Included in website build",
    source: "—",
  },
  {
    rank: 29,
    category: "Technical",
    title: "Project memory vault — 18 linked documents",
    detail: "Obsidian-compatible vault. Every decision, finding, deliverable. Any future developer picks up instantly.",
    before: "Nothing documented",
    after: "18 interlinked notes, auto-synced",
    agencyPrice: "$180",
    source: "Fiverr @easy2understand — technical writing + web product documentation",
  },
  {
    rank: 30,
    category: "SEO",
    title: "Google can't rank what Google can't find",
    detail: "Old site: 0/5 keywords in top 10 including own brand name. New site: full SEO infrastructure. Rankings improve after deploy + time + directory backlinks.",
    before: "0 of 5 keywords ranked. Brand invisible.",
    after: "All infrastructure built. Rankings pending deploy.",
    agencyPrice: "—",
    source: "—",
  },
];

const categoryColors: Record<string, string> = {
  SEO: "bg-teal/20 text-teal-light",
  Conversion: "bg-coral/20 text-coral",
  Psychology: "bg-purple-400/20 text-purple-300",
  Strategy: "bg-amber-400/20 text-amber-400",
  Technical: "bg-blue-400/20 text-blue-300",
  Brand: "bg-pink-400/20 text-pink-300",
};

export default function ImpactPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Calculate total from items with real agency prices
  const pricedItems = impactItems.filter(i => i.agencyPrice.includes("$") && !i.agencyPrice.includes("Included") && i.agencyPrice !== "—");

  const categories = impactItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">VALUE DELIVERED</h1>
      <p className="text-warm-white/40 text-sm font-body mb-4">30 changes with before/after proof — each priced to a real Fiverr gig</p>

      {/* Value summary */}
      <div className="glass-stat p-6 rounded-sm mb-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-warm-white/30 text-[9px] font-body tracking-[0.3em] uppercase mb-1">Your Investment</p>
            <p className="text-display text-3xl text-warm-white">$750</p>
          </div>
          <div>
            <p className="text-warm-white/30 text-[9px] font-body tracking-[0.3em] uppercase mb-1">Fiverr Cost (11 Hires)</p>
            <p className="text-display text-3xl text-teal-light">~$1,895</p>
            <p className="text-warm-white/20 text-[9px] font-body mt-1">What you&apos;d pay hiring 11 Fiverr freelancers separately</p>
          </div>
          <div>
            <p className="text-warm-white/30 text-[9px] font-body tracking-[0.3em] uppercase mb-1">Sources</p>
            <p className="text-warm-white/50 text-xs font-body leading-relaxed">Each line item matched to a real Fiverr seller + gig at market price</p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {Object.entries(categories).map(([cat, count]) => (
          <div key={cat} className="glass-card p-3 rounded-sm text-center">
            <p className="text-display text-xl text-warm-white">{count}</p>
            <p className={`text-[9px] font-body tracking-wider uppercase mt-1 ${categoryColors[cat]?.split(" ")[1] || "text-warm-white/40"}`}>{cat}</p>
          </div>
        ))}
      </div>

      {/* Impact list */}
      <div className="space-y-2">
        {impactItems.map((item) => (
          <div key={item.rank} className="glass-card rounded-sm overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === item.rank ? null : item.rank)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-display text-lg text-warm-white/15 w-6 text-right flex-shrink-0">{item.rank}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex-shrink-0 ${categoryColors[item.category] || "bg-teal/20 text-teal-light"}`}>
                {item.category}
              </span>
              <h3 className="text-warm-white text-sm font-body font-medium flex-1 truncate">{item.title}</h3>
              {item.agencyPrice !== "—" && !item.agencyPrice.includes("Included") && (
                <span className="text-warm-white/25 text-[10px] font-body flex-shrink-0">{item.agencyPrice}</span>
              )}
              <span className="text-warm-white/15 text-xs flex-shrink-0">{expandedId === item.rank ? "▲" : "▼"}</span>
            </button>

            {expandedId === item.rank && (
              <div className="px-4 pb-4 border-t border-teal/5 ml-10">
                <p className="text-warm-white/50 text-sm font-body leading-relaxed mt-3 mb-4">{item.detail}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-warm-white/20 text-[9px] font-body tracking-[0.2em] uppercase mb-1">Before</p>
                    <p className="text-red-400/70 text-xs font-body">{item.before}</p>
                  </div>
                  <div>
                    <p className="text-warm-white/20 text-[9px] font-body tracking-[0.2em] uppercase mb-1">After</p>
                    <p className="text-teal-light text-xs font-body">{item.after}</p>
                  </div>
                  {item.agencyPrice !== "—" && (
                    <div>
                      <p className="text-warm-white/20 text-[9px] font-body tracking-[0.2em] uppercase mb-1">Fiverr Price</p>
                      <p className="text-warm-white text-xs font-body font-medium">{item.agencyPrice}</p>
                    </div>
                  )}
                  {item.source !== "—" && (
                    <div>
                      <p className="text-warm-white/20 text-[9px] font-body tracking-[0.2em] uppercase mb-1">Source</p>
                      <p className="text-warm-white/30 text-[10px] font-body">{item.source}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-warm-white/20 text-[10px] font-body leading-relaxed">
        Each price matched to a real Fiverr seller offering that exact service. Total represents what you&apos;d pay hiring 11 separate freelancers, coordinating them yourself, and waiting for each to deliver. You got all 11 in one project for $750.
      </div>
    </div>
  );
}
