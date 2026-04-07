const COMPANIES = [
  "Microsoft",
  "Google",
  "Meta",
  "Amazon",
  "Netflix",
  "Spotify",
  "Stripe",
  "Shopify",
  "GitHub",
  "Vercel",
  "Linear",
  "Notion",
  "Figma",
  "Atlassian",
  "Salesforce",
  "Adobe",
];

export function TrustedSection() {
  return (
    <section
      id="trusted"
      className="flex flex-col items-center gap-8 py-16 text-center"
    >
      <p
        style={{
          fontSize: "clamp(18px, 2.5vw, 20px)",
          color: "oklch(1 0 0 / 0.6)",
          fontWeight: 400,
        }}
      >
        Trusted by teams who value speed and efficiency
      </p>

      <div
        className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...COMPANIES, ...COMPANIES].map((company, i) => (
            <span
              key={i}
              className="px-6 uppercase tracking-wider"
              style={{
                fontSize: "14px",
                color: "oklch(1 0 0 / 0.6)",
              }}
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
