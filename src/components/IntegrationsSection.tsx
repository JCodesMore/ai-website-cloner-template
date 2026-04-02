import Image from "next/image";

const integrations = [
  { name: "OpenAI", src: "/images/integrations/openai.svg" },
  { name: "Midjourney", src: "/images/integrations/midjourney.svg" },
  { name: "Netflix", src: "/images/integrations/netflix.svg" },
  { name: "DigitalOcean", src: "/images/integrations/digitalocean.svg" },
  { name: "Amazon", src: "/images/integrations/amazon.svg" },
  { name: "Airbnb", src: "/images/integrations/airbnb.svg" },
  { name: "Spotify", src: "/images/integrations/spotify.svg" },
] as const;

/**
 * Icon positions for the diamond/honeycomb layout.
 * The grid is arranged as:
 *   Row 1 (top):    2 icons
 *   Row 2 (middle): 3 icons
 *   Row 3 (bottom): 2 icons
 *
 * Positions are expressed as percentage-based offsets from the
 * container center so the pattern scales with container size.
 */
const iconPositions = [
  // Row 1 — top
  { top: "4%", left: "30%" },
  { top: "4%", left: "62%" },
  // Row 2 — middle
  { top: "36%", left: "14%" },
  { top: "36%", left: "46%" },
  { top: "36%", left: "78%" },
  // Row 3 — bottom
  { top: "68%", left: "30%" },
  { top: "68%", left: "62%" },
] as const;

function IntegrationIcon({
  name,
  src,
  style,
}: {
  name: string;
  src: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute grid aspect-square w-[72px] place-items-center rounded-full sm:w-[88px] md:w-[100px]"
      style={{
        background:
          "radial-gradient(circle at 50.25% 68.375%, #e2e5e6 0, #fff 86.87%) padding-box, linear-gradient(to bottom, #e2e5e6 40%, #fff 100%) border-box",
        border: "1px solid transparent",
        ...style,
      }}
    >
      <Image
        src={src}
        alt={name}
        width={40}
        height={40}
        className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
      />
    </div>
  );
}

export function IntegrationsSection() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{
        paddingTop: "clamp(3rem, 2rem + 4vw, 6.25rem)",
        paddingBottom: "clamp(3rem, 2rem + 4vw, 6.25rem)",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="font-bold tracking-tight"
          style={{
            fontSize: "clamp(2.25rem, 1.4577rem + 3.3803vw, 4.5rem)",
            lineHeight: 1.16,
            letterSpacing: "-0.01em",
            color: "#151c28",
          }}
        >
          Pay for all your business services from one platform
        </h2>
        <p
          className="mt-2"
          style={{
            fontSize: "clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)",
            color: "#4d5e80",
          }}
        >
          Clearly organized, managed in one place
        </p>
      </div>

      {/* Integrations Icon Grid */}
      <div className="pointer-events-none mx-auto mt-12 select-none md:mt-16">
        <div className="relative mx-auto h-[320px] max-w-[520px] sm:h-[380px] md:h-[440px]">
          {integrations.map((integration, index) => {
            const pos = iconPositions[index];
            return (
              <IntegrationIcon
                key={integration.name}
                name={integration.name}
                src={integration.src}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, 0)",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Footer — Apple Pay Callout */}
      <div className="mx-auto mt-8 grid place-items-center text-center md:mt-12">
        <p
          className="flex items-center gap-2 font-medium"
          style={{
            fontSize: "clamp(1.25rem, 1.162rem + 0.3756vw, 1.5rem)",
            lineHeight: 1.28,
            color: "#151c28",
          }}
        >
          <span>Connect to</span>
          <Image
            src="/images/integrations/apple-pay.svg"
            alt="Apple Pay"
            width={60}
            height={24}
            className="inline-block h-6 w-auto"
          />
        </p>
      </div>
    </section>
  );
}
