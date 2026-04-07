"use client";

import { useState } from "react";

const platforms = [
  "Make",
  "Zapier",
  "Airtable",
  "Notion",
  "n8n",
  "Webhooks",
  "APIs",
  "CRMs",
  "Slack",
  "Email",
  "Google Sheets",
  "Pipedrive",
  "Typeform",
  "Calendly",
  "HubSpot",
  "ActiveCampaign",
];

export function PlatformsSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700,
            color: "oklch(1 0 0 / 0.9)",
            marginBottom: "12px",
          }}
        >
          Works with the tools you already use
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "oklch(1 0 0 / 0.6)",
            marginBottom: "32px",
          }}
        >
          FLO connects to your existing stack — no switching tools, no learning curve.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {platforms.map((platform) => (
            <button
              key={platform}
              onMouseEnter={() => setHovered(platform)}
              onMouseLeave={() => setHovered(null)}
              style={{
                border: `1px solid ${hovered === platform ? "oklch(0.95 0.15 108)" : "oklch(1 0 0 / 0.2)"}`,
                borderRadius: 0,
                padding: "8px 16px",
                fontSize: "14px",
                fontFamily: "inherit",
                color:
                  hovered === platform
                    ? "oklch(0.95 0.15 108)"
                    : "oklch(1 0 0 / 0.7)",
                backgroundColor: "transparent",
                cursor: "pointer",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {platform}
            </button>
          ))}
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "oklch(1 0 0 / 0.6)",
            marginTop: "24px",
          }}
        >
          Already using a different tool? We likely support it.
        </p>
      </div>
    </section>
  );
}
