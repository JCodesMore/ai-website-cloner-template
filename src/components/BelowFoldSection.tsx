const MARQUEE_ITEMS = [
  "Make",
  "Zapier",
  "Airtable",
  "Notion",
  "n8n",
  "Webhooks",
  "Slack",
  "HubSpot",
  "Google Sheets",
  "Pipedrive",
  "Stripe",
  "Typeform",
  "ActiveCampaign",
  "Calendly",
  "Shopify",
  "Twilio",
];

export function BelowFoldSection() {
  return (
    <section
      id="below-fold"
      className="flex flex-col items-center gap-8 pt-16 md:pt-20"
    >
      <p
        className="text-center font-bold text-white"
        style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700 }}
      >
        From lead capture to client delivery — we automate everything.
      </p>

      <div
        className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="px-6 uppercase tracking-wider"
              style={{
                fontSize: "14px",
                color: "oklch(1 0 0 / 0.6)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
