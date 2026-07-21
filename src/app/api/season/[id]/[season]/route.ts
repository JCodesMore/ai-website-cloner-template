import { NextResponse } from "next/server";
import { getSeasonEpisodes } from "@/lib/tmdb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; season: string }> },
) {
  const { id, season } = await params;
  const tmdbId = Number(id);
  const seasonNum = Number(season) || 1;
  if (!tmdbId) return NextResponse.json({ error: "bad id" }, { status: 400 });
  try {
    const episodes = await getSeasonEpisodes(tmdbId, seasonNum);
    return NextResponse.json({ episodes });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "season failed" },
      { status: 502 },
    );
  }
}
