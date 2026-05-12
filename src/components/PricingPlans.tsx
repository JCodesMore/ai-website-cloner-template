import { CheckIcon, DesktopIcon, RssIcon } from "@/components/icons";
import { PRICING_PLANS } from "@/lib/content";
import { cn } from "@/lib/utils";

function PlanIcon({ name }: { name: string }) {
  if (name === "rss") {
    return <RssIcon className="size-7" />;
  }
  return <DesktopIcon className="size-7" />;
}

export function PricingPlans() {
  return (
    <section
      id="pricing"
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="yo-container relative z-10">
        <div className="text-center max-w-none md:max-w-2xl xl:max-w-3xl mx-auto">
          <span className="yo-subtitle">Our Pricing</span>
          <h2 className="yo-headline-split text-[40px] md:text-[48px] leading-none mt-5">
            Premium service without{" "}
            <span className="light">premium price tag</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10 mt-16">
          {PRICING_PLANS.map((plan) => {
            const highlighted = Boolean(plan.highlighted);
            return (
              <div
                key={plan.title}
                className={cn(
                  "relative rounded-[10px] shadow-soft transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]",
                  highlighted ? "bg-secondary text-white" : "bg-white",
                )}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-primary text-white">
                    <PlanIcon name={plan.icon} />
                  </span>
                  {plan.extraIcon ? (
                    <span className="flex items-center justify-center w-[60px] h-[60px] rounded-full bg-primary text-white -ml-3">
                      <PlanIcon name={plan.extraIcon} />
                    </span>
                  ) : null}
                </div>

                <div
                  className={cn(
                    "text-center pt-14 px-9 pb-9 border-b",
                    highlighted ? "border-white/10" : "border-black/8",
                  )}
                >
                  <h4
                    className={cn(
                      "text-2xl font-extrabold mb-3",
                      highlighted ? "text-white" : "text-heading",
                    )}
                  >
                    {plan.title}
                  </h4>
                  <h3
                    className={cn(
                      "text-[50px] font-bold leading-none mb-3",
                      highlighted ? "text-white" : "text-secondary",
                    )}
                  >
                    {plan.price}
                    <span className="text-[16px] font-normal opacity-80">
                      {plan.unit}
                    </span>
                  </h3>
                  <span
                    className={cn(
                      "block w-4/5 mx-auto text-sm leading-relaxed",
                      highlighted ? "text-white/80" : "text-body",
                    )}
                  >
                    {plan.caption}
                  </span>
                </div>

                <div className="px-9 pt-9 pb-12">
                  <ul className="space-y-3 mb-8 list-none">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-[16px]"
                      >
                        <CheckIcon
                          className={cn(
                            "size-5 shrink-0",
                            highlighted ? "text-primary" : "text-secondary",
                          )}
                        />
                        <span
                          className={cn(
                            highlighted ? "text-white" : "text-heading",
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className={cn(
                      "yo-btn w-full",
                      highlighted ? "yo-btn-white" : "yo-btn-primary",
                    )}
                  >
                    Choose Plan
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="hidden md:block absolute right-[5%] bottom-1/4 size-3 rounded-full bg-primary yo-anim-x"
      />
      <span
        aria-hidden="true"
        className="hidden md:block absolute right-[10%] top-1/4 size-3 border-2 border-secondary yo-anim-drift"
      />
      <span
        aria-hidden="true"
        className="hidden md:block absolute left-[5%] top-[5%] w-12 h-16 border border-black/10 rounded-md yo-anim-drift"
      />
    </section>
  );
}
