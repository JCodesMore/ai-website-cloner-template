"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How do I get started?",
    answer:
      "To get started, click Sign up and answer a few quick questions. Afterwards, our support team will contact you to set up your account \u2014 or you can reach out to us directly via Telegram or WhatsApp.",
  },
  {
    question: "Which platforms do your cards work with?",
    answer:
      "Our cards are compatible with all major ad platforms, including Google Ads, Meta Ads, TikTok Ads, X (formerly Twitter), Bing, and more. We also provide cards for online payments, like paying for subscriptions and services.",
  },
  {
    question: "What top-up methods are available?",
    answer:
      "We support several top-up methods, including cryptocurrency, SEPA, SWIFT, and Wire transfers \u2014 choose the one that works best for you.",
  },
  {
    question: "Can I choose the billing address on the card?",
    answer:
      "Yes, when issuing a card you can select a custom billing address to match your ad account or merchant requirements.",
  },
];

function PlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-full transition-all duration-200 ease-in-out",
        isOpen ? "bg-[#eadbff]" : "bg-[#f7f7f7]"
      )}
      style={{
        width: "clamp(1.75rem, 1.3338rem + 1.7761vw, 2.5rem)",
      }}
    >
      {/* Horizontal line */}
      <span className="absolute h-[2px] w-3 bg-[#151c28] md:w-3.5" />
      {/* Vertical line */}
      <span
        className={cn(
          "absolute h-3 w-[2px] bg-[#151c28] transition-transform duration-200 ease-in-out md:h-3.5",
          isOpen ? "rotate-90" : "rotate-0"
        )}
      />
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-6 pb-16 pt-0 md:pb-24">
      <div
        className="relative isolate mx-auto overflow-hidden bg-[#fcfcfd]"
        style={{
          borderRadius:
            "clamp(0rem, 2.6291vw - 0.6162rem, 1.75rem)",
          padding:
            "clamp(2.5rem, 1.2676rem + 5.2582vw, 6.25rem) 1.875rem clamp(2.5rem, 1.5845rem + 3.9437vw, 5rem)",
        }}
      >
        {/* Decorative circle */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-[#dfe4ec] bg-white opacity-50"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full border border-[#dfe4ec] bg-white opacity-40"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[55rem]">
          <h2
            className="mb-10 text-center leading-[1.2] font-bold text-[#151c28] md:mb-14"
            style={{
              fontSize:
                "clamp(1.75rem, 1.1338rem + 2.6291vw, 3.5rem)",
            }}
          >
            Frequently asked questions
          </h2>

          <div className="grid gap-5">
            {faqItems.map((item, index) => (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-2xl border border-[#dfe4ec] bg-white text-left transition-all duration-200",
                    openIndex === index &&
                      "rounded-b-none border-b-0"
                  )}
                  style={{
                    padding:
                      "clamp(1rem, 0.7923rem + 0.8873vw, 1.25rem) clamp(1.25rem, 0.9423rem + 1.3138vw, 1.875rem)",
                  }}
                  aria-expanded={openIndex === index}
                >
                  <span className="pr-4 font-semibold text-[#151c28]">
                    {item.question}
                  </span>
                  <PlusIcon isOpen={openIndex === index} />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-200 ease-in-out",
                    openIndex === index
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className="rounded-b-2xl border border-t-0 border-[#dfe4ec] bg-white"
                      style={{
                        padding:
                          "0 clamp(1.25rem, 0.9423rem + 1.3138vw, 1.875rem) clamp(1rem, 0.7923rem + 0.8873vw, 1.25rem)",
                      }}
                    >
                      <p className="max-w-[35ch] pb-4 text-[#4d5e80]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
