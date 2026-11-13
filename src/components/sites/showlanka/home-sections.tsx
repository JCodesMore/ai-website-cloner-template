"use client";

import { ASSETS, packages } from "./data";
import { CertificateIcon, HeartIcon, ShieldIcon } from "./icons";
import { usePageLoaded } from "./use-page-loaded";

export function HomeIntro() {
  const loaded = usePageLoaded();
  return (
    <section className="home-content">
      <div className="container">
        <div className="row">
          <div className={`col-12 home-text-content on-load-animate${loaded ? " animated" : ""}`}>
            <article className="flex-1 home-container h-100">
              <div className="text-content flex-fill">
                <div className="title-wrapper">
                  <p className="uppercase-subtitle">Explore Sri Lanka</p>
                  <h2>Discover Unmatched Sri Lanka Tours with Show Lanka Tours</h2>
                </div>
                <p>
                  Welcome to Show Lanka Tours, the ultimate choice among tour operators in Sri Lanka. At Show Lanka
                  Tours, we specialize in creating unforgettable Sri Lanka tour packages that are budget-friendly yet
                  offer exceptional service and unparalleled value. As experienced tour guides and operators in Sri
                  Lanka, we provide private guides and drivers at affordable rates, ensuring your journey aligns
                  perfectly with your budget. Many claim to be leading tour operators in Sri Lanka, but our proven track
                  record highlights why we truly stand out among tour operators in Sri Lanka.
                </p>
                <p>
                  Are you ready to embark on your Sri Lankan adventure? Explore our diverse tour options and experience
                  the beauty of Sri Lanka like never before. Partner with us for an enriching and hassle-free travel
                  experience. We look forward to welcoming you to the wonders of Sri Lanka with Show Lanka Tours.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PackagesSection() {
  return (
    <section className="packages-section">
      <div className="container-fluid">
        <p className="uppercase-subtitle border-after">Your Gateway to Authentic Sri Lankan Adventures</p>
        <h2 className="section-title">Tour Packages</h2>
        <div className="row main-package-list-container">
          {packages.map((pack) => (
            <article key={pack.query} className="col-lg-4 col-12 mainpack-container">
              <div className="row inner-container flex flex-1">
                <div
                  className="col-12 bg-image-container"
                  role="img"
                  aria-label={pack.title}
                  style={{ backgroundImage: `url('${ASSETS}/packages/${pack.image}')` }}
                >
                  <span />
                </div>
                <div className="col-12 text-content">
                  <h3>{pack.title}</h3>
                  <a target="_blank" rel="noopener" className="post-readmore-link" href={`/sri-lanka-tours?${pack.query}`}>
                    Read More<span className="sr-only"> about {pack.title}</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const reasons = [
  {
    title: "Excellent Customer Service",
    icon: <HeartIcon />,
    iconClass: "red-icon",
    text: "Heartfelt hospitality is our promise. Discover Sri Lanka with warmth and care, supported by our attentive and friendly team.",
  },
  {
    title: "Best Rate Guaranteed",
    icon: <CertificateIcon />,
    iconClass: "yellow-icon",
    text: "Unlock extraordinary experiences at unbeatable rates with our exceptional services. Explore Sri Lanka with confidence, knowing you’re getting the best value for your adventure!",
  },
  {
    title: "Your Trusted Local Guide",
    icon: <ShieldIcon />,
    iconClass: "",
    quote: true,
    text: "Discover hidden gems and immerse yourself in authentic experiences led by passionate locals. Let us tailor your journey for an unforgettable adventure in Sri Lanka!",
  },
];

export function WhySection() {
  return (
    <section className="why-showlanka">
      <div className="container">
        <p className="uppercase-subtitle border-after">Why travel with Show Lanka?</p>
        <h2 className="section-title">Explore Sri Lanka Like a Local</h2>
        <div className="row bordered-posts">
          {reasons.map((reason) => (
            <article key={reason.title} className="col-lg-4 col-12 threecol-container">
              <div className="row threecol-inner flex flex-1">
                <div className="col-12 text-content">
                  <h3>{reason.title}</h3>
                  {/* The source keeps an empty quote block in this card, which adds 1rem. */}
                  {reason.quote && <blockquote />}
                  <span className={`icon-line ${reason.iconClass}`}>{reason.icon}</span>
                  <p>{reason.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
