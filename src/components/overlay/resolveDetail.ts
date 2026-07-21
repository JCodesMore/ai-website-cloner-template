import type { AnimeCardData, AnimeDetail, CastMember } from "@/types/anime";
import { heroSlides, rows } from "@/data/mock";

const allCards: AnimeCardData[] = rows.flatMap((r) => r.items);

const GENRE_POOL = ["Action", "Adventure", "Fantasy", "Drama", "Supernatural", "Comedy"];
const CAST_POOL: CastMember[] = [
  { name: "Yuki Kaji", character: "Lead" },
  { name: "Aoi Yuki", character: "Deuteragonist" },
  { name: "Nobuhiko Okamoto", character: "Rival" },
  { name: "Saori Hayami", character: "Support" },
  { name: "Yoshimasa Hosoya", character: "Mentor" },
  { name: "Kana Hanazawa", character: "Heroine" },
];

/** Build a rich AnimeDetail from a shallow card, borrowing hero data when the slug matches. */
export function resolveDetail(card: AnimeCardData): AnimeDetail {
  const hero = heroSlides.find(
    (h) => h.slug === card.slug || card.slug.endsWith(h.slug),
  );

  const episodeCount =
    hero?.episodeCount ??
    (card.episodeBadge ? parseInt(card.episodeBadge.replace(/\D/g, ""), 10) || 12 : 12);

  const score = card.score ?? hero?.score ?? 78;

  return {
    id: card.id,
    slug: card.slug,
    title: card.title,
    poster: card.poster,
    backdrop: hero?.backdrop ?? card.poster,
    synopsis:
      hero?.synopsis ??
      `${card.title} follows an unforgettable journey packed with breathtaking action, heartfelt drama, and a world you won't want to leave. A standout entry that fans and newcomers alike keep coming back to.`,
    score,
    rank: null,
    popularity: "732K",
    favourites: "48K",
    format: card.format ?? hero?.format ?? "TV",
    episodeCount,
    duration: hero?.duration ?? 24,
    status: card.status ?? "FINISHED",
    season: "FALL",
    year: hero?.year ?? 2023,
    genres: (hero?.genres && hero.genres.length ? hero.genres : GENRE_POOL).slice(0, 5),
    studios: ["MAPPA", "Studio Pierrot"],
    cast: CAST_POOL,
  };
}

/** A handful of "More Like This" cards, excluding the current one. */
export function resolveSimilar(card: AnimeCardData, count = 12): AnimeCardData[] {
  return allCards.filter((c) => c.id !== card.id).slice(0, count);
}
