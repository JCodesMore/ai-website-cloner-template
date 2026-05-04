"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/site";

interface Props {
  limit?: number;
  showSeeAllLink?: boolean;
  heading?: string;
}

export function FAQSectionMobile({
  limit,
  showSeeAllLink = false,
  heading = "Common questions before you book",
}: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const visibleFaqs = limit ? faqs.slice(0, limit) : faqs;

  function toggle(idx: number) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
    setOpenIdx(openIdx === idx ? null : idx);
  }

  return (
    <section className="md:hidden bg-cream py-12 px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <p className="text-teal-light text-[10px] font-body tracking-[0.35em] uppercase mb-2">Before you go</p>
        <h2 className="text-display text-navy text-2xl tracking-wide leading-tight">{heading}</h2>
      </motion.div>

      <div className="space-y-2">
        {visibleFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={faq.question}
              className={`bg-white border rounded-sm transition-colors ${
                isOpen ? "border-teal-light/50" : "border-navy/10"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left"
              >
                <p className={`text-sm font-body font-medium leading-snug ${isOpen ? "text-teal-light" : "text-navy"}`}>
                  {faq.question}
                </p>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isOpen ? "border-teal-light bg-teal-light/15 rotate-45" : "border-navy/20"
                  }`}
                >
                  <svg
                    className={`w-3 h-3 transition-colors ${isOpen ? "text-teal-light" : "text-navy/40"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 border-t border-navy/5">
                      <p className="text-navy/65 text-sm font-body leading-relaxed pt-3">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {showSeeAllLink && (
        <div className="mt-6 text-center">
          <a
            href="/faq"
            className="inline-block text-teal-light text-[11px] font-body tracking-[0.3em] uppercase border-b border-teal-light/30 pb-1"
          >
            See all FAQ →
          </a>
        </div>
      )}
    </section>
  );
}
