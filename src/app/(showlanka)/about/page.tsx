import type { Metadata } from "next";
import { aboutPage } from "@/components/sites/showlanka/content/pages";
import { HandshakeIcon, HikingIcon, SmileIcon } from "@/components/sites/showlanka/icons";
import { upload } from "@/components/sites/showlanka/site-link";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";
import { TeamSection } from "@/components/sites/showlanka/team-cards";

export const metadata: Metadata = { title: aboutPage.seoTitle, description: aboutPage.description };

const visionIcons = {
  handshake: { icon: <HandshakeIcon />, className: "" },
  hiking: { icon: <HikingIcon />, className: "green" },
  smile: { icon: <SmileIcon />, className: "yellow-icon" },
};

export default function AboutPage() {
  const { story } = aboutPage;
  return (
    <>
      <SubPageHero hero={aboutPage.hero} />
      <section className="flex subpage-content">
        <div className="container">
          <h2 className="sub-page-title border-after">{aboutPage.heading}</h2>
          <p>{aboutPage.intro}</p>
        </div>
      </section>
      <section className="story-container">
        <div className="container">
          <h2 className="section-title">Our Story</h2>
          <article className="col-12 twothirdcol-container">
            <div className="row twocol-inner flex flex-1">
              <div
                className="col-lg-4 col-12 bg-image-container"
                role="img"
                aria-label={story.title}
                style={{ backgroundImage: `url('${upload(story.image)}')` }}
              />
              <div className="col-lg-8 col-12 text-content">
                <h3>{story.title}</h3>
                {story.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
      <section className="about-vision">
        <div className="container">
          <p className="uppercase-subtitle border-after">Expanding Horizons with Unique Adventures</p>
          <h2 className="section-title">Our Vision for the Future</h2>
          <div className="row bordered-posts">
            {aboutPage.vision.map((v) => (
              <article key={v.title} className="col-lg-4 col-12 threecol-container">
                <div className="row threecol-inner flex flex-1">
                  <div className="col-12 text-content">
                    <h3>{v.title}</h3>
                    <span className={`icon-line ${visionIcons[v.icon].className}`}>{visionIcons[v.icon].icon}</span>
                    <p>
                      {v.text}
                      {"email" in v && v.email && (
                        <>
                          {" "}
                          <a href={`mailto:${v.email}`}>{v.email}</a>.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <TeamSection id="our-team" />
      <section className="b2b-container" id="b2b-business">
        <div className="container">
          <article className="fullpage-container">
            <div className="flex flex-col text-content">
              <p className="uppercase-subtitle border-after">Building Lasting Partnerships for Success</p>
              <h2 className="section-title">B2B Business</h2>
              <p>
                {aboutPage.b2b.text} <a href={`mailto:${aboutPage.b2b.email}`}>{aboutPage.b2b.email}</a>
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
