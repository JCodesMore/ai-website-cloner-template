// Content data shapes used across VertexLink site sections

export interface HeroSlide {
  bg: string;            // path to /img/banner/...
  heading: string;       // bold portion of H1
  highlight: string;     // light-weight portion of H1
  intro: string;
}

export interface ServiceCard {
  icon: string;          // /img/icons/icon-XX.png
  title: string;
  description: string;
  href: string;
  active?: boolean;
}

export interface AboutFeature {
  label: string;
  active?: boolean;
}

export interface CounterStat {
  value: number;
  label1: string;
  label2: string;
}

export interface WhyChooseFeature {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export interface PricingPlan {
  icon: string;          // themify class like "ti-rss-alt"
  extraIcon?: string;    // optional second icon for the combined plan
  title: string;
  price: string;
  unit: string;
  caption: string;
  features: string[];
  highlighted?: boolean;
}

export interface StreamingCard {
  image: string;
  title: string;
}

export interface BlogPost {
  image: string;
  day: string;
  month: string;
  category: string;
  title: string;
  author: string;
  comments: number;
}
