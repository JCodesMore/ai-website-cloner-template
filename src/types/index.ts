export interface Tour {
  name: string;
  slug: string;
  tagline: string;
  duration: string;
  pricePerPerson: string;
  priceCurrency: string;
  priceNote?: string;
  season: string;
  description: string;
  includes: string[];
  image: string;
  imageAlt: string;
}

export interface Camp {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface SeasonEntry {
  months: string;
  name: string;
  description: string;
  wildlife: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

export interface Badge {
  name: string;
  image: string;
  url?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  whatsappLink: string;
  instagram: string;
  instagramUrl: string;
  facebook: string;
  facebookUrl: string;
  youtube?: string;
  youtubeUrl?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}
