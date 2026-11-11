/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Hero } from "./content/pages";
import type { Tour } from "./content/types";
import { upload } from "./site-link";

/** Full-width sub-page header image, optionally with the overlay title block. */
export function SubPageHero({ hero }: { hero: Hero }) {
  return (
    <section className="flex carousel-content sub-page">
      <img src={upload(hero.image)} alt={hero.alt} fetchPriority="high" />
      {hero.title && (
        <>
          <div className="sub-page-hero-overlay" />
          <div className="sub-page-hero-content">
            <h1 className="sub-page-hero-title">{hero.title}</h1>
            {hero.subtitle && <h2 className="sub-page-hero-subtitle">{hero.subtitle}</h2>}
          </div>
        </>
      )}
    </section>
  );
}

/** A short card blurb built from the tour's own facts. */
export function tourBlurb(tour: Tour) {
  const stops = Object.keys(tour.map)
    .filter((k) => k !== "airport")
    .slice(0, 3)
    .map(placeName);
  return `${tour.duration} through ${stops.join(", ")} and more.`;
}

export function placeName(key: string) {
  const name = key.replace(/_/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function listJoin(items: string[]) {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Narrative copy composed from the tour's own data (the source prose is not reproduced). */
export function tourIntro(tour: Tour) {
  const stops = Object.keys(tour.map).filter((k) => k !== "airport").map(placeName);
  const kind = tour.categories.includes("group") ? "small-group tour" : "private chauffeur-guided tour";
  return `A ${tour.duration.toLowerCase()} ${kind} taking in ${listJoin(stops)}. Your driver-guide meets you at the airport and stays with you until the final drop-off; the full day-by-day plan, inclusions and route map are below.`;
}

/** Listing card used on /sri-lanka-tours and in "Similar Tour Packages". */
export function PackageCard({ tour, hidden }: { tour: Tour; hidden?: boolean }) {
  return (
    <div className={`col-lg-6 col-12 package-list-container${hidden ? " hidden" : ""}`}>
      <article className="row inner-wrapper flex flex-1">
        <div className="col-sm-6 col-12">
          <div
            className="image-container"
            role="img"
            aria-label={tour.title}
            style={{ backgroundImage: `url('${upload(tour.card)}')` }}
          >
            <div className="special-content-container">
              <div className="flex-col special-left">
                <span className="label">Duration</span>
                <span className="value">{tour.duration}</span>
              </div>
              <div className="flex-col special-right">
                <span className="label">Price per pax</span>
                <span className="value">{tour.cardPrice}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-12 text-content">
          <h3>{tour.title}</h3>
          <p>{tourBlurb(tour)}</p>
          <Link href={`/${tour.slug}`} className="btn common-btn">
            Read More<span className="sr-only"> about {tour.title}</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
