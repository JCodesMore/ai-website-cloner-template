export interface Product {
  id: number;
  name: string;
  image: string;
  institution: string;
  maxAmount: string;
  term: string;
  rate: string;
  repayment: string;
  promo?: string;
  commentCount: number;
  href: string;
}

export interface Institution {
  id: number;
  name: string;
  fullName?: string;
  logo?: string;
  initial: string;
  productCount: number;
  href: string;
  products: { name: string; icon?: string; href: string }[];
}

export interface NewsItem {
  id: number;
  title: string;
  href: string;
  description?: string;
  date?: string;
  image?: string;
  categoryId?: number;
  relatedProducts?: { name: string; href: string }[];
}

export interface Comment {
  id: number;
  author: string;
  avatar?: string;
  initial: string;
  content: string;
  productName?: string;
  productIcon?: string;
  productHref?: string;
  date: string;
  images?: string[];
  rating?: number;
}

export interface FilterOption {
  label: string;
  href: string;
  active?: boolean;
}

export interface FilterGroup {
  title: string;
  options: FilterOption[];
}

export interface ArticleDetail {
  id: number;
  title: string;
  date: string;
  viewCount: number;
  body: string;
}

export interface ProductDetail {
  id: string;
  category: string;
  name: string;
  image: string;
  institution: string;
  institutionFullName: string;
  institutionHref: string;
  maxAmount: string;
  term: string;
  rate: string;
  repayment: string;
  advantages: string[];
  summary: string;
  introHtml: string;
}

export interface InstitutionDetail {
  id: string;
  name: string;
  fullName: string;
  logo: string;
  website: string;
  introHtml: string;
  products: { name: string; href: string; icon?: string }[];
}

export interface Counselor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  wechatQrcode: string;
  cases: string[];
}
