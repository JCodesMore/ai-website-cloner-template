import { NextRequest, NextResponse } from "next/server";
import { SEED_ASSETS, filterAssets, type AssetFilter } from "@/lib/cortex/asset-library";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/cortex/assets — list all assets in the library, with optional filtering.
 *
 * Query params:
 *   format=video|image
 *   tour=master-seafari|blue-expedition|ocean-safari|general
 *   subjects=orca,mobula  (comma-separated, matches if asset has ANY)
 *   mood=action|golden-hour|...
 *   aspect=16:9|9:16|...
 *   tags=hero,reel-ready  (comma-separated, matches if asset has ANY)
 *
 * Currently returns the seed library. Once Firestore-backed uploads are
 * wired (next iteration), this merges Firestore assets on top.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const filter: AssetFilter = {};
  if (url.searchParams.get("format")) filter.format = url.searchParams.get("format") as AssetFilter["format"];
  if (url.searchParams.get("tour")) filter.tour = url.searchParams.get("tour") as AssetFilter["tour"];
  if (url.searchParams.get("mood")) filter.mood = url.searchParams.get("mood") as AssetFilter["mood"];
  if (url.searchParams.get("aspect")) filter.aspect = url.searchParams.get("aspect") as AssetFilter["aspect"];
  if (url.searchParams.get("subjects")) {
    filter.subjects = url.searchParams.get("subjects")!.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (url.searchParams.get("tags")) {
    filter.tags = url.searchParams.get("tags")!.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const assets = filterAssets(SEED_ASSETS, filter);

  return NextResponse.json({
    ok: true,
    total: assets.length,
    assets,
    metadata: {
      counts: {
        videos: SEED_ASSETS.filter((a) => a.format === "video").length,
        images: SEED_ASSETS.filter((a) => a.format === "image").length,
        total: SEED_ASSETS.length,
      },
      filter,
    },
  });
}
