import {
  Globe,
  Smartphone,
  BellRing,
  CreditCard,
  Users,
  BarChart3,
  Calendar,
  Star,
  Gift,
  Zap,
  ShieldCheck,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Globe,
    iconBg: "#e8f8ff",
    iconColor: "#00c8d4",
    title: "Online Booking Website",
    description:
      "Get a beautiful, mobile-ready booking website with your own URL. Clients can book 24/7 from any device.",
  },
  {
    icon: Smartphone,
    iconBg: "#fff0ed",
    iconColor: "#ff6c50",
    title: "Booking Widget",
    description:
      "Add a booking button or widget to your existing website, Facebook, and Instagram pages.",
  },
  {
    icon: BellRing,
    iconBg: "#f0f0ff",
    iconColor: "#6b5ce7",
    title: "Automated Reminders",
    description:
      "Reduce no-shows with automatic email, SMS, and WhatsApp notifications to clients and staff.",
  },
  {
    icon: CreditCard,
    iconBg: "#e8fff8",
    iconColor: "#00b894",
    title: "Online Payments",
    description:
      "Accept payments via Stripe, PayPal, and Square. Set up deposits or full payment at booking time.",
  },
  {
    icon: Users,
    iconBg: "#fff8e8",
    iconColor: "#f9a825",
    title: "Client Management",
    description:
      "Keep a complete client database with booking history, notes, and custom intake forms.",
  },
  {
    icon: BarChart3,
    iconBg: "#f0f4ff",
    iconColor: "#4a6cf7",
    title: "Reports & Analytics",
    description:
      "Track revenue, bookings, and client trends with detailed dashboards and exportable reports.",
  },
  {
    icon: Calendar,
    iconBg: "#e8f8ff",
    iconColor: "#00c8d4",
    title: "Calendar Sync",
    description:
      "Two-way sync with Google Calendar and Outlook to prevent double-booking automatically.",
  },
  {
    icon: Star,
    iconBg: "#fff0ed",
    iconColor: "#ff6c50",
    title: "Reviews & Ratings",
    description:
      "Collect and display client reviews to build trust and attract new bookings from your profile.",
  },
  {
    icon: Gift,
    iconBg: "#f0f0ff",
    iconColor: "#6b5ce7",
    title: "Gift Cards & Coupons",
    description:
      "Sell gift cards and offer promotional coupons to incentivize bookings and increase revenue.",
  },
  {
    icon: Zap,
    iconBg: "#e8fff8",
    iconColor: "#00b894",
    title: "Zapier Integration",
    description:
      "Connect SimplyBook.me with 2,000+ apps via Zapier. Automate your workflows effortlessly.",
  },
  {
    icon: ShieldCheck,
    iconBg: "#fff8e8",
    iconColor: "#f9a825",
    title: "HIPAA Compliance",
    description:
      "Stay compliant with healthcare regulations. SOAP notes, encrypted data, and secure forms included.",
  },
  {
    icon: Megaphone,
    iconBg: "#f0f4ff",
    iconColor: "#4a6cf7",
    title: "Marketing Tools",
    description:
      "Memberships, loyalty programs, packages, and promotions to grow and retain your client base.",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <div
      className="feature-card rounded-[12px] border p-7 bg-white transition-all duration-[250ms] hover:-translate-y-0.5"
      style={{
        borderColor: "#dde3f0",
        boxShadow: "0 2px 12px rgba(15,19,64,0.06)",
      }}
    >
      {/* Icon container */}
      <div
        className="flex items-center justify-center rounded-[10px]"
        style={{
          width: 48,
          height: 48,
          backgroundColor: feature.iconBg,
        }}
      >
        <Icon size={22} color={feature.iconColor} strokeWidth={2} />
      </div>

      {/* Title */}
      <h3
        className="mt-4 font-bold"
        style={{
          fontSize: 17,
          color: "#1a1d4f",
          lineHeight: 1.3,
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className="mt-2"
        style={{
          fontSize: 14,
          color: "#626b8a",
          lineHeight: 1.65,
        }}
      >
        {feature.description}
      </p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section style={{ backgroundColor: "#f4f7ff", padding: "96px 0" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section header */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ff6c50",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            FEATURES
          </p>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#1a1d4f",
              lineHeight: 1.2,
              marginTop: 12,
            }}
          >
            Everything you need to grow your bookings
          </h2>

          <p
            style={{
              fontSize: 17,
              color: "#626b8a",
              marginTop: 16,
              lineHeight: 1.7,
            }}
          >
            Over 70 custom features to automate your business, attract more
            clients, and deliver exceptional service.
          </p>
        </div>

        {/* Feature cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ marginTop: 64 }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>

      {/* Hover shadow enhancement scoped to feature cards */}
      <style>{`
        .feature-card:hover {
          box-shadow: 0 8px 32px rgba(15,19,64,0.12) !important;
        }
      `}</style>
    </section>
  );
}
