import { Navbar } from "@/components/site/Navbar";
import { Sidebar } from "@/components/site/Sidebar";
import { Hero } from "@/components/site/Hero";
import { AnimeRow } from "@/components/site/AnimeRow";
import { Footer } from "@/components/site/Footer";
import { heroSlides as mockHero, rows as mockRows } from "@/data/mock";
import {
  getHeroSlides,
  getTrendingAnime,
  getPopularAnime,
  getTopAnime,
  getRecentAnime,
  getAnimeMovies,
} from "@/lib/tmdb";
import type { AnimeRow as AnimeRowType, HeroSlide } from "@/types/anime";

// Revalidate the home catalog hourly.
export const revalidate = 3600;

export default async function Home() {
  let heroSlides: HeroSlide[] = mockHero;
  let rows: AnimeRowType[] = mockRows;

  try {
    const [hero, trending, popular, top, recent, movies] = await Promise.all([
      getHeroSlides(),
      getTrendingAnime(),
      getPopularAnime(),
      getTopAnime(),
      getRecentAnime(),
      getAnimeMovies(),
    ]);

    if (hero.length) heroSlides = hero;

    const built: AnimeRowType[] = [
      { id: "trending", heading: "Trending Now", badge: "HOT" as const, items: trending },
      { id: "popular", heading: "Popular This Season", badge: "SEASONAL" as const, items: popular },
      { id: "top-rated", heading: "Top Rated", badge: "TOP" as const, items: top },
      { id: "movies", heading: "Anime Movies", items: movies },
      { id: "recent", heading: "Recently Added", badge: "NEW" as const, items: recent },
    ].filter((r) => r.items.length > 0);

    if (built.length) rows = built;
  } catch {
    // Network/TMDB failure — fall back to bundled mock catalog.
  }

  return (
    <>
      <Sidebar />
      <Navbar />
      <main className="flex-1">
        <Hero slides={heroSlides} />
        <div className="relative z-10 -mt-8">
          {rows.map((row) => (
            <AnimeRow key={row.id} row={row} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
