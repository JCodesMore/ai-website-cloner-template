export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  bookings: string;
  providers: string;
  customFeatures: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

export interface Testimonial {
  id: string;
  text: string;
  name: string;
  business: string;
  avatarColor: string;
  initials: string;
  rating: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface Integration {
  id: string;
  name: string;
  color: string;
}

export interface Industry {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface BookingChannel {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
}
