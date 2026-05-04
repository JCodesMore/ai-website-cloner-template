import { NextRequest, NextResponse } from "next/server";
import { getBrandVoice } from "@/lib/cortex/brand-voice";
import { SEED_ASSETS } from "@/lib/cortex/asset-library";
import { generateVariants, type GenerateBrief } from "@/lib/cortex/generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel — Claude calls can take 20-40s

type GenerateRequestBody = {
  projectId: string;
  tour: GenerateBrief["tour"];
  angle: GenerateBrief["angle"];
  platform: GenerateBrief["platform"];
  assetIds?: string[];
  goalCount?: number;
  customNote?: string;
};

/**
 * POST /api/cortex/generate — generate N variants for a creative brief.
 *
 * Body:
 *   projectId: 'bajablue' (today) — multi-tenant ready
 *   tour: which tour the variants are for
 *   angle: us-canada-cold | mexico-domestic | retargeting | lookalike | organic-social
 *   platform: instagram-reel | facebook-ad | google-search-ad | ...
 *   assetIds?: array of asset ids to pair with this copy (optional)
 *   goalCount?: variants to generate (default 5, max 10)
 *   customNote?: operator freeform note ("emphasize 'no chase' angle")
 *
 * Response: GenerationResult with N variants + cost breakdown.
 */
export async function POST(req: NextRequest) {
  let body: GenerateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.projectId || !body.tour || !body.angle || !body.platform) {
    return NextResponse.json(
      { ok: false, error: "Required: projectId, tour, angle, platform" },
      { status: 400 }
    );
  }

  let voice;
  try {
    voice = getBrandVoice(body.projectId);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown brand voice error" },
      { status: 400 }
    );
  }

  const selectedAssets = (body.assetIds || [])
    .map((id) => SEED_ASSETS.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  const goalCount = Math.min(Math.max(body.goalCount || 5, 1), 10);

  const brief: GenerateBrief = {
    voice,
    tour: body.tour,
    angle: body.angle,
    platform: body.platform,
    selectedAssets,
    goalCount,
    customNote: body.customNote,
  };

  try {
    const result = await generateVariants(brief);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const isApiKeyMissing = msg.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      { ok: false, error: msg, needsApiKey: isApiKeyMissing },
      { status: isApiKeyMissing ? 503 : 500 }
    );
  }
}
