"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type BillingPeriod = "monthly" | "annual";

interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  bookings: string;
  providers: string;
  customFeatures: string;
  ctaLabel: string;
  ctaVariant: "outlined-light" | "outlined-dark" | "filled-coral" | "filled-navy";
  features: string[];
  isPopular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    bookings: "50 bookings/month",
    providers: "1 provider",
    customFeatures: "0 custom features",
    ctaLabel: "Get started free",
    ctaVariant: "outlined-light",
    features: [
      "Booking website",
      "Email reminders",
      "Basic reports",
      "Mobile apps",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 9.9,
    annualPrice: 8.25,
    bookings: "100 bookings/month",
    providers: "5 providers",
    customFeatures: "1 custom feature",
    ctaLabel: "Get started",
    ctaVariant: "outlined-light",
    features: [
      "Everything in Free",
      "SMS reminders",
      "Booking widget",
      "1 custom feature",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    monthlyPrice: 29.9,
    annualPrice: 24.9,
    bookings: "500 bookings/month",
    providers: "15 providers",
    customFeatures: "3 custom features",
    ctaLabel: "Get started",
    ctaVariant: "filled-coral",
    features: [
      "Everything in Basic",
      "Payments & POS",
      "3 custom features",
      "Priority support",
    ],
    isPopular: true,
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 59.9,
    annualPrice: 49.9,
    bookings: "2,000 bookings/month",
    providers: "30 providers",
    customFeatures: "Unlimited custom features",
    ctaLabel: "Get started",
    ctaVariant: "filled-navy",
    features: [
      "Everything in Standard",
      "Unlimited features",
      "API access",
      "HIPAA compliance",
      "White-label",
    ],
  },
];

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price === 0) return "$0";
  return `$${price.toFixed(2).replace(/\.00$/, "")}`;
}

interface PricingCardProps {
  plan: PricingPlan;
  billing: BillingPeriod;
}

function PricingCard({ plan, billing }: PricingCardProps) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  const isPopular = plan.isPopular === true;

  const cardStyle: React.CSSProperties = {
    background: "white",
    border: isPopular ? "2px solid #ff6c50" : "1px solid #dde3f0",
    borderRadius: 16,
    padding: "32px 28px",
    position: "relative",
    boxShadow: isPopular
      ? "0 8px 40px rgba(255,108,80,0.2)"
      : "none",
    display: "flex",
    flexDirection: "column",
  };

  let ctaStyle: React.CSSProperties;
  if (plan.ctaVariant === "filled-coral") {
    ctaStyle = {
      background: "#ff6c50",
      color: "white",
      border: "none",
      fontWeight: 700,
    };
  } else if (plan.ctaVariant === "filled-navy") {
    ctaStyle = {
      background: "#0f1340",
      color: "white",
      border: "none",
      fontWeight: 700,
    };
  } else {
    ctaStyle = {
      background: "white",
      color: "#1a1d4f",
      border: "2px solid #dde3f0",
      fontWeight: 600,
    };
  }

  return (
    <div style={cardStyle}>
      {isPopular && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ff6c50",
            color: "white",
            borderRadius: 100,
            padding: "4px 16px",
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </div>
      )}

      {/* Plan name */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#1a1d4f",
          marginBottom: 8,
        }}
      >
        {plan.name}
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: "#1a1d4f",
            lineHeight: 1,
          }}
        >
          {formatPrice(price)}
        </span>
        <span
          style={{
            fontSize: 15,
            color: "#626b8a",
            marginBottom: 4,
          }}
        >
          /month
        </span>
      </div>

      {billing === "annual" && plan.annualPrice !== null && plan.annualPrice > 0 && (
        <div
          style={{
            fontSize: 12,
            color: "#626b8a",
            marginBottom: 4,
          }}
        >
          billed annually
        </div>
      )}

      {/* Plan limits */}
      <div
        style={{
          marginTop: 16,
          marginBottom: 20,
          paddingTop: 16,
          paddingBottom: 16,
          borderTop: "1px solid #dde3f0",
          borderBottom: "1px solid #dde3f0",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {[plan.bookings, plan.providers, plan.customFeatures].map((item) => (
          <div
            key={item}
            style={{
              fontSize: 13,
              color: "#626b8a",
              fontWeight: 500,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <button
        type="button"
        style={{
          width: "100%",
          borderRadius: 8,
          padding: "13px 20px",
          fontSize: 15,
          cursor: "pointer",
          marginBottom: 20,
          ...ctaStyle,
        }}
      >
        {plan.ctaLabel}
      </button>

      {/* Feature list */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {plan.features.map((feature) => (
          <li
            key={feature}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Check
              size={16}
              color="#00c8d4"
              strokeWidth={2.5}
              style={{ flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 14,
                color: "#626b8a",
              }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <section
      style={{
        background: "white",
        padding: "96px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ff6c50",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            PRICING
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#1a1d4f",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            Simple, transparent pricing
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#626b8a",
              maxWidth: 420,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Billing toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 32,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              background: "#f4f7ff",
              borderRadius: 100,
              padding: 4,
            }}
          >
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              style={{
                background: billing === "monthly" ? "white" : "transparent",
                boxShadow:
                  billing === "monthly"
                    ? "0 2px 8px rgba(15,19,64,0.12)"
                    : "none",
                borderRadius: 100,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: billing === "monthly" ? 600 : 500,
                color: billing === "monthly" ? "#1a1d4f" : "#626b8a",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              style={{
                background: billing === "annual" ? "white" : "transparent",
                boxShadow:
                  billing === "annual"
                    ? "0 2px 8px rgba(15,19,64,0.12)"
                    : "none",
                borderRadius: 100,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: billing === "annual" ? 600 : 500,
                color: billing === "annual" ? "#1a1d4f" : "#626b8a",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              Annual
              <span
                style={{
                  background: "#22c55e",
                  color: "white",
                  borderRadius: 100,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: 24,
            marginTop: 48,
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
        >
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Footer note */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: "#626b8a",
              margin: "0 0 8px",
            }}
          >
            All plans include a 14-day free trial. No credit card required.
          </p>
          <a
            href="#"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#00c8d4",
              textDecoration: "none",
            }}
          >
            Compare all features →
          </a>
        </div>
      </div>
    </section>
  );
}
