import { NextResponse } from "next/server";
import { getStreamUrls, type StreamType } from "@/lib/providers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const { type, id } = await params;
  const streamType: StreamType = type === "movie" ? "movie" : "tv";
  const tmdbId = Number(id);
  if (!tmdbId) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const url = new URL(req.url);
  const season = Number(url.searchParams.get("s")) || 1;
  const episode = Number(url.searchParams.get("e")) || 1;

  const providers = getStreamUrls(streamType, tmdbId, season, episode);
  return NextResponse.json({ providers });
}
