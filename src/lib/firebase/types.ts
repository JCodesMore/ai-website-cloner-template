import { Timestamp } from "firebase/firestore";

// Firestore document types — extend base types with DB fields

export interface FirestoreTour {
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
  metaTitle?: string;
  metaDescription?: string;
  order: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreFAQ {
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreSeason {
  months: string;
  name: string;
  description: string;
  wildlife: string[];
  order: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreGalleryItem {
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
  order: number;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreBadge {
  name: string;
  image: string;
  url?: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreSiteConfig {
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
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  heroVideoSrc1080?: string;
  heroVideoSrc720?: string;
  heroVideoSrc480?: string;
  heroPoster?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCtaText?: string;
  ogImage?: string;
  updatedAt: Timestamp;
}

export interface FirestoreNavConfig {
  links: Array<{
    label: string;
    href: string;
    order: number;
    isVisible: boolean;
  }>;
  updatedAt: Timestamp;
}
