import type { AnimeRow, HeroSlide, AnimeCardData } from "@/types/anime";

// Real, verified-reachable artwork from thetvdb.com (allowlisted in next.config).
const BACK_ONEPIECE = "https://artworks.thetvdb.com/banners/v4/series/81797/backgrounds/616009a8bd688.jpg";
const BACK_ALT = "https://artworks.thetvdb.com/banners/v4/series/467401/backgrounds/6a4bcf0d73596.jpg";

function card(
  id: string,
  title: string,
  poster: string,
  episodeBadge?: string,
  status?: AnimeCardData["status"],
): AnimeCardData {
  return { id, slug: id, title, poster, episodeBadge, status };
}

export const heroSlides: HeroSlide[] = [
  {
    id: "one-piece",
    slug: "one-piece",
    title: "One Piece",
    backdrop: BACK_ONEPIECE,
    thumbnail: BACK_ONEPIECE,
    synopsis:
      "Gold Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world.",
    score: 92,
    year: 1999,
    episodeCount: 1122,
    duration: 24,
    format: "TV",
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy"],
  },
  {
    id: "jujutsu-kaisen",
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    backdrop: BACK_ALT,
    thumbnail: BACK_ALT,
    synopsis:
      "Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life until he swallows a cursed talisman to protect his friends.",
    score: 86,
    year: 2020,
    episodeCount: 47,
    duration: 24,
    format: "TV",
    genres: ["Action", "Supernatural", "Horror"],
  },
  {
    id: "demon-slayer",
    slug: "demon-slayer",
    title: "Demon Slayer",
    backdrop: BACK_ONEPIECE,
    thumbnail: BACK_ONEPIECE,
    synopsis:
      "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon.",
    score: 87,
    year: 2019,
    episodeCount: 55,
    duration: 24,
    format: "TV",
    genres: ["Action", "Fantasy"],
  },
];

const posters = {
  a: "https://artworks.thetvdb.com/banners/posters/267440-2.jpg",
  b: "https://artworks.thetvdb.com/banners/posters/281249-7.jpg",
  c: "https://artworks.thetvdb.com/banners/posters/305074-11.jpg",
  d: "https://artworks.thetvdb.com/banners/posters/5b49502f8101d.jpg",
  e: "https://artworks.thetvdb.com/banners/posters/5bb2b28057ade.jpg",
  f: "https://artworks.thetvdb.com/banners/posters/72454-12.jpg",
  g: "https://artworks.thetvdb.com/banners/posters/74796-3.jpg",
  h: "https://artworks.thetvdb.com/banners/posters/79481-11.jpg",
};

const pool: [string, string, keyof typeof posters, string?, AnimeCardData["status"]?][] = [
  ["one-piece", "One Piece", "a", "Ep 1122", "RELEASING"],
  ["jjk", "Jujutsu Kaisen", "b", "Ep 47", "RELEASING"],
  ["demon-slayer", "Demon Slayer", "c", "Ep 55"],
  ["chainsaw-man", "Chainsaw Man", "d", "Ep 12"],
  ["spy-family", "Spy x Family", "e", "Ep 38", "RELEASING"],
  ["frieren", "Frieren", "f", "Ep 28"],
  ["mushoku", "Mushoku Tensei", "g", "Ep 12"],
  ["bleach", "Bleach: TYBW", "h", "Ep 26", "RELEASING"],
];

function makeRow(id: string, heading: string, badge?: AnimeRow["badge"]): AnimeRow {
  return {
    id,
    heading,
    badge,
    viewAllHref: `/${id}`,
    items: pool.map(([cid, t, pk, ep, st]) =>
      card(`${id}-${cid}`, t, posters[pk], ep, st),
    ),
  };
}

export const rows: AnimeRow[] = [
  makeRow("trending", "Trending Now", "HOT"),
  makeRow("popular", "Popular This Season", "SEASONAL"),
  makeRow("top-rated", "Top Rated", "TOP"),
  makeRow("recent", "Recently Added", "NEW"),
];
