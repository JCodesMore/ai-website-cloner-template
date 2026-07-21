import { NextResponse } from "next/server";
import { getDetail, type MediaType } from "@/lib/tmdb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const { type, id } = await params;
  const mediaType: MediaType = type === "movie" ? "movie" : "tv";
  const tmdbId = Number(id);
  if (!tmdbId) return NextResponse.json({ error: "bad id" }, { status: 400 });
  try {
    const detail = await getDetail(mediaType, tmdbId);
    return NextResponse.json(detail);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "detail failed" },
      { status: 502 },
    );
  }
}
