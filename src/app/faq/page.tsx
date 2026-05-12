"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { FAQS } from "@/lib/pages-content";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <>
      <PageHero title="FAQ" />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="text-center mb-16">
            <span className="yo-subtitle">FAQ</span>
            <h2 className="yo-headline-split text-[36px] md:text-[44px] lg:text-[48px] leading-none mt-5 max-w-3xl mx-auto">
              Your internet questions <span className="light">clearly answered here</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((item, idx) => {
              const open = idx === openIdx;
              return (
                <div
                  key={item.q}
                  className={cn(
                    "rounded-[10px] overflow-hidden border transition-colors",
                    open ? "border-primary bg-primary/5" : "border-black/10 bg-white",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIdx(open ? -1 : idx)}
                    className={cn(
                      "w-full flex items-center justify-between gap-4 text-left px-6 py-5 font-extrabold text-lg transition-colors",
                      open ? "text-primary" : "text-foreground hover:text-primary",
                    )}
                  >
                    <span>{item.q}</span>
                    <ChevronDownIcon
                      className={cn(
                        "size-5 transition-transform duration-300 shrink-0",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-body leading-[1.8]">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
