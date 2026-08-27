import Image from "next/image";

import type { HandholdAgentPanel } from "@/types/handhold";

const panels: HandholdAgentPanel[] = [
  {
    eyebrow: "Inbound Q&A agent",
    heading: "Help leads validate with AI chat",
    imageSide: "right",
    overlaySrc: [
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-qa-1.svg",
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-qa-2.svg",
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-qa-3.svg",
    ],
    features: [
      {
        heading: "Engages visitors and answers their questions",
        body: "Discovers what customers are looking for, responds in real time, and turns curiosity into meaningful interactions.",
      },
      {
        heading: "Qualifies leads and nudges them towards next steps",
        body: "Identifies intent, filters high-value leads, and guides prospects toward the right next action.",
      },
      {
        heading: "Retains memory and passes context",
        body: "Remembers every conversation and seamlessly shares context across agents for a continuous experience.",
      },
    ],
  },
  {
    eyebrow: "Demo agent",
    heading: "Give 1:1 demos at scale with an AI expert",
    imageSide: "left",
    overlaySrc: [
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-demo-1.svg",
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-demo-2.svg",
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-demo-3.svg",
    ],
    features: [
      {
        heading: "Runs deep-dive demo sessions",
        body: "Delivers interactive, personalised demos by showing your live product in real time.",
      },
      {
        heading: "Gathers insights from conversations",
        body: "Captures key signals, needs, and preferences directly from each interaction.",
      },
      {
        heading: "Turns visitors into customers",
        body: "Equips prospects with the knowledge they need to become buyers and gets them started.",
      },
    ],
  },
  {
    eyebrow: "Onboarding agent",
    heading: "Provide tailored onboarding with an AI guide",
    imageSide: "right",
    overlaySrc: [
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-onboarding-1.svg",
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-onboarding-2.svg",
      "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/usecase-overlay-onboarding-3.svg",
    ],
    features: [
      {
        heading: "Knows your product inside out",
        body: "Ingests your knowledge base, indexes your entire product, and keeps itself up to date.",
      },
      {
        heading: "Navigates directly inside your UI",
        body: "Shows new customers how to use your product with a second cursor.",
      },
      {
        heading: "Helps your users reach their goals",
        body: "Tailors onboarding paths for every account, boosting activation rates.",
      },
    ],
  },
];

function AgentPanel({ panel }: { panel: HandholdAgentPanel }) {
  const isRight = panel.imageSide === "right";

  return (
    <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 md:gap-10">
      <div
        className={`order-2 md:order-none ${isRight ? "md:col-start-2" : "md:col-start-1"}`}
      >
        <div className="bg-surface-elevated relative aspect-[731/708] h-full w-full overflow-hidden rounded-3xl">
          <Image
            src={panel.overlaySrc[0]}
            alt=""
            aria-hidden="true"
            fill
            className="pointer-events-none scale-125 object-contain opacity-70 blur-2xl"
          />
          <div className="relative flex h-full w-full flex-col justify-center gap-4 p-8 md:p-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-black/10" />
              <div className="flex flex-col gap-2">
                <div className="h-2.5 w-24 rounded-full bg-black/15" />
                <div className="h-2.5 w-16 rounded-full bg-black/10" />
              </div>
            </div>
            <div className="w-[80%] rounded-2xl rounded-tl-sm bg-white/80 p-4">
              <div className="flex flex-col gap-2">
                <div className="h-2.5 w-full rounded-full bg-black/10" />
                <div className="h-2.5 w-[85%] rounded-full bg-black/10" />
                <div className="h-2.5 w-[60%] rounded-full bg-black/10" />
              </div>
            </div>
            <div className="ml-auto w-[65%] rounded-2xl rounded-tr-sm bg-black/5 p-4">
              <div className="flex flex-col gap-2">
                <div className="h-2.5 w-full rounded-full bg-black/10" />
                <div className="h-2.5 w-[70%] rounded-full bg-black/10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 flex flex-col gap-6 md:order-none">
        <span className="border-content-secondary/15 text-content-secondary inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-medium">
          {panel.eyebrow}
        </span>
        <h3 className="font-serif text-[28px] leading-[28px] font-extralight tracking-[-0.84px] text-black">
          {panel.heading}
        </h3>
        <div className="flex flex-col gap-4">
          {panel.features.map((feature) => (
            <div key={feature.heading} className="flex flex-col gap-1">
              <p className="text-base font-medium text-black">{feature.heading}</p>
              <p className="text-content-secondary text-sm">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UseCasesSection() {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="font-serif text-[40px] leading-[40px] font-extralight tracking-[-1.2px] text-black">
          Deploy agents across your customer journey
        </h2>
        <p className="text-content-secondary mt-4 max-w-[600px] text-base leading-6">
          Most buyer journeys are full of hurdles, each contributing to
          drop-off. Let our agents handhold your prospects from intent to
          activation.
        </p>
      </div>

      {panels.map((panel) => (
        <AgentPanel key={panel.heading} panel={panel} />
      ))}
    </section>
  );
}
