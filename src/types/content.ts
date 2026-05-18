export type OfferCardKey = "expand" | "maximize" | "elevate";

export interface OfferCard {
  key: OfferCardKey;
  pillLabel: string;        // "Expand" / "Maximize" / "Elevate"
  category: string;          // "TAILORED OFFER"
  title: string;             // "Expand" (line 1)
  subtitle: string;          // "Your Reach" (line 2)
  body: string;              // paragraph
  tags: string[];            // ["Paid Media", ...]
  bgColor: string;           // e.g. "var(--engagement)"
  video: string;             // /videos/xxx.mp4
}

export interface ApproachStep {
  number: string;            // "01"
  title: string;             // "Weekly On-Site Check-Ins"
}

export interface Logo {
  src: string;
  alt: string;
}
