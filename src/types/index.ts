export interface Property {
  id: string;
  location: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  price: string;
  dealType?: "smart" | "great" | "excellent" | null;
  dealBadgeImage?: string;
}

export interface Project {
  id: string;
  name: string;
  neighborhood: string;
  image: string;
  deliveryLabel: string;
  deliveryDate: string;
  startingPrice: string;
}

export interface Neighborhood {
  name: string;
  image: string;
  href: string;
}

export interface NewsArticle {
  date: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}
