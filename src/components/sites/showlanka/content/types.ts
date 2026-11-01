export type PaxPrice = { old: string; price: string };

export type ItineraryDay = {
  title: string;
  attractions: string[];
  overnight: string;
};

export type Tour = {
  slug: string;
  title: string;
  code: string;
  duration: string;
  nights: number;
  categories: string[];
  months: number[];
  /** Upload path (under /sites/showlanka/uploads) of the 640x360 listing card image */
  card: string;
  /** Price shown on listing cards (the 3-pax rate) */
  cardPrice: string;
  hero: string;
  gallery: string[];
  prices: Partial<Record<"1" | "2" | "3", PaxPrice>>;
  save: Partial<Record<"1" | "2" | "3", string>>;
  discount: string;
  /** Per-person price for 1, 2 and 3 pax, used by the price calculator */
  calc: number[];
  itinerary: ItineraryDay[];
  tabs: { name: string; items: string[] }[];
  /** Ordered route stops: key → [lat, lng] */
  map: Record<string, [number, number]>;
};

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  /** Listing thumbnail (upload path); empty when the post leads with a video */
  card: string;
  hero: string;
  video?: string;
  /** Short summary written for the clone; the original article is linked */
  summary: string[];
  /** Written in the admin: `summary` is the whole article, so no link to showlanka.com */
  standalone?: boolean;
};
