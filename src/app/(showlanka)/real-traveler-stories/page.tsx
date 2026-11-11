import type { Metadata } from "next";
import { storiesPage } from "@/components/sites/showlanka/content/pages";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";
import { VideoCard } from "@/components/sites/showlanka/video-card";

export const metadata: Metadata = { title: storiesPage.seoTitle, description: storiesPage.description };

export default function StoriesPage() {
  return (
    <>
      <SubPageHero hero={storiesPage.hero} />
      <section className="flex subpage-content video-review-page">
        <div className="container">
          <h1 className="sub-page-title border-after">{storiesPage.heading}</h1>
          <p>{storiesPage.intro}</p>
        </div>
      </section>
      <section className="review-section review-page" id="review-section">
        <div className="container-fluid">
          <h2 className="section-title">{storiesPage.videosTitle}</h2>
          <div className="row">
            {storiesPage.videos.map((v, i) => (
              <VideoCard key={i} {...v} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
