import { NextResponse } from "next/server";
import { searchTitles, searchAll } from "@/lib/tmdb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json({ results: [] });
  try {
    let results = await searchTitles(q);
    if (results.length < 4) {
      // Fall back to a broad search when the anime-only filter is too thin.
      const seen = new Set(results.map((r) => r.id));
      const extra = (await searchAll(q)).filter((r) => !seen.has(r.id));
      results = [...results, ...extra];
    }
    return NextResponse.json({ results: results.slice(0, 30) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "search failed", results: [] },
      { status: 502 },
    );
  }
}
