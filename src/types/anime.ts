// Data model derived from animesaga.net detail + row structures

export type AnimeStatus = "RELEASING" | "FINISHED" | "NOT_YET_RELEASED" | "CANCELLED";
export type AnimeFormat = "TV" | "MOVIE" | "OVA" | "ONA" | "SPECIAL" | "MUSIC";
export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export interface AnimeCardData {
  id: string;
  slug: string;
  title: string;
  poster: string;
  backdrop?: string;
  tmdbId?: number;
  mediaType?: "tv" | "movie";
  episodeBadge?: string; // e.g. "Ep 14"
  status?: AnimeStatus;
  score?: number;
  format?: AnimeFormat;
}

export interface SeasonEntry {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  season: Season;
  format: AnimeFormat;
  year: number;
  active?: boolean;
  seasonNumber?: number;
  episodeCount?: number;
}

export interface EpisodeData {
  number: number;
  title: string;
  overview: string;
  still: string;
  airDate: string;
  runtime?: number;
  score?: number;
}

export interface CastMember {
  name: string;
  character: string;
  avatar?: string;
}

export interface TrackLink {
  provider: "AniList" | "MAL" | "AniDB" | "Kitsu" | "Anime-Planet";
  url: string;
}

export interface AnimeDetail {
  id: string;
  slug: string;
  tmdbId?: number;
  mediaType?: "tv" | "movie";
  title: string;
  poster: string;
  backdrop: string;
  synopsis: string;
  score?: number;
  rank?: number | null;
  popularity?: string; // "732K"
  favourites?: string | null;
  format: AnimeFormat;
  episodeCount?: number | null;
  duration?: number; // minutes
  status: AnimeStatus;
  season?: Season;
  year?: number;
  genres: string[];
  studios: string[];
  tags?: string[];
  trackLinks?: TrackLink[];
  seasons?: SeasonEntry[];
  cast?: CastMember[];
  specialEpisodes?: string[];
  similar?: AnimeCardData[];
}

export interface HeroSlide {
  id: string;
  slug: string;
  tmdbId?: number;
  mediaType?: "tv" | "movie";
  title: string;
  logo?: string; // title logo image
  backdrop: string;
  thumbnail?: string; // small card used in the slide selector strip
  synopsis: string;
  score?: number; // percent match, e.g. 85
  year?: number;
  episodeCount?: number | null;
  duration?: number; // minutes
  format?: AnimeFormat;
  genres?: string[];
}

export interface AnimeRow {
  id: string;
  heading: string;
  badge?: "HOT" | "SEASONAL" | "TOP" | "NEW";
  viewAllHref?: string;
  items: AnimeCardData[];
}
