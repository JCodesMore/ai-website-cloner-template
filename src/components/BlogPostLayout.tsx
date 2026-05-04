"use client";

import Link from "next/link";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";
import type { BlogPost } from "@/data/blog";

export function BlogPostLayout({ post, children }: { post: BlogPost; children: React.ReactNode }) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://bajablue.mx/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    image: `https://bajablue.mx${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      "@id": "https://bajablue.mx/#business",
      name: post.author,
    },
    publisher: { "@id": "https://bajablue.mx/#business" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://bajablue.mx/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    inLanguage: "en",
  };

  return (
    <SmoothScroll>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: post.title, href: `/blog/${post.slug}` },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />
      <main>
        <article itemScope itemType="https://schema.org/BlogPosting">
          <meta itemProp="datePublished" content={post.date} />
          <meta itemProp="dateModified" content={post.date} />
          <meta itemProp="author" content={post.author} />

          {/* Hero image */}
          <section className="relative h-[50vh] md:h-[60vh] overflow-hidden mt-0">
            <img
              src={post.image}
              alt={post.imageAlt}
              width={1920}
              height={1080}
              loading="eager"
              decoding="async"
              itemProp="image"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/50" />
            <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-cream to-transparent z-10" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 z-10">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-4">
                  {post.tags.join(" · ")}
                </p>
                <h1
                  itemProp="headline"
                  className="text-display text-white text-3xl md:text-5xl tracking-wide mb-4 leading-tight"
                >
                  {post.title}
                </h1>
                <p className="text-white/60 text-xs font-body tracking-[0.2em] uppercase">
                  {post.dateLabel} · {post.readingTime} · By {post.author}
                </p>
              </div>
            </div>
          </section>

          {/* Article body */}
          <section className="bg-cream py-16 md:py-24 px-6">
            <div
              itemProp="articleBody"
              className="max-w-2xl mx-auto prose-blog text-navy/80 font-body leading-relaxed text-base"
            >
              {children}

              <hr className="my-12 border-navy/15" />

              <p className="text-xs font-body text-navy/40">
                Last updated: {post.dateLabel}. Written by {post.author}, based in La Ventana, Baja California Sur.
              </p>

              <div className="mt-10 border border-navy/15 bg-sand p-6 shadow-sm">
                <p className="text-teal text-xs font-body tracking-[0.3em] uppercase mb-2">Plan Your Expedition</p>
                <p className="text-navy/75 text-sm mb-5">
                  Ready to see it for yourself? Book any of our marine expeditions or message us with questions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/tours"
                    className="inline-block border border-navy/25 bg-cream hover:bg-warm-white text-navy px-5 py-2.5 font-body text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    View Tours
                  </Link>
                  <a
                    href={siteConfig.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => events.whatsappClick(`blog-${post.slug}`)}
                    className="inline-block bg-navy hover:bg-deep text-warm-white px-5 py-2.5 font-body text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    Book on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />

      <style>{`
        .prose-blog h2 {
          font-family: var(--font-display), serif;
          color: #1A3A4A;
          font-size: 1.625rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .prose-blog h3 {
          font-family: var(--font-display), serif;
          color: #1A3A4A;
          font-size: 1.25rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose-blog p {
          margin-bottom: 1.25rem;
          color: rgba(26, 58, 74, 0.75);
        }
        .prose-blog ul, .prose-blog ol {
          margin: 0 0 1.25rem 1.5rem;
          list-style: disc;
          color: rgba(26, 58, 74, 0.75);
        }
        .prose-blog ol { list-style: decimal; }
        .prose-blog li { margin-bottom: 0.5rem; }
        .prose-blog a {
          color: #36859A;
          text-decoration: underline;
        }
        .prose-blog a:hover { color: #4A9DB2; }
        .prose-blog blockquote {
          border-left: 3px solid #36859A;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: rgba(26, 58, 74, 0.6);
          font-style: italic;
        }
        .prose-blog strong { color: #1A3A4A; font-weight: 600; }
      `}</style>
    </SmoothScroll>
  );
}
