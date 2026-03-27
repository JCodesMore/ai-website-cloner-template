import { ArrowRight } from "lucide-react";

interface Integration {
  name: string;
  circleColor: string;
  textColor?: string;
}

const INTEGRATIONS: Integration[] = [
  { name: "Google Calendar", circleColor: "#4285F4" },
  { name: "Stripe", circleColor: "#635bff" },
  { name: "PayPal", circleColor: "#003087" },
  { name: "Square", circleColor: "#1a1a1a" },
  { name: "Zoom", circleColor: "#2D8CFF" },
  { name: "Google Meet", circleColor: "#00897b" },
  { name: "Mailchimp", circleColor: "#FFE01B", textColor: "#000000" },
  { name: "QuickBooks", circleColor: "#2CA01C" },
  { name: "Facebook", circleColor: "#1877F2" },
  { name: "Instagram", circleColor: "#E1306C" },
  { name: "WordPress", circleColor: "#21759b" },
  { name: "Zapier", circleColor: "#FF4A00" },
];

function IntegrationPill({ integration }: { integration: Integration }) {
  return (
    <div
      className="flex items-center gap-[10px] rounded-[10px] border transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(15,19,64,0.1)] cursor-default"
      style={{
        padding: "14px 20px",
        borderColor: "#dde3f0",
        backgroundColor: "#f4f7ff",
      }}
    >
      {/* Colored initial circle */}
      <span
        className="flex items-center justify-center shrink-0 rounded-full text-xs font-semibold"
        style={{
          width: 24,
          height: 24,
          backgroundColor: integration.circleColor,
          color: integration.textColor ?? "#ffffff",
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {integration.name.charAt(0)}
      </span>

      {/* App name */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#1a1d4f",
          whiteSpace: "nowrap",
        }}
      >
        {integration.name}
      </span>
    </div>
  );
}

export function IntegrationsSection() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "96px 0" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left column: text content (40%) */}
          <div className="w-full lg:w-[40%] shrink-0">
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#ff6c50",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              INTEGRATIONS
            </p>

            <h2
              style={{
                fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: 800,
                color: "#1a1d4f",
                lineHeight: 1.2,
                marginTop: 12,
              }}
            >
              Connect with your favorite tools
            </h2>

            <p
              style={{
                fontSize: 16,
                color: "#626b8a",
                lineHeight: 1.7,
                marginTop: 16,
              }}
            >
              SimplyBook.me integrates with the tools you already use. From
              payments to calendars to social media — everything works together.
            </p>

            <a
              href="/integrations"
              className="inline-flex items-center gap-1.5 hover:underline"
              style={{
                marginTop: 28,
                color: "#00c8d4",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              See all integrations
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>

          {/* Right column: integrations grid (60%) */}
          <div className="w-full lg:flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEGRATIONS.map((integration) => (
                <IntegrationPill
                  key={integration.name}
                  integration={integration}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
