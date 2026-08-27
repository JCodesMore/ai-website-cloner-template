import Image from "next/image";

const STEPS = [
  {
    number: "1.",
    text: "Link your website & knowledge base",
  },
  {
    number: "2.",
    text: "Handhold generates the agents, you refine their goals and messaging",
  },
  {
    number: "3.",
    text: "Deploy with a simple code snippet",
  },
] as const;

export function GetStartedSection() {
  return (
    <div>
      <h2 className="pb-16 font-serif text-[40px] font-extralight leading-[40px] tracking-[-1.2px] text-black">
        Get started in minutes
      </h2>
      <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-[0.45fr_1fr] md:gap-10">
        <div className="order-2 md:order-1">
          <ol>
            {STEPS.map((step) => (
              <li
                key={step.number}
                className="mb-6 flex items-start gap-4 md:gap-5"
              >
                <span className="w-12 shrink-0 font-serif text-[40px] font-extralight leading-[40px] tracking-[-1.2px] text-black">
                  {step.number}
                </span>
                <span className="max-w-[320px] text-base leading-6 font-normal text-black">
                  {step.text}
                </span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="rounded-full bg-black px-5 py-2.5 text-sm text-white"
          >
            Get started
          </button>
          <p className="mt-3 text-sm font-normal text-content-secondary">
            First version ready in minutes, go live in 1-3 days
          </p>
        </div>
        <div className="order-1 md:order-3 md:row-span-2 md:row-start-1">
          <div className="relative aspect-[988/541] h-full w-full overflow-hidden rounded-3xl bg-surface-elevated">
            <Image
              src="/sites/handhold-io-1ee60dfc/root-8a5edab2/images/how-to-get-started.png"
              alt="How to get started with Handhold"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
