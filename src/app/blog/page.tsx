import type { Metadata } from "next";
import Link from "next/link";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Field Notes — Sea of Cortez Marine Wildlife Blog",
  description:
    "Trip planning, wildlife guides, and Sea of Cortez stories from Bajablue Tours — marine expeditions near La Ventana, Baja California Sur.",
  alternates: { canonical: "https://bajablue.mx/blog" },
  openGraph: {
    title: "Bajablue Field Notes — Sea of Cortez Marine Wildlife Blog",
    description: "Trip planning, wildlife guides, and Sea of Cortez stories from La Ventana, Mexico.",
    url: "https://bajablue.mx/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://bajablue.mx/blog#blog",
    name: "Bajablue Field Notes",
    description:
      "Trip planning, wildlife guides, and Sea of Cortez stories from Bajablue Tours marine expeditions.",
    publisher: { "@id": "https://bajablue.mx/#business" },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
      url: `https://bajablue.mx/blog/${p.slug}`,
      image: `https://bajablue.mx${p.image}`,
    })),
  };

  return (
    <SmoothScroll>
      <BreadcrumbSchema items={[
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Navbar />
      <main>
        <section className="bg-deep pt-32 pb-16 px-6 border-b border-warm-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-4">Field Notes</p>
            <h1 className="text-display text-warm-white text-4xl md:text-6xl tracking-wide mb-6">
              Stories from the Sea of Cortez
            </h1>
            <p className="text-warm-white/60 text-base font-body leading-relaxed max-w-2xl mx-auto">
              Trip planning, wildlife guides, and Sea of Cortez stories from marine expeditions in La Ventana, Baja California Sur.
            </p>
          </div>
        </section>

        <section className="bg-deep py-16 md:py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {blogPosts.map((post) => (
              <article key={post.slug} className="border-b border-warm-white/10 pb-12 last:border-b-0">
                <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden group">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      width={560}
                      height={420}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((t) => (
                        <span key={t} className="text-copper text-xs font-body tracking-[0.2em] uppercase">{t}</span>
                      ))}
                    </div>
                    <h2 className="text-display text-warm-white text-2xl md:text-3xl tracking-wide mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-copper transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-warm-white/40 text-xs font-body tracking-[0.2em] uppercase mb-4">
                      {post.dateLabel} · {post.readingTime} · By {post.author}
                    </p>
                    <p className="text-warm-white/60 text-sm font-body leading-relaxed mb-5">{post.description}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block text-copper hover:text-copper-light text-xs font-body tracking-[0.2em] uppercase border-b border-copper/40 pb-1 transition-colors"
                    >
                      Read article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
