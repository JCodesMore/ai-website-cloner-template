"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs, siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";

export function FAQPageMobile() {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [query]);

  function toggle(idx: number) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(10);
    setOpenIdx(openIdx === idx ? null : idx);
  }

  return (
    <div className="md:hidden bg-deep">
      {/* Hero */}
      <section className="px-5 pt-4 pb-5 bg-gradient-to-b from-navy to-deep">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-teal-light/80 text-[10px] font-body tracking-[0.35em] uppercase mb-2"
        >
          Everything you need to know
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-display text-warm-white text-3xl tracking-wide leading-tight"
        >
          FAQ
        </motion.h1>
      </section>

      {/* Search */}
      <section className="px-5 py-4 sticky top-0 z-20 bg-deep/95 backdrop-blur-md border-b border-warm-white/5">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/[0.06] border border-teal/15 focus:border-teal-light focus:bg-white/[0.08] rounded-full pl-10 pr-10 py-2.5 text-sm font-body text-warm-white placeholder:text-warm-white/35 outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-warm-white/60 active:scale-90 transition-transform"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Questions */}
      <section className="px-5 py-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-warm-white/50 text-sm font-body mb-4">
              No matches for &ldquo;{query}&rdquo;.
            </p>
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => events.whatsappClick("faq-no-results")}
              className="inline-block bg-coral text-deep px-5 py-2.5 rounded-full text-xs font-body font-medium tracking-[0.2em] uppercase active:scale-95 transition-transform"
            >
              Ask on WhatsApp
            </a>
          </div>
        ) : (
          filtered.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className={`bg-white/[0.04] border rounded-sm transition-colors ${
                  isOpen ? "border-teal/40" : "border-teal/15"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left active:bg-white/[0.02]"
                  aria-expanded={isOpen}
                >
                  <p className={`text-sm font-body leading-snug ${isOpen ? "text-warm-white" : "text-warm-white/85"}`}>
                    {faq.question}
                  </p>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isOpen
                        ? "border-teal-light bg-teal-light/15 rotate-45"
                        : "border-warm-white/25"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 transition-colors ${isOpen ? "text-teal-light" : "text-warm-white/60"}`}
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
                      <div className="px-4 pb-4 pt-0 border-t border-warm-white/5">
                        <p className="text-warm-white/65 text-sm font-body leading-relaxed pt-3">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </section>

      {/* Still have questions? */}
      <section className="px-5 py-8">
        <div className="bg-white/[0.04] border border-teal/15 rounded-sm p-6 text-center">
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">Still curious?</p>
          <h2 className="text-display text-warm-white text-xl tracking-wide leading-tight mb-3">
            Talk to a real human
          </h2>
          <p className="text-warm-white/55 text-xs font-body leading-relaxed mb-5">
            A Bajablue team member or guide will reply on WhatsApp — usually within 2 hours during business hours.
          </p>
          <a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
              events.whatsappClick("faq-bottom-cta");
            }}
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full text-xs font-body tracking-[0.25em] uppercase active:scale-95 transition-transform"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            Ask on WhatsApp
          </a>
        </div>
      </section>

      <p className="text-warm-white/30 text-[10px] font-body text-center py-6">
        Last updated April 2026
      </p>
    </div>
  );
}
