"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What kind of businesses do you work with?",
    answer:
      "We work with service businesses, agencies, coaches, consultants, and operators who want to automate their workflows without hiring a full dev team.",
  },
  {
    question: "How long does it take to build a system?",
    answer:
      "Most systems are live within 3–7 business days. Complex multi-workflow builds may take up to 2 weeks.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. We handle all technical setup, integrations, and testing. You just tell us how your business works.",
  },
  {
    question: "What tools do you use to build?",
    answer:
      "We primarily use Make, Zapier, n8n, Airtable, and Notion — plus native APIs and webhooks when needed.",
  },
  {
    question: "What happens after the system is built?",
    answer:
      "We offer ongoing monitoring and maintenance packages so your automation stays healthy as your business changes.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "oklch(1 0 0 / 0.9)",
            marginBottom: "8px",
          }}
        >
          Frequently asked questions
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "oklch(1 0 0 / 0.6)",
            marginBottom: "32px",
          }}
        >
          Direct answers about how FLO works.
        </p>

        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid oklch(1 0 0 / 0.1)",
                padding: "16px 0",
              }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                  color: "oklch(1 0 0 / 0.9)",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "inherit",
                }}
              >
                <span>{faq.question}</span>
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    flexShrink: 0,
                    marginLeft: "16px",
                    color: "oklch(1 0 0 / 0.6)",
                  }}
                >
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "oklch(1 0 0 / 0.6)",
                    marginTop: "8px",
                    lineHeight: 1.7,
                  }}
                >
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
