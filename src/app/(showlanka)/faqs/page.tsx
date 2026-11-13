import type { Metadata } from "next";
import { faqPage } from "@/components/sites/showlanka/content/pages";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";

export const metadata: Metadata = { title: faqPage.seoTitle, description: faqPage.description };

export default function FaqPage() {
  return (
    <>
      <SubPageHero hero={faqPage.hero} />
      <section className="flex subpage-content">
        <div className="container">
          <h1 className="sub-page-title border-after">FAQs</h1>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <article>
            {faqPage.faqs.map((f) => (
              <div key={f.q}>
                <h4>{f.q}</h4>
                <p>{f.a}</p>
              </div>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
