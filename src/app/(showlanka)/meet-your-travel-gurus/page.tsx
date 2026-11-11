import type { Metadata } from "next";
import { guides, gurusPage } from "@/components/sites/showlanka/content/pages";
import { upload } from "@/components/sites/showlanka/site-link";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";
import { TeamSection } from "@/components/sites/showlanka/team-cards";

export const metadata: Metadata = { title: gurusPage.seoTitle, description: gurusPage.description };

export default function GurusPage() {
  const { support } = gurusPage;
  return (
    <>
      <SubPageHero hero={gurusPage.hero} />
      <section className="flex subpage-content" id="ground-support">
        <div className="container">
          <h2 className="sub-page-title border-after">{gurusPage.heading}</h2>
          <p>{gurusPage.intro}</p>
          <h3>{support.title}</h3>
          <p>{support.text}</p>
          <ol>
            {support.points.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong>
                {p.text}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="our-guides" id="our-guides">
        <div className="container">
          <p className="uppercase-subtitle border-after">Bringing the Best of Sri Lanka to Life</p>
          <h2 className="section-title">{gurusPage.guidesTitle}</h2>
          <p>{gurusPage.guidesIntro}</p>
          <h4>{gurusPage.guidesWhyTitle}</h4>
          <ol>
            {gurusPage.guidesWhy.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong>
                {p.text}
              </li>
            ))}
          </ol>
          <div className="row bordered-posts">
            {guides.map((g) => (
              <article key={g.image} className="col-lg-4 col-12 threecol-container">
                <div className="row threecol-inner flex flex-1">
                  <div
                    className="col-12 bg-image-container"
                    role="img"
                    aria-label={g.name}
                    style={{ backgroundImage: `url('${upload(g.image)}')` }}
                  />
                  <div className="col-12 text-content">
                    <h3>{g.name}</h3>
                    <ul>
                      <li>
                        <strong>Type of Occupation</strong>: Chauffeur Guide
                      </li>
                      <li>
                        <strong>Languages</strong>: {g.languages}
                      </li>
                      <li>
                        <strong>Years of Experience</strong>: {g.years}
                      </li>
                      <li>
                        <strong>Type of Vehicle</strong>: {g.vehicle}
                      </li>
                      <li>
                        <strong>Number of Seats</strong>: {g.seats}
                      </li>
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <TeamSection className="our-team" />
    </>
  );
}
