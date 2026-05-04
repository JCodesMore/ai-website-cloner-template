/**
 * Cortex Variant Generator.
 *
 * Given a brief (tour, angle, format) + selected assets, generates N
 * on-brand variants of headlines, captions, CTAs using Claude.
 *
 * The brand voice profile is the spine — every prompt is anchored to it so
 * generated copy stays consistent across thousands of variants.
 */

import Anthropic from "@anthropic-ai/sdk";
import { type BrandVoice } from "./brand-voice";
import { type Asset } from "./asset-library";

export type GenerateBrief = {
  voice: BrandVoice;
  tour: "master-seafari" | "blue-expedition" | "ocean-safari" | "general";
  angle: "us-canada-cold" | "mexico-domestic" | "retargeting" | "lookalike" | "organic-social";
  platform: "instagram-reel" | "instagram-feed" | "facebook-ad" | "tiktok" | "google-search-ad" | "blog";
  selectedAssets: Asset[]; // 0-5 assets the operator picked
  goalCount?: number; // how many variants per output (default 5)
  customNote?: string; // operator's freeform note ("emphasize ethical observation", "test 'no chase' angle")
};

export type GeneratedVariant = {
  id: string; // local id for tracking
  headline: string;
  caption: string;
  cta: string;
  hashtags?: string[];
  utm: string; // pre-built tracking string
  rationale: string; // short note on why this variant should work
};

export type GenerationResult = {
  generatedAt: string;
  brief: {
    tour: string;
    angle: string;
    platform: string;
    assetIds: string[];
  };
  variants: GeneratedVariant[];
  rawCost: { inputTokens: number; outputTokens: number; usd: number };
};

const ANGLE_DESCRIPTIONS: Record<GenerateBrief["angle"], string> = {
  "us-canada-cold": "Cold prospecting US + Canadian adventure travelers age 35-60 who haven't heard of Bajablue. Lead with the Sea of Cortez specifically (UNESCO, 39% of marine mammals). Match the audience's love of intentional travel and ethical wildlife.",
  "mexico-domestic": "Mexican domestic travelers from Mexico City, Guadalajara, Monterrey looking for premium Baja experiences. Lead with quality + small-group + Spanish-language readiness. Tone: refined, not touristy.",
  retargeting: "People who already visited bajablue.mx and didn't book. They know the brand. Address the soft objections: pricing, dates, what to expect. Move them off the fence.",
  lookalike: "Audiences similar to past Bajablue customers. Lead with social proof and the specific moments that matter (an orca surfacing 30m off the bow, a single mobula gliding under).",
  "organic-social": "Followers of the Bajablue IG/FB. They engage but rarely convert. Build narrative depth — the founders-and-team voice, the season, the small details. No CTA pressure.",
};

const PLATFORM_DIRECTIVES: Record<GenerateBrief["platform"], string> = {
  "instagram-reel": "Hook in first 1.5 seconds (text overlay or first line of caption). Caption: 30-60 words. Use 5-8 hashtags. Caption uses line breaks. CTA in caption final line.",
  "instagram-feed": "Single image or carousel post. Caption: 60-100 words. 8-12 hashtags. First sentence is the hook. Last sentence is soft CTA.",
  "facebook-ad": "Headline ≤25 chars (this is the bold short text). Body 80-125 words. CTA button text 2-3 words. No hashtags. Treat headline + body as the read-together unit.",
  tiktok: "Caption ≤150 chars. 2-4 hashtags. Hook in first line. Conversational, not promotional. No 'BOOK NOW'.",
  "google-search-ad": "Headlines (3): each ≤30 chars. Description (2): each ≤90 chars. No emojis. No hashtags. Keyword-focused but readable.",
  blog: "Headline: SEO-friendly + emotional. Caption: 150-200 words intro paragraph. CTA: end of intro. This is intro copy, not full blog post.",
};

export function buildSystemPrompt(voice: BrandVoice): string {
  return `You are the Cortex creative engine writing on behalf of ${voice.identity}.

# Brand voice (CARDINAL — these are HARD rules, never violate them)
${voice.cardinalRules.map((r, i) => `${i + 1}. ${r}`).join("\n")}

# Tone
${voice.tone}

# Word palette (preferred vocabulary — use these)
${voice.wordPalette.join(", ")}

# Banned words/phrases (NEVER use these)
${voice.bannedWords.join(", ")}

# CTA style
${voice.ctaStyle}

# Format constraints
- Headline: ${voice.formats.headline.minWords}-${voice.formats.headline.maxWords} words. ${voice.formats.headline.style}
- Caption: ${voice.formats.caption.minWords}-${voice.formats.caption.maxWords} words. ${voice.formats.caption.style}
- CTA: ${voice.formats.cta.style}

# Examples — use these as your reference for what good looks like
GOOD examples (write like these):
${voice.examples.good.map((e, i) => `${i + 1}. ${e}`).join("\n")}

BAD examples (NEVER write like these):
${voice.examples.bad.map((e, i) => `${i + 1}. ${e}`).join("\n")}

# Audience
Primary: ${voice.audience.primary}
${voice.audience.secondary ? `Secondary: ${voice.audience.secondary}` : ""}
${voice.audience.domestic ? `Domestic: ${voice.audience.domestic}` : ""}

# Output format
You output ONLY valid JSON matching the schema the user provides — no preamble, no markdown fences, no commentary. Just the JSON object.`;
}

export function buildUserPrompt(brief: GenerateBrief): string {
  const count = brief.goalCount || 5;
  const tourCopy =
    brief.tour === "general"
      ? "Bajablue's range of marine wildlife trips"
      : brief.tour === "master-seafari"
      ? "the Master Seafari (premium expedition tier — orca pursuit, smallest groups, longest day)"
      : brief.tour === "blue-expedition"
      ? "the Blue Expedition (mid-tier — full marine wildlife range over 6-8 hours)"
      : "the Ocean Safari (entry tier — half-day mobula and dolphin focus)";

  const assetSummary =
    brief.selectedAssets.length > 0
      ? `# Available footage / photos
The operator selected ${brief.selectedAssets.length} asset(s) to pair with this copy:
${brief.selectedAssets
  .map(
    (a, i) =>
      `${i + 1}. ${a.format} (${a.aspect}, ${a.mood}) — ${a.caption || a.tags.join(", ")}. Subjects: ${a.subjects.join(", ")}.`
  )
  .join("\n")}

Write copy that complements this footage. Reference the specific subjects/mood when it strengthens the message, but don't restate what the viewer can see.`
      : `# Available footage / photos
No specific assets selected. Write copy that works with general Bajablue footage.`;

  return `Generate ${count} creative variants for the following brief.

# Tour
${tourCopy}

# Angle
${ANGLE_DESCRIPTIONS[brief.angle]}

# Platform
${brief.platform} — ${PLATFORM_DIRECTIVES[brief.platform]}

${assetSummary}

${brief.customNote ? `# Operator note\n${brief.customNote}\n` : ""}

# Required output JSON schema
{
  "variants": [
    {
      "headline": "string — the headline / first hook",
      "caption": "string — the body copy / caption",
      "cta": "string — the call to action (soft, brand-appropriate)",
      "hashtags": ["string", ...] (only for instagram-reel, instagram-feed, tiktok platforms; omit for ads),
      "rationale": "string — one sentence on why this variant should land with this audience"
    }
  ]
}

Generate ${count} distinctly different variants — different angles, different hooks, different ways into the same brief. Make each one feel like a different creative direction, not a permutation. Output the JSON only.`;
}

/**
 * Run the variant generator. Requires ANTHROPIC_API_KEY env var.
 *
 * Returns a GenerationResult with N variants + a rough cost estimate.
 * Falls back to a clear error response when the API key is missing so the UI
 * can show a useful prompt rather than crash.
 */
export async function generateVariants(brief: GenerateBrief): Promise<GenerationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY not set. Add it to your Vercel project environment variables to enable AI generation."
    );
  }

  const client = new Anthropic({ apiKey });
  const systemPrompt = buildSystemPrompt(brief.voice);
  const userPrompt = buildUserPrompt(brief);

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Pull text content out of response
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  let parsed: { variants: Omit<GeneratedVariant, "id" | "utm">[] };
  try {
    // Strip any accidental markdown fences
    const cleaned = textBlock.text.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(
      `Claude returned invalid JSON: ${e instanceof Error ? e.message : "unknown"}. Raw: ${textBlock.text.slice(0, 300)}`
    );
  }

  // Add ids + UTM strings to each variant
  const ts = Date.now();
  const variants: GeneratedVariant[] = parsed.variants.map((v, i) => {
    const variantId = `${brief.tour}-${brief.angle}-${brief.platform}-${ts}-${i}`;
    return {
      id: variantId,
      headline: v.headline,
      caption: v.caption,
      cta: v.cta,
      hashtags: v.hashtags || [],
      rationale: v.rationale,
      utm: buildUtm(brief, variantId),
    };
  });

  // Cost estimate (Claude Sonnet 4.5 pricing as of 2025-Q4)
  const inputTokens = response.usage.input_tokens;
  const outputTokens = response.usage.output_tokens;
  const usd = (inputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;

  return {
    generatedAt: new Date(ts).toISOString(),
    brief: {
      tour: brief.tour,
      angle: brief.angle,
      platform: brief.platform,
      assetIds: brief.selectedAssets.map((a) => a.id),
    },
    variants,
    rawCost: { inputTokens, outputTokens, usd: parseFloat(usd.toFixed(4)) },
  };
}

function buildUtm(brief: GenerateBrief, variantId: string): string {
  const sourceMap: Record<GenerateBrief["platform"], string> = {
    "instagram-reel": "instagram",
    "instagram-feed": "instagram",
    "facebook-ad": "facebook",
    tiktok: "tiktok",
    "google-search-ad": "google",
    blog: "blog",
  };
  const mediumMap: Record<GenerateBrief["platform"], string> = {
    "instagram-reel": "social-reel",
    "instagram-feed": "social-feed",
    "facebook-ad": "paid",
    tiktok: "social-tiktok",
    "google-search-ad": "paid-search",
    blog: "owned",
  };
  return `?utm_source=${sourceMap[brief.platform]}&utm_medium=${mediumMap[brief.platform]}&utm_campaign=${brief.tour}-${brief.angle}&utm_content=${variantId}`;
}
