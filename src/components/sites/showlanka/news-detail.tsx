/* eslint-disable @next/next/no-img-element */
import type { NewsItem } from "./content/types";
import { SOURCE } from "./data";
import { upload } from "./site-link";

/** Single news post. Shows a summary and links to the full article on showlanka.com. */
export function NewsDetail({ item }: { item: NewsItem }) {
  return (
    <article className="post-page-content">
      {item.hero && (
        <div className="post-image-container">
          <img src={upload(item.hero)} alt={item.title} className="active" />
        </div>
      )}
      <div className="container">
        <div className="flex flex-col post-single-container">
          <h1 className="header-image-title">{item.title}</h1>
          <p className="published-date">{item.date}</p>
          {item.video && (
            <div className="post-video" id="video-player">
              <iframe
                src={`https://www.youtube.com/embed/${item.video}`}
                title={item.title}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
          {item.summary.map((p, i) =>
            // Admin-written posts mark sub-headings with a leading "## ".
            p.startsWith("## ") ? <h3 key={i}>{p.slice(3)}</h3> : <p key={i}>{p}</p>,
          )}
          {!item.standalone && (
            <p className="source-note">
              <a href={`${SOURCE}/${item.slug}/`} target="_blank" rel="noopener">
                Read the full article on showlanka.com
              </a>
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
