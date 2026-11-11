import type { Metadata } from "next";
import { BonanzaCarousel } from "@/components/sites/showlanka/bonanza";
import { bonanzaPage } from "@/components/sites/showlanka/content/pages";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";

export const metadata: Metadata = { title: bonanzaPage.seoTitle, description: bonanzaPage.description };

export default function SweetBonanzaPage() {
  return (
    <>
      <SubPageHero hero={bonanzaPage.hero} />
      <section className="flex package-content">
        <div className="container">
          <h1 className="sub-page-title border-after">{bonanzaPage.heading}</h1>
          <p>{bonanzaPage.intro}</p>
        </div>
      </section>
      <section className="bonanza-list">
        <div className="container">
          <div className="bonanza-content-container">
            <div className="row">
              <div className="col-12 bonanza-list-container page-bonanza">
                <BonanzaCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
