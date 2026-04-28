// Type definitions for monochrome.so content models

export type ProductColor = {
  label: string;
  hex: string; // CSS color
};

export type ProductCard = {
  name: string;          // e.g. "Roof-1"
  tagline: string;       // e.g. "エネルギーをつくる屋根"
  image: string;         // /images/...
  imageAlt: string;
  colors?: ProductColor[];
  detailHref: string;
  consultHref: string;
};

export type Architect = {
  name: string;
  image?: string; // optional, only first 3 have hero image
  href?: string;
};

export type JournalArticle = {
  date: string;
  category: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
  productBadge?: string; // e.g. "Roof-1"
};

export type NewsItem = {
  date: string;
  badge: string; // プレスリリース / 採用情報 / 掲載情報 etc.
  title: string;
  href: string;
  source?: string; // for 掲載情報 (Forbes JAPAN etc.)
  external?: boolean;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  links: FooterLink[];
};
