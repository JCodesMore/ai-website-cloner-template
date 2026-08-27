export interface HandholdTestimonial {
  quote: string;
  name: string;
  title: string;
  avatarSrc: string;
}

export interface HandholdAgentFeature {
  heading: string;
  body: string;
}

export interface HandholdAgentPanel {
  eyebrow: string;
  heading: string;
  features: HandholdAgentFeature[];
  imageSide: "left" | "right";
  overlaySrc: [string, string, string];
}

export interface HandholdFaqItem {
  question: string;
  answer: string;
}

export interface HandholdFeatureCard {
  heading: string;
  body: string;
}
