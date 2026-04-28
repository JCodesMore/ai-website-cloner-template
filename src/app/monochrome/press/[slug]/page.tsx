import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { RELEASES } from "../releases";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return RELEASES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const release = RELEASES.find((r) => r.slug === slug);
  return {
    title: release ? `${release.title} | Monochrome` : "Monochrome",
  };
}

export default async function PressReleasePage({ params }: PageProps) {
  const { slug } = await params;
  const release = RELEASES.find((r) => r.slug === slug);
  if (!release) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <article data-reveal className="max-w-3xl mx-auto base-px py-20 md:py-28">
          <p className="text-sm text-neutral-500">
            {release.date} · {release.category}
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal mt-4 leading-[1.4]">
            {release.title}
          </h1>

          <div className="mt-12">
            <p className="text-base md:text-lg leading-[1.8] text-neutral-800">
              {release.lead}
            </p>

            {release.body.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl font-medium mt-12 mb-4">
                  {section.heading}
                </h2>
                <p className="text-base leading-[1.8] text-neutral-800">
                  {section.text}
                </p>
              </div>
            ))}

            <h2 className="text-xl font-medium mt-12 mb-4">会社概要</h2>
            <dl className="text-sm leading-[1.8] text-neutral-800 grid grid-cols-[6rem_1fr] gap-y-1">
              <dt className="text-neutral-500">社名</dt>
              <dd>株式会社モノクローム</dd>
              <dt className="text-neutral-500">代表者</dt>
              <dd>梅田 優祐</dd>
              <dt className="text-neutral-500">設立</dt>
              <dd>2020年</dd>
              <dt className="text-neutral-500">本社</dt>
              <dd>東京都中央区日本橋横山町5-13 MIDORI.so 6F</dd>
              <dt className="text-neutral-500">事業内容</dt>
              <dd>建材一体型太陽光パネル・HEMSの開発販売</dd>
              <dt className="text-neutral-500">URL</dt>
              <dd>
                <a
                  href="https://www.monochrome.so"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-black"
                >
                  https://www.monochrome.so
                </a>
              </dd>
            </dl>

            <h2 className="text-xl font-medium mt-12 mb-4">お問い合わせ先</h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              {release.contact ?? "株式会社モノクローム 広報担当"}
              <br />
              E-mail: press@monochrome.so
            </p>
          </div>

          <div className="mt-16 flex flex-wrap gap-4 justify-between border-t border-neutral-200 pt-8">
            <Link
              href="/monochrome/press"
              className="button-base button-outline"
            >
              ニュース一覧へ
            </Link>
            <Link
              href="/monochrome/contact"
              className="button-base button-fill"
            >
              お問い合わせ
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
