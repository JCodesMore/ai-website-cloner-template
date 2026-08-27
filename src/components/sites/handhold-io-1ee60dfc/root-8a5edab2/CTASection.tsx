import { Clock, Globe, UserCheck, type LucideIcon } from "lucide-react";

interface FeatureCardData {
  icon: LucideIcon;
  heading: string;
  body: string;
}

const featureCards: FeatureCardData[] = [
  {
    icon: Clock,
    heading: "Live 24/7",
    body: "Always available to interact with visitors.",
  },
  {
    icon: Globe,
    heading: "Multilingual",
    body: "Supports 50+ languages.",
  },
  {
    icon: UserCheck,
    heading: "Personalised for each prospect",
    body: "Adapts every session to the buyer.",
  },
];

function FeatureCard({ icon: Icon, heading, body }: FeatureCardData) {
  return (
    <div className="bg-surface-elevated flex flex-col gap-8 rounded-3xl p-7">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
        <Icon size={20} color="#000" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-medium text-black">{heading}</h3>
        <p className="text-content-secondary text-sm">{body}</p>
      </div>
    </div>
  );
}

export function CTASection() {
  return (
    <div>
      <div>
        <h2
          className="text-black"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "40px",
            fontWeight: 200,
            lineHeight: "40px",
            letterSpacing: "-1.2px",
          }}
        >
          Scale personalised sales without growing your team
        </h2>
        <p className="text-content-secondary mt-4 max-w-[500px] text-base leading-6">
          Give a dedicated guide to every buyer – Handhold agents are always
          available. If human touch is needed, you&apos;ll know.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-8 lg:grid-cols-[3fr_2fr]">
        <div className="bg-surface-elevated flex h-full flex-col items-center rounded-3xl px-4 pt-16 pb-18">
          <div className="flex max-w-120 flex-col items-center gap-10 text-center">
            <div className="flex flex-col gap-4">
              <h3
                className="text-black"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: "40px",
                  fontWeight: 200,
                  letterSpacing: "-1.2px",
                }}
              >
                Create your own agent
              </h3>
              <p className="text-content-secondary text-sm leading-5 tracking-[-0.18px]">
                Generate a sample demo agent from your website
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                className="mt-6 rounded-full bg-black px-5 py-2.5 text-sm text-white"
              >
                Generate your agent
              </button>
              <p className="text-content-tertiary text-xs">
                No account needed. No cost. Create your agent in minutes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {featureCards.map((card) => (
            <FeatureCard key={card.heading} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
