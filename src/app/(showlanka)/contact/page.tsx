import type { Metadata } from "next";
import { ContactForm } from "@/components/sites/showlanka/contact-form";
import { contactPage } from "@/components/sites/showlanka/content/pages";
import { DeferredIframe } from "@/components/sites/showlanka/deferred-iframe";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";

export const metadata: Metadata = { title: contactPage.seoTitle, description: contactPage.description };

export default function ContactPage() {
  return (
    <>
      <SubPageHero hero={contactPage.hero} />
      <section className="flex subpage-content">
        <div className="container">
          <h2 className="sub-page-title border-after">{contactPage.heading}</h2>
          <ContactForm />
        </div>
      </section>
      <section className="flex contact-details-section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="map-container">
                <DeferredIframe
                  src={contactPage.map}
                  width="100%"
                  height={300}
                  style={{ border: 0 }}
                  allowFullScreen
                  title="Show Lanka Tours location on Google Maps"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <p className="uppercase-subtitle">address</p>
              <p>
                Show Lanka Tours, <br />
                21, 1/6, Nelu Gardens,
                <br />
                Yatiyana, <br />
                Minuwangoda 11550
              </p>
              <p className="uppercase-subtitle">phone</p>
              <p>
                0094 779 144664
                <br />
                0094 112281729
              </p>
              <p className="uppercase-subtitle">email</p>
              <a href="mailto:showlankatours@gmail.com">showlankatours@gmail.com</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
