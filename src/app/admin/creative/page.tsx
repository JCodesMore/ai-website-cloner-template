"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/admin/GlassCard";
import type { Asset, AssetFormat, AssetTour, AssetMood, AssetAspect } from "@/lib/cortex/asset-library";

type Tour = "master-seafari" | "blue-expedition" | "ocean-safari" | "general";
type Angle = "us-canada-cold" | "mexico-domestic" | "retargeting" | "lookalike" | "organic-social";
type Platform = "instagram-reel" | "instagram-feed" | "facebook-ad" | "tiktok" | "google-search-ad" | "blog";

type Variant = {
  id: string;
  headline: string;
  caption: string;
  cta: string;
  hashtags?: string[];
  utm: string;
  rationale: string;
};

type GenerationResult = {
  generatedAt: string;
  variants: Variant[];
  rawCost: { inputTokens: number; outputTokens: number; usd: number };
};

const TOURS: { value: Tour; label: string; sub: string }[] = [
  { value: "master-seafari", label: "Master Seafari", sub: "Premium · orca pursuit" },
  { value: "blue-expedition", label: "Blue Expedition", sub: "Mid-tier · full marine range" },
  { value: "ocean-safari", label: "Ocean Safari", sub: "Entry · half-day mobula + dolphin" },
  { value: "general", label: "General", sub: "All-tour brand-level" },
];

const ANGLES: { value: Angle; label: string; sub: string }[] = [
  { value: "us-canada-cold", label: "US/CA cold", sub: "Prospecting age 35-60 adventure travelers" },
  { value: "mexico-domestic", label: "Mexico domestic", sub: "CDMX/GDL/Monterrey premium" },
  { value: "retargeting", label: "Retargeting", sub: "Site visitors who didn't book" },
  { value: "lookalike", label: "Lookalike", sub: "Audiences like past customers" },
  { value: "organic-social", label: "Organic social", sub: "Existing followers, narrative depth" },
];

const PLATFORMS: { value: Platform; label: string; sub: string }[] = [
  { value: "instagram-reel", label: "Instagram Reel", sub: "9:16 video, hook in 1.5s" },
  { value: "instagram-feed", label: "Instagram Feed", sub: "1:1 / 4:5 image or carousel" },
  { value: "facebook-ad", label: "Facebook Ad", sub: "Headline + body, paid" },
  { value: "tiktok", label: "TikTok", sub: "Vertical, conversational" },
  { value: "google-search-ad", label: "Google Search Ad", sub: "Headlines + descriptions" },
  { value: "blog", label: "Blog intro", sub: "SEO-friendly + emotional" },
];

const SUBJECT_FILTERS = ["orca", "whale", "mobula", "sea-lion", "team", "boat", "sunset", "guests"];
const ASPECT_FILTERS: { value: AssetAspect | ""; label: string }[] = [
  { value: "", label: "Any aspect" },
  { value: "9:16", label: "9:16 vertical" },
  { value: "16:9", label: "16:9 horizontal" },
  { value: "1:1", label: "1:1 square" },
  { value: "4:5", label: "4:5 portrait" },
  { value: "3:2", label: "3:2 photo" },
];
const FORMAT_FILTERS: { value: AssetFormat | ""; label: string }[] = [
  { value: "", label: "All assets" },
  { value: "video", label: "Videos" },
  { value: "image", label: "Photos" },
];

export default function CreativeEnginePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [counts, setCounts] = useState<{ videos: number; images: number; total: number } | null>(null);
  const [loadingAssets, setLoadingAssets] = useState(true);

  // Filters
  const [formatFilter, setFormatFilter] = useState<AssetFormat | "">("");
  const [aspectFilter, setAspectFilter] = useState<AssetAspect | "">("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");

  // Compose state
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [tour, setTour] = useState<Tour>("master-seafari");
  const [angle, setAngle] = useState<Angle>("us-canada-cold");
  const [platform, setPlatform] = useState<Platform>("instagram-reel");
  const [goalCount, setGoalCount] = useState(5);
  const [customNote, setCustomNote] = useState("");

  // Generation state
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  useEffect(() => {
    setLoadingAssets(true);
    fetch("/api/cortex/assets")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setAssets(data.assets);
          setCounts(data.metadata?.counts || null);
        }
      })
      .finally(() => setLoadingAssets(false));
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (formatFilter && a.format !== formatFilter) return false;
      if (aspectFilter && a.aspect !== aspectFilter) return false;
      if (subjectFilter && !a.subjects.includes(subjectFilter)) return false;
      return true;
    });
  }, [assets, formatFilter, aspectFilter, subjectFilter]);

  function toggleAsset(id: string) {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setNeedsApiKey(false);
    setResult(null);
    try {
      const res = await fetch("/api/cortex/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: "bajablue",
          tour,
          angle,
          platform,
          assetIds: [...selectedAssetIds],
          goalCount,
          customNote: customNote.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Generation failed");
        if (data.needsApiKey) setNeedsApiKey(true);
        return;
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display text-warm-white text-3xl tracking-wide mb-2">Creative Engine</h1>
        <p className="text-warm-white/55 text-sm font-body">
          Pick footage from the library, set the angle + platform, generate on-brand ad/social variants in seconds.
          Every variant ships with a unique tracking UTM so you can attribute every booking back to the exact creative that drove it.
        </p>
      </div>

      {/* Library + filters */}
      <GlassCard className="p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-warm-white text-sm font-body font-medium">Footage library</h2>
          {counts && (
            <span className="text-warm-white/40 text-[10px] font-body tracking-widest uppercase">
              {counts.videos} videos · {counts.images} photos · {counts.total} total
            </span>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value as AssetFormat | "")}
            className="bg-white/[0.04] border border-teal/15 text-warm-white text-xs font-body px-3 py-1.5 rounded-sm focus:outline-none focus:border-teal/40"
          >
            {FORMAT_FILTERS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={aspectFilter}
            onChange={(e) => setAspectFilter(e.target.value as AssetAspect | "")}
            className="bg-white/[0.04] border border-teal/15 text-warm-white text-xs font-body px-3 py-1.5 rounded-sm focus:outline-none focus:border-teal/40"
          >
            {ASPECT_FILTERS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-white/[0.04] border border-teal/15 text-warm-white text-xs font-body px-3 py-1.5 rounded-sm focus:outline-none focus:border-teal/40"
          >
            <option value="">Any subject</option>
            {SUBJECT_FILTERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="text-warm-white/40 text-xs font-body self-center ml-2">
            {filteredAssets.length} matching · {selectedAssetIds.size} selected
          </span>
        </div>

        {loadingAssets ? (
          <p className="text-warm-white/40 text-sm font-body italic py-8 text-center">Loading library...</p>
        ) : filteredAssets.length === 0 ? (
          <p className="text-warm-white/40 text-sm font-body italic py-8 text-center">No assets match these filters.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredAssets.map((asset) => {
              const selected = selectedAssetIds.has(asset.id);
              return (
                <button
                  key={asset.id}
                  onClick={() => toggleAsset(asset.id)}
                  className={`relative aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all text-left ${
                    selected
                      ? "border-teal scale-[0.97] shadow-lg shadow-teal/20"
                      : "border-white/10 hover:border-teal/40"
                  }`}
                >
                  {asset.format === "video" && asset.posterUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={asset.posterUrl} alt={asset.caption || asset.id} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={asset.url} alt={asset.caption || asset.id} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/40 to-transparent" />
                  {asset.format === "video" && (
                    <span className="absolute top-2 left-2 text-[9px] font-body tracking-widest uppercase px-1.5 py-0.5 rounded-sm bg-black/60 text-warm-white">
                      ▶ {asset.duration_sec}s
                    </span>
                  )}
                  <span className="absolute top-2 right-2 text-[9px] font-body tracking-widest uppercase px-1.5 py-0.5 rounded-sm bg-black/60 text-warm-white">
                    {asset.aspect}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    <p className="text-warm-white text-[10px] font-body leading-tight line-clamp-2">
                      {asset.caption || asset.tags.join(", ")}
                    </p>
                    <p className="text-teal-light text-[8px] font-body tracking-widest uppercase mt-1">
                      {asset.subjects.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                  {selected && (
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-teal text-deep text-[9px] font-body tracking-widest uppercase px-2 py-0.5 rounded-sm">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Compose */}
      <GlassCard className="p-6">
        <h2 className="text-warm-white text-sm font-body font-medium mb-4">Compose creative brief</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <CardGroup label="Tour" options={TOURS} value={tour} onChange={(v) => setTour(v as Tour)} />
          <CardGroup label="Angle" options={ANGLES} value={angle} onChange={(v) => setAngle(v as Angle)} />
          <CardGroup label="Platform" options={PLATFORMS} value={platform} onChange={(v) => setPlatform(v as Platform)} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase mb-2 block">
              Variant count
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={goalCount}
              onChange={(e) => setGoalCount(parseInt(e.target.value, 10))}
              className="w-full accent-teal"
            />
            <p className="text-warm-white/60 text-xs font-body mt-1">{goalCount} variant{goalCount === 1 ? "" : "s"} per generation</p>
          </div>
          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase mb-2 block">
              Operator note (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. emphasize 'no chase, no bait' angle"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full bg-white/[0.04] border border-teal/15 text-warm-white text-sm font-body px-3 py-2 rounded-sm focus:outline-none focus:border-teal/40 placeholder-warm-white/25"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/10">
          <p className="text-warm-white/50 text-xs font-body">
            {selectedAssetIds.size === 0
              ? "Generating without specific footage — copy will work with any Bajablue assets."
              : `${selectedAssetIds.size} asset${selectedAssetIds.size === 1 ? "" : "s"} will inform the copy.`}
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-teal text-deep text-sm font-body font-medium tracking-wide px-6 py-2.5 rounded-sm hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {generating ? "Generating..." : `Generate ${goalCount} variant${goalCount === 1 ? "" : "s"}`}
          </button>
        </div>
      </GlassCard>

      {/* Results */}
      {error && (
        <GlassCard className="p-5 border-red-400/30">
          <p className="text-red-400 text-sm font-body font-medium mb-1">
            {needsApiKey ? "Anthropic API key required" : "Generation failed"}
          </p>
          <p className="text-warm-white/65 text-xs font-body">{error}</p>
          {needsApiKey && (
            <p className="text-warm-white/55 text-xs font-body mt-3 leading-relaxed">
              Add the ANTHROPIC_API_KEY env var to your Vercel project (Settings → Environment Variables) and redeploy.
              The Creative Engine UI runs without it; generation requires the key.
            </p>
          )}
        </GlassCard>
      )}

      {result && (
        <GlassCard className="p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-warm-white text-sm font-body font-medium">
              {result.variants.length} variants generated
            </h2>
            <span className="text-warm-white/40 text-[10px] font-body tracking-widest uppercase">
              ~${result.rawCost.usd.toFixed(4)} · {result.rawCost.inputTokens + result.rawCost.outputTokens} tokens
            </span>
          </div>

          <div className="space-y-3">
            {result.variants.map((v, i) => (
              <div key={v.id} className="bg-white/[0.03] border border-teal/15 rounded-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-teal-light text-[9px] font-body tracking-[0.3em] uppercase mb-1">
                      Variant {i + 1}
                    </p>
                    <h3 className="text-warm-white text-base font-body font-medium leading-tight">{v.headline}</h3>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(formatForClipboard(v))}
                    className="text-warm-white/55 hover:text-warm-white text-[10px] font-body tracking-widest uppercase border border-white/15 hover:border-teal/40 px-3 py-1 rounded-sm transition-colors flex-shrink-0"
                  >
                    Copy all
                  </button>
                </div>

                <p className="text-warm-white/80 text-sm font-body leading-relaxed mb-2 whitespace-pre-line">
                  {v.caption}
                </p>

                <div className="flex flex-wrap gap-3 text-[11px] font-body items-center">
                  <span className="text-warm-white/45">CTA:</span>
                  <span className="text-warm-white">{v.cta}</span>
                </div>

                {v.hashtags && v.hashtags.length > 0 && (
                  <p className="text-teal-light/85 text-xs font-body mt-2">
                    {v.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-white/[0.06] grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-warm-white/35 text-[9px] font-body tracking-[0.3em] uppercase mb-1">Why it works</p>
                    <p className="text-warm-white/65 text-xs font-body italic leading-snug">{v.rationale}</p>
                  </div>
                  <div>
                    <p className="text-warm-white/35 text-[9px] font-body tracking-[0.3em] uppercase mb-1">Tracking UTM</p>
                    <code className="text-teal-light/85 text-[10px] font-mono break-all leading-tight">{v.utm}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function CardGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; sub: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase mb-2">{label}</p>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-sm border transition-all ${
                active
                  ? "border-teal/60 bg-teal/10 text-warm-white"
                  : "border-white/10 bg-white/[0.02] text-warm-white/65 hover:border-teal/30"
              }`}
            >
              <p className="text-sm font-body font-medium leading-tight">{opt.label}</p>
              <p className={`text-[10px] font-body leading-tight mt-0.5 ${active ? "text-teal-light/85" : "text-warm-white/40"}`}>
                {opt.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatForClipboard(v: Variant): string {
  return [
    v.headline,
    "",
    v.caption,
    "",
    `CTA: ${v.cta}`,
    v.hashtags && v.hashtags.length > 0 ? "" : null,
    v.hashtags && v.hashtags.length > 0 ? v.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ") : null,
    "",
    `Tracking: ${v.utm}`,
  ]
    .filter((x) => x !== null)
    .join("\n");
}
