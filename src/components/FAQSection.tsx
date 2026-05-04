"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { faqs } from "@/data/site";
import { ScrollReveal, StaggerReveal, StaggerChild } from "./ScrollReveal";

interface FAQSectionProps {
  limit?: number;
  showSeeAllLink?: boolean;
  heading?: string;
}

export function FAQSection({ limit, showSeeAllLink = false, heading = "Frequently Asked Questions About Marine Tours in La Ventana" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visibleFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section id="faq" className="light-panel py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-teal-light text-xs font-body tracking-[0.4em] uppercase mb-4">Before You Go</p>
          <h2 className="text-display text-navy text-3xl md:text-5xl tracking-wide">{heading}</h2>
        </ScrollReveal>

        <StaggerReveal staggerDelay={0.08}>
          {visibleFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <StaggerChild key={faq.question}>
                <div className="border-b border-navy/10">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className="text-navy text-sm md:text-base font-body font-medium pr-4 group-hover:text-teal-light transition-colors duration-300">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-navy/30 text-2xl flex-shrink-0 font-light"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </button>
                  {/* Always render answer in DOM for crawlers; CSS controls visibility */}
                  <div
                    id={`faq-answer-${i}`}
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-navy/60 text-sm font-body leading-relaxed pb-6">{faq.answer}</p>
                  </div>
                </div>
              </StaggerChild>
            );
          })}
        </StaggerReveal>

        {showSeeAllLink && (
          <ScrollReveal className="text-center mt-12">
            <a href="/faq" className="inline-block text-navy/50 hover:text-teal-light text-xs font-body tracking-[0.3em] uppercase transition-colors duration-300">
              See all FAQ →
            </a>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
