import type { Metadata } from "next";
import { termsPage } from "@/components/sites/showlanka/content/pages";
import { SOURCE } from "@/components/sites/showlanka/data";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";

export const metadata: Metadata = { title: termsPage.seoTitle, description: termsPage.description };

export default function TermsPage() {
  return (
    <>
      <SubPageHero hero={termsPage.hero} />
      <section className="flex subpage-content">
        <div className="container">
          <h1 className="sub-page-title border-after">Terms and conditions</h1>
          <article>
            <p className="source-note">
              {termsPage.note}{" "}
              <a href={`${SOURCE}/terms-and-conditions/`} target="_blank" rel="noopener">
                Read the full terms
              </a>
              .
            </p>
            {termsPage.sections.map((s) => (
              <div key={s.title}>
                <h3 className="wp-block-heading">{s.title}</h3>
                <p>
                  {s.items.map((item, i) => (
                    <span key={i}>
                      {s.items.length > 1 && <strong>{String.fromCharCode(65 + i)}. </strong>}
                      {item}
                      {i < s.items.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
