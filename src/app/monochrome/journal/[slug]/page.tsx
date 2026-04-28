import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import {
  ARTICLES,
  PRODUCT_BADGE_DESCRIPTION,
  PRODUCT_BADGE_HREF,
  type JournalArticle,
} from "../articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): Array<{ slug: string }> {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) {
    return { title: "ジャーナル | Monochrome" };
  }
  return {
    title: `${article.title} | Monochrome`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: [{ url: article.hero }],
    },
  };
}

const findRelated = (article: JournalArticle): JournalArticle[] => {
  const explicit = (article.relatedSlugs ?? [])
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is JournalArticle => Boolean(a) && a?.slug !== article.slug);

  if (explicit.length >= 3) return explicit.slice(0, 3);

  // Fallback: same category, then nearest by date.
  const sameCategory = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category,
  );
  const fallback = [...explicit];
  for (const candidate of sameCategory) {
    if (fallback.length >= 3) break;
    if (!fallback.some((a) => a.slug === candidate.slug)) {
      fallback.push(candidate);
    }
  }
  for (const candidate of ARTICLES) {
    if (fallback.length >= 3) break;
    if (
      candidate.slug !== article.slug &&
      !fallback.some((a) => a.slug === candidate.slug)
    ) {
      fallback.push(candidate);
    }
  }
  return fallback.slice(0, 3);
};

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const [lead, ...rest] = article.body;
  const related = findRelated(article);
  const badge = article.productBadge;
  const badgeHref = badge ? PRODUCT_BADGE_HREF[badge] : undefined;
  const badgeDescription = badge ? PRODUCT_BADGE_DESCRIPTION[badge] : undefined;

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative h-[60vh] md:h-[70vh] base-px overflow-hidden">
          <Image
            src={article.hero}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 base-px pb-10 md:pb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-white/90">
              JOURNAL · {article.category}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal mt-3 max-w-3xl leading-[1.4] text-white">
              {article.title}
            </h1>
            <p className="text-sm mt-4 text-white/80">{article.date}</p>
          </div>
        </section>

        {/* Body */}
        <article data-reveal className="max-w-2xl mx-auto base-px py-16 md:py-24">
          {lead ? (
            <p className="text-xl md:text-2xl font-normal leading-[1.7] text-neutral-900">
              {lead}
            </p>
          ) : null}

          {badge && badgeHref ? (
            <Link
              href={badgeHref}
              className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-300 text-xs font-mono text-neutral-700 transition-colors hover:bg-neutral-900 hover:text-white hover:border-neutral-900"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {badge}
            </Link>
          ) : null}

          {rest.map((paragraph, index) => (
            <p
              key={index}
              className="mt-6 text-base leading-[1.9] text-neutral-800"
            >
              {paragraph}
            </p>
          ))}

          <p className="mt-12 text-2xl text-neutral-400 text-center">❉</p>
        </article>

        {/* Share / back nav */}
        <div className="max-w-2xl mx-auto base-px pb-12 flex items-center justify-between border-t border-neutral-200 pt-8 text-sm text-neutral-500">
          <Link
            href="/monochrome/journal"
            className="transition-colors hover:text-black"
          >
            ← ジャーナル一覧へ
          </Link>
          <Link
            href="/monochrome/contact"
            className="transition-colors hover:text-black"
          >
            お問い合わせ
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 ? (
          <section data-reveal className="bg-beige base-px py-16 md:py-20">
            <h2 className="text-xl font-medium mb-8">関連する読み物</h2>
            <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((other) => (
                <Link
                  key={other.slug}
                  href={`/monochrome/journal/${other.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f3]">
                    <Image
                      src={other.hero}
                      alt={other.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-xs text-neutral-500">
                    {other.category}
                  </p>
                  <p className="mt-2 text-base font-normal leading-relaxed">
                    {other.title}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{other.date}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Product cross-sell */}
        {badge && badgeHref && badgeDescription ? (
          <section data-reveal className="base-px py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
              <h2 className="text-2xl md:text-3xl font-normal leading-[1.4]">
                {badge}について詳しく見る
              </h2>
              <div>
                <p className="text-base leading-[1.9] text-neutral-800">
                  {badgeDescription}
                </p>
                <Link
                  href={badgeHref}
                  className="button-base button-fill mt-8"
                >
                  製品ページへ
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* Newsletter CTA */}
        <section data-reveal className="bg-dark text-white base-px py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-normal">ニュースレター登録</h2>
          <p className="mt-4 text-sm md:text-base text-white/80">
            モノクロームの最新情報をお届けします。
          </p>
          <form
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            action="/monochrome/newsletter"
            method="get"
          >
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              aria-label="メールアドレス"
              className="flex-1 h-10 px-4 bg-transparent border border-white/30 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white"
            />
            <Link
              href="/monochrome/newsletter"
              className="button-base button-fill"
            >
              登録する
            </Link>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
