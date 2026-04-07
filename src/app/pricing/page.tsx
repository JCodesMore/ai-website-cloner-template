import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const plans = [
  {
    name: "Starter System",
    price: "$10,000",
    period: "one-time",
    description:
      "A focused single-workflow automation built for small teams or solo operators ready to eliminate their first major manual process.",
    features: [
      "1 core workflow automated",
      "Up to 3 tool integrations",
      "Lead capture or ops routing",
      "30-day post-launch support",
      "Delivered in 3–5 business days",
    ],
    cta: "Get Started",
    href: "/signup",
    accent: "oklch(0.95 0.15 108)",
    border: "oklch(0.95 0.15 108 / 0.3)",
    ctaBg: "oklch(0.95 0.15 108)",
    ctaColor: "oklch(0.217 0.0038309 106.715)",
  },
  {
    name: "Growth Stack",
    price: "$25,000",
    period: "one-time",
    description:
      "A multi-workflow system for growing businesses that need end-to-end automation across lead handling, ops, and client delivery.",
    features: [
      "3 core workflows automated",
      "Up to 8 tool integrations",
      "Lead, ops, and data sync flows",
      "Error handling and fallbacks",
      "60-day post-launch support",
      "Delivered in 5–10 business days",
    ],
    cta: "Build My Stack",
    href: "/signup",
    accent: "oklch(0.567 0.15 248)",
    border: "oklch(0.567 0.15 248 / 0.4)",
    ctaBg: "oklch(0.567 0.15 248)",
    ctaColor: "white",
    featured: true,
  },
  {
    name: "Full Automation OS",
    price: "$50,000",
    period: "one-time",
    description:
      "A complete automation operating system for established businesses that want every repetitive process removed from their team's plate.",
    features: [
      "Unlimited workflows in scope",
      "Full tool ecosystem integration",
      "Custom logic and branching",
      "Real-time monitoring and alerts",
      "Dedicated build team",
      "90-day post-launch support",
      "Delivered in 10–15 business days",
    ],
    cta: "Let's Talk",
    href: "/signup",
    accent: "oklch(0.95 0.15 108)",
    border: "oklch(0.95 0.15 108 / 0.3)",
    ctaBg: "oklch(0.95 0.15 108)",
    ctaColor: "oklch(0.217 0.0038309 106.715)",
  },
];

export default function PricingPage() {
  return (
    <div className="overflow-x-clip">
      <Navbar />
      <main className="flex grow flex-col">
        <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          {/* Header */}
          <div className="mb-16 text-center">
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "oklch(0.95 0.15 108)",
                marginBottom: "12px",
              }}
            >
              Transparent pricing
            </p>
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 800,
                color: "oklch(1 0 0 / 0.9)",
                lineHeight: 1.1,
                marginBottom: "16px",
              }}
            >
              One price. One system.
              <br />No subscriptions.
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "oklch(1 0 0 / 0.6)",
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              We build your automation once, right. You own it forever.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-xl p-8"
                style={{
                  background: plan.featured
                    ? `linear-gradient(160deg, oklch(0.567 0.15 248 / 0.08), oklch(0.27 0.008 106))`
                    : "oklch(0.27 0.008 106)",
                  border: `1px solid ${plan.border}`,
                }}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1"
                    style={{
                      backgroundColor: "oklch(0.567 0.15 248)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Name */}
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: plan.accent,
                    marginBottom: "12px",
                  }}
                >
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mb-4 flex items-end gap-2">
                  <span
                    style={{
                      fontSize: "48px",
                      fontWeight: 800,
                      color: "oklch(1 0 0 / 0.9)",
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "oklch(1 0 0 / 0.5)",
                      paddingBottom: "6px",
                    }}
                  >
                    {plan.period}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: "14px",
                    color: "oklch(1 0 0 / 0.6)",
                    lineHeight: 1.6,
                    marginBottom: "24px",
                  }}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="mb-8 flex flex-col gap-3 flex-1">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2"
                      style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.8)" }}
                    >
                      <span
                        style={{
                          color: plan.accent,
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={plan.href}
                  style={{
                    display: "block",
                    width: "100%",
                    backgroundColor: plan.ctaBg,
                    color: plan.ctaColor,
                    fontSize: "16px",
                    fontWeight: 700,
                    padding: "14px 0",
                    borderRadius: 0,
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p
            className="mt-12 text-center"
            style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.4)" }}
          >
            All packages include a scoping call before work begins. Need something custom?{" "}
            <a
              href="/signup"
              style={{ color: "oklch(0.95 0.15 108)", textDecoration: "none" }}
            >
              Let&apos;s talk →
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
