import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { PricingPlans } from "@/components/PricingPlans";
import { PACKAGES } from "@/lib/pages-content";
import { cn } from "@/lib/utils";

export const metadata = { title: "Our Packages — VertexLink" };

export default function PackagesPage() {
  return (
    <>
      <PageHero title="Our Packages" />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="text-center mb-16">
            <span className="yo-subtitle">Pricing Plans</span>
            <h2 className="yo-headline-split text-[36px] md:text-[44px] lg:text-[48px] leading-none mt-5 max-w-3xl mx-auto">
              Internet plans for <span className="light">every household</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PACKAGES.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "rounded-[10px] p-10 text-center transition-transform duration-300 hover:-translate-y-2",
                  p.highlighted
                    ? "bg-secondary text-white shadow-[0_14px_35px_rgba(223,3,3,0.18)]"
                    : "bg-light text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
                )}
              >
                <h4 className="text-2xl font-extrabold mb-2">{p.name}</h4>
                <span
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    p.highlighted ? "text-primary" : "text-primary",
                  )}
                >
                  {p.speed}
                </span>
                <div className="my-6">
                  <span className="text-[50px] font-bold leading-none">{p.price}</span>
                  <span className={cn("text-sm ml-1", p.highlighted ? "text-white/80" : "text-body")}>
                    {p.unit}
                  </span>
                </div>
                <ul
                  className={cn(
                    "space-y-3 text-left mb-8",
                    p.highlighted ? "text-white" : "text-foreground",
                  )}
                >
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckIcon className="size-5 text-primary shrink-0 mt-1" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={cn(
                    "yo-btn w-full",
                    p.highlighted ? "yo-btn-white" : "yo-btn-primary",
                  )}
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingPlans />
    </>
  );
}
