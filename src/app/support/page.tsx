import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const FAQS = [
  {
    q: "How do I get started?",
    a: "Book a free scoping call. We'll spend 30 minutes mapping your biggest workflow bottlenecks and show you what a FLO system would look like for your business.",
  },
  {
    q: "How long does it take to build a system?",
    a: "Most systems are delivered in 3–15 business days depending on complexity. Starter systems typically go live in 3–5 days. Larger stacks take 5–15 days.",
  },
  {
    q: "What tools do you work with?",
    a: "We build on Make, Zapier, n8n, Airtable, Notion, HubSpot, Pipedrive, Slack, Gmail, Google Sheets, and more. If it has an API, we can connect it.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No. You describe your workflow in plain English, we handle everything technical. You'll receive full documentation so your team can understand what was built.",
  },
  {
    q: "What happens after the system is delivered?",
    a: "Every package includes post-launch support (30–90 days depending on tier). We monitor, fix issues, and improve the system as your business evolves.",
  },
  {
    q: "Can I request changes after delivery?",
    a: "Yes. Minor tweaks are included in the support window. Larger changes or new workflows can be scoped as a follow-on project.",
  },
  {
    q: "Do you offer ongoing retainers?",
    a: "Yes — for businesses that want continuous automation improvement, we offer monthly retainer plans. Ask about this on your scoping call.",
  },
  {
    q: "Is my data safe?",
    a: "We only connect to the tools you already use and authorize. We never store your business data — all automations run within your own accounts.",
  },
];

const CONTACT_OPTIONS = [
  {
    icon: "📧",
    title: "Email Us",
    description: "For general enquiries and project scoping",
    action: "hello@flo.ai",
    href: "mailto:hello@flo.ai",
  },
  {
    icon: "📅",
    title: "Book a Call",
    description: "30-minute free scoping session",
    action: "Schedule now →",
    href: "/signup",
  },
  {
    icon: "📖",
    title: "Read the Docs",
    description: "Technical guides and system documentation",
    action: "View docs →",
    href: "/docs",
  },
];

export default function SupportPage() {
  return (
    <div className="overflow-x-clip">
      <Navbar />
      <main className="flex grow flex-col">
        <section className="mx-auto w-full max-w-4xl px-6 py-20 md:py-28">
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
              Help &amp; Support
            </p>
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 52px)",
                fontWeight: 800,
                color: "oklch(1 0 0 / 0.9)",
                lineHeight: 1.1,
                marginBottom: "16px",
              }}
            >
              How can we help?
            </h1>
            <p style={{ fontSize: "17px", color: "oklch(1 0 0 / 0.55)", lineHeight: 1.6 }}>
              Find answers below or reach out directly — we typically respond within one business day.
            </p>
          </div>

          {/* Contact options */}
          <div className="grid grid-cols-1 gap-4 mb-16 md:grid-cols-3">
            {CONTACT_OPTIONS.map((opt) => (
              <a
                key={opt.title}
                href={opt.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  padding: "24px",
                  background: "oklch(0.27 0.008 106)",
                  border: "1px solid oklch(1 0 0 / 0.08)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "28px" }}>{opt.icon}</span>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)" }}>
                  {opt.title}
                </p>
                <p style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.5)", lineHeight: 1.5, flex: 1 }}>
                  {opt.description}
                </p>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "oklch(0.95 0.15 108)" }}>
                  {opt.action}
                </span>
              </a>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "oklch(1 0 0 / 0.9)",
                marginBottom: "24px",
              }}
            >
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-3">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  style={{
                    padding: "20px 24px",
                    background: "oklch(0.27 0.008 106)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "oklch(1 0 0 / 0.9)",
                      marginBottom: "8px",
                    }}
                  >
                    {faq.q}
                  </p>
                  <p style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.6)", lineHeight: 1.7, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-16 rounded-xl p-8 text-center"
            style={{
              background: "oklch(0.27 0.008 106)",
              border: "1px solid oklch(0.95 0.15 108 / 0.25)",
            }}
          >
            <p style={{ fontSize: "20px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", marginBottom: "8px" }}>
              Still have questions?
            </p>
            <p style={{ fontSize: "15px", color: "oklch(1 0 0 / 0.55)", marginBottom: "20px" }}>
              Book a free call and we&apos;ll walk through anything you need.
            </p>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "oklch(0.95 0.15 108)",
                color: "oklch(0.217 0.0038309 106.715)",
                fontSize: "15px",
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              Book a Free Call →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
