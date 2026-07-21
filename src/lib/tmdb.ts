// Server-only TMDB integration — ported from Zynema's server.mjs.
// Provides the real anime catalog, detail, seasons/episodes and search.
import "server-only";
import type {
  AnimeCardData,
  AnimeDetail,
  AnimeFormat,
  AnimeStatus,
  CastMember,
  EpisodeData,
  HeroSlide,
  SeasonEntry,
} from "@/types/anime";

const READ_TOKEN = process.env.TMDB_READ_TOKEN || "";
const API_BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export type MediaType = "tv" | "movie";

/** Core TMDB fetch helper (Bearer auth), mirrors Zynema's tmdbGet. */
export async function tmdbGet<T = Record<string, unknown>>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${READ_TOKEN}`,
      Accept: "application/json",
    },
    // TMDB catalog is stable enough to cache; revalidate hourly.
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB ${path} -> ${res.status}`);
  return (await res.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Mapping helpers                                                     */
/* ------------------------------------------------------------------ */

interface TmdbItem {
  id: number;
  media_type?: string;
  name?: string;
  title?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  first_air_date?: string;
  release_date?: string;
  number_of_episodes?: number | null;
  genre_ids?: number[];
  origin_country?: string[];
}

function img(path: string | null | undefined, size = "w500"): string {
  return path ? `${IMG}/${size}${path}` : "";
}

function yearOf(item: TmdbItem): number | undefined {
  const d = item.first_air_date || item.release_date;
  return d ? Number(d.slice(0, 4)) : undefined;
}

function mediaOf(item: TmdbItem, fallback?: MediaType): MediaType {
  if (item.media_type === "movie" || item.media_type === "tv") return item.media_type;
  if (item.title && !item.name) return "movie";
  if (fallback) return fallback;
  return "tv";
}

/** TMDB list item -> AnimeCardData for rows/hero grids. */
export function normCard(item: TmdbItem, fallbackType?: MediaType): AnimeCardData {
  const type = mediaOf(item, fallbackType);
  return {
    id: `${type}-${item.id}`,
    slug: `${type}-${item.id}`,
    tmdbId: item.id,
    mediaType: type,
    title: item.title || item.name || "Untitled",
    poster: img(item.poster_path, "w500"),
    backdrop: img(item.backdrop_path, "w1280"),
    score: item.vote_average ? Math.round(item.vote_average * 10) : undefined,
    format: type === "movie" ? "MOVIE" : "TV",
  };
}

function normList(items: TmdbItem[] = [], fallbackType?: MediaType): AnimeCardData[] {
  return items
    .filter((i) => i.poster_path)
    .map((i) => normCard(i, fallbackType));
}

/* ------------------------------------------------------------------ */
/* Catalog sections                                                    */
/* ------------------------------------------------------------------ */

const ANIME_DISCOVER = {
  with_genres: "16",
  with_origin_country: "JP",
};

export async function getTrendingAnime(page = 1): Promise<AnimeCardData[]> {
  const data = await tmdbGet<{ results: TmdbItem[] }>("/discover/tv", {
    ...ANIME_DISCOVER,
    page: String(page),
    sort_by: "popularity.desc",
  });
  return normList(data.results, "tv");
}

export async function getTopAnime(): Promise<AnimeCardData[]> {
  const data = await tmdbGet<{ results: TmdbItem[] }>("/discover/tv", {
    ...ANIME_DISCOVER,
    page: "1",
    sort_by: "vote_average.desc",
    "vote_count.gte": "200",
  });
  return normList(data.results, "tv");
}

export async function getPopularAnime(page = 1): Promise<AnimeCardData[]> {
  const data = await tmdbGet<{ results: TmdbItem[] }>("/discover/tv", {
    ...ANIME_DISCOVER,
    page: String(page),
    sort_by: "popularity.desc",
    "first_air_date.gte": `${new Date().getFullYear()}-01-01`,
  });
  return normList(data.results, "tv");
}

export async function getRecentAnime(page = 1): Promise<AnimeCardData[]> {
  const data = await tmdbGet<{ results: TmdbItem[] }>("/discover/tv", {
    ...ANIME_DISCOVER,
    page: String(page),
    sort_by: "first_air_date.desc",
    "vote_count.gte": "10",
    "first_air_date.lte": new Date().toISOString().slice(0, 10),
  });
  return normList(data.results, "tv");
}

export async function getAnimeMovies(page = 1): Promise<AnimeCardData[]> {
  const data = await tmdbGet<{ results: TmdbItem[] }>("/discover/movie", {
    with_genres: "16",
    with_origin_country: "JP",
    page: String(page),
    sort_by: "popularity.desc",
  });
  return normList(data.results, "movie");
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

interface TmdbImages {
  logos?: { file_path: string; iso_639_1: string | null }[];
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const data = await tmdbGet<{ results: TmdbItem[] }>("/discover/tv", {
    ...ANIME_DISCOVER,
    page: "1",
    sort_by: "popularity.desc",
    "vote_count.gte": "300",
  });
  const picks = (data.results || []).filter((i) => i.backdrop_path).slice(0, 6);

  const slides = await Promise.all(
    picks.map(async (item): Promise<HeroSlide> => {
      let logo: string | undefined;
      try {
        const imgs = await tmdbGet<TmdbImages>(`/tv/${item.id}/images`, {
          include_image_language: "en,null",
        });
        const en = imgs.logos?.find((l) => l.iso_639_1 === "en") || imgs.logos?.[0];
        if (en) logo = img(en.file_path, "w500");
      } catch {
        /* logo optional */
      }
      return {
        id: `tv-${item.id}`,
        slug: `tv-${item.id}`,
        tmdbId: item.id,
        mediaType: "tv",
        title: item.name || item.title || "Untitled",
        logo,
        backdrop: img(item.backdrop_path, "w1280"),
        thumbnail: img(item.poster_path, "w500"),
        synopsis: item.overview || "",
        score: item.vote_average ? Math.round(item.vote_average * 10) : undefined,
        year: yearOf(item),
        episodeCount: item.number_of_episodes ?? null,
        duration: 24,
        format: "TV",
      };
    }),
  );
  return slides;
}

/* ------------------------------------------------------------------ */
/* Detail                                                              */
/* ------------------------------------------------------------------ */

interface TmdbDetail {
  id: number;
  name?: string;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  number_of_episodes?: number | null;
  episode_run_time?: number[];
  runtime?: number;
  status?: string;
  first_air_date?: string;
  release_date?: string;
  genres?: { id: number; name: string }[];
  production_companies?: { name: string }[];
  seasons?: {
    season_number: number;
    name: string;
    episode_count: number;
    poster_path?: string | null;
    air_date?: string;
  }[];
  credits?: {
    cast?: { name: string; character: string; profile_path?: string | null }[];
  };
  recommendations?: { results?: TmdbItem[] };
  similar?: { results?: TmdbItem[] };
}

function mapStatus(s?: string): AnimeStatus {
  switch (s) {
    case "Returning Series":
    case "In Production":
      return "RELEASING";
    case "Ended":
    case "Released":
      return "FINISHED";
    case "Planned":
    case "Post Production":
      return "NOT_YET_RELEASED";
    case "Canceled":
      return "CANCELLED";
    default:
      return "FINISHED";
  }
}

function compact(n?: number | null): string | null {
  if (!n) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export async function getDetail(type: MediaType, id: number): Promise<AnimeDetail> {
  const d = await tmdbGet<TmdbDetail>(`/${type}/${id}`, {
    append_to_response: "credits,images,recommendations,similar",
  });

  const seasons: SeasonEntry[] = (d.seasons || [])
    .filter((s) => s.season_number > 0 && s.episode_count > 0)
    .map((s) => ({
      id: `s${s.season_number}`,
      slug: `s${s.season_number}`,
      title: s.name,
      thumbnail: img(s.poster_path, "w500"),
      season: "FALL",
      format: "TV",
      year: s.air_date ? Number(s.air_date.slice(0, 4)) : 0,
      seasonNumber: s.season_number,
      episodeCount: s.episode_count,
    }));

  const cast: CastMember[] = (d.credits?.cast || []).slice(0, 12).map((c) => ({
    name: c.name,
    character: c.character,
    avatar: img(c.profile_path, "w300"),
  }));

  const runtime =
    (d.episode_run_time && d.episode_run_time[0]) || d.runtime || 24;

  const recs = [
    ...(d.recommendations?.results || []),
    ...(d.similar?.results || []),
  ];
  const seen = new Set<number>();
  const similar: AnimeCardData[] = [];
  for (const r of recs) {
    if (!r.poster_path || seen.has(r.id) || r.id === d.id) continue;
    seen.add(r.id);
    similar.push(normCard(r, type));
    if (similar.length >= 12) break;
  }

  return {
    id: `${type}-${d.id}`,
    slug: `${type}-${d.id}`,
    tmdbId: d.id,
    mediaType: type,
    title: d.title || d.name || "Untitled",
    poster: img(d.poster_path, "w500"),
    backdrop: img(d.backdrop_path, "w1280"),
    synopsis: d.overview || "",
    score: d.vote_average ? Math.round(d.vote_average * 10) : undefined,
    rank: null,
    popularity: compact(d.popularity ? Math.round(d.popularity * 100) : null) || undefined,
    favourites: compact(d.vote_count),
    format: type === "movie" ? "MOVIE" : "TV",
    episodeCount: d.number_of_episodes ?? (type === "movie" ? 1 : null),
    duration: runtime,
    status: mapStatus(d.status),
    year: yearOf(d as TmdbItem),
    genres: (d.genres || []).map((g) => g.name).slice(0, 5),
    studios: (d.production_companies || []).map((c) => c.name).slice(0, 3),
    seasons: seasons.length > 1 ? seasons : undefined,
    cast,
    similar,
  };
}

/* ------------------------------------------------------------------ */
/* Season / episodes                                                   */
/* ------------------------------------------------------------------ */

interface TmdbSeason {
  episodes?: {
    episode_number: number;
    name: string;
    overview?: string;
    still_path?: string | null;
    air_date?: string;
    runtime?: number | null;
    vote_average?: number;
  }[];
}

export async function getSeasonEpisodes(
  id: number,
  season: number,
): Promise<EpisodeData[]> {
  const d = await tmdbGet<TmdbSeason>(`/tv/${id}/season/${season}`);
  return (d.episodes || []).map((ep) => ({
    number: ep.episode_number,
    title: ep.name,
    overview: ep.overview || "",
    still: img(ep.still_path, "w500"),
    airDate: ep.air_date || "",
    runtime: ep.runtime || undefined,
    score: ep.vote_average ? Math.round(ep.vote_average * 10) : undefined,
  }));
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export async function searchTitles(query: string): Promise<AnimeCardData[]> {
  if (!query.trim()) return [];
  const data = await tmdbGet<{ results: TmdbItem[] }>("/search/multi", {
    query,
    page: "1",
    include_adult: "false",
  });
  return (data.results || [])
    .filter(
      (i) =>
        (i.media_type === "tv" || i.media_type === "movie") &&
        i.poster_path &&
        (i.genre_ids || []).includes(16),
    )
    .map((i) => normCard(i));
}

/** Broader search (not anime-restricted) — used as fallback if anime search is thin. */
export async function searchAll(query: string): Promise<AnimeCardData[]> {
  if (!query.trim()) return [];
  const data = await tmdbGet<{ results: TmdbItem[] }>("/search/multi", {
    query,
    page: "1",
    include_adult: "false",
  });
  return (data.results || [])
    .filter((i) => (i.media_type === "tv" || i.media_type === "movie") && i.poster_path)
    .map((i) => normCard(i));
}
