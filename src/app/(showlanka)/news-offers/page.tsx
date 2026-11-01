import type { Metadata } from "next";
import Link from "next/link";
import { newsHero } from "@/components/sites/showlanka/content/news";
import { PlayIcon } from "@/components/sites/showlanka/icons";
import { upload } from "@/components/sites/showlanka/site-link";
import { SubPageHero } from "@/components/sites/showlanka/subpage-parts";
import { getNews } from "@/lib/server/content";

export const metadata: Metadata = {
  title: "Budget tour operators - Latest Sri Lanka Tourism News",
  description: "Sri Lanka tourism news and travel updates from Show Lanka Tours.",
};

export default async function NewsPage() {
  const news = await getNews();
  return (
    <>
      <SubPageHero hero={newsHero} />
      <section className="flex package-content">
        <div className="container">
          <h2 className="sub-page-title border-after">Sri Lanka Travel News &amp; Updates</h2>
        </div>
      </section>
      <section className="packages-list">
        <div className="container">
          <div className="packages-content-container">
            <div className="row">
              {news.map((item) => (
                <div key={item.slug} className="col-lg-6 col-12 news-list-container">
                  <article className="row">
                    <div className="col-12 flex flex-1 inner-wrapper">
                      <div
                        className="image-container"
                        role="img"
                        aria-label={item.title}
                        style={item.card || item.hero ? { backgroundImage: `url('${upload(item.card || item.hero)}')` } : undefined}
                      >
                        {item.video && (
                          <Link
                            href={`/${item.slug}#video-player`}
                            className="video-thumbnail-news"
                            aria-label={`Watch video: ${item.title}`}
                          >
                            <span className="play-wrapper">
                              <PlayIcon />
                            </span>
                          </Link>
                        )}
                      </div>
                      <div className="text-content flex-col">
                        <h3>
                          <Link href={`/${item.slug}`}>{item.title}</Link>
                        </h3>
                        <p className="published-date">{item.date}</p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
