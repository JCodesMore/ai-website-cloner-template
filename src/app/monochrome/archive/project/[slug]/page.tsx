import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { PROJECTS, type ProjectInfo } from "../projects";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    return { title: "施工事例 | Monochrome" };
  }
  return {
    title: `${project.title} | 施工事例 | Monochrome`,
    description: project.description[0],
  };
}

type InfoRow = { label: string; value: string | undefined };

function buildInfoRows(project: ProjectInfo): InfoRow[] {
  return [
    { label: "所在地", value: project.location },
    { label: "設計", value: project.architect },
    { label: "撮影", value: project.photographer },
    { label: "竣工", value: project.completion },
    { label: "用途", value: project.buildingType },
    { label: "構造規模", value: project.scale },
    { label: "延床面積", value: project.totalArea },
    { label: "採用製品", value: project.product },
  ];
}

type ProductCrossSell = {
  href: string;
  blurb: string;
};

const PRODUCT_LINKS: Record<string, ProductCrossSell> = {
  "Roof-1": {
    href: "/monochrome/roof",
    blurb:
      "屋根葺き材としての美しさと、太陽光発電としての性能を両立した建材一体型ソーラー。Roof-1は、屋根そのものを発電面に置き換えるという発想から生まれました。",
  },
  "Wall-1": {
    href: "/monochrome/wall",
    blurb:
      "外壁を覆う黒い面が、そのまま発電面になる。Wall-1は、限られた屋根面積でも十分な発電容量を確保したい、都市の住まいや中高層建築のための一体型ソーラー外装材です。",
  },
  "Panel-B": {
    href: "/monochrome/panel",
    blurb:
      "パネルとして単体で機能する、最小単位のモノクローム。Panel-Bは、増築・改修・小規模建築など、柔軟な配置が求められる場面に応えます。",
  },
};

function getProductCrossSell(product: string): ProductCrossSell {
  // Match by primary product token (e.g. "Roof-1 + Energy-1" → "Roof-1")
  const primary = product.split(/[+\s]/)[0]?.trim() ?? "";
  return (
    PRODUCT_LINKS[primary] ?? {
      href: "/monochrome#products",
      blurb:
        "建材一体型太陽光パネルが、建築の表情を損なわずにエネルギーを生み出します。",
    }
  );
}

function pickOtherProjects(currentSlug: string, count = 3): ProjectInfo[] {
  // Deterministic pick so prerendered pages are stable.
  const others = PROJECTS.filter((p) => p.slug !== currentSlug);
  const startIndex = Math.abs(hashSlug(currentSlug)) % others.length;
  const out: ProjectInfo[] = [];
  for (let i = 0; i < count; i++) {
    out.push(others[(startIndex + i) % others.length]);
  }
  return out;
}

function hashSlug(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const infoRows = buildInfoRows(project).filter((row) => Boolean(row.value));
  const productInfo = getProductCrossSell(project.product);
  const others = pickOtherProjects(project.slug);

  return (
    <>
      <SiteHeader />
      <main>
        {/* 1. Hero */}
        <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
          <Image
            src={project.hero}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 base-px pb-12 md:pb-16 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              PROJECT
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal mt-3 max-w-3xl leading-[1.2]">
              {project.title}
            </h1>
            <p className="mt-3 text-base text-white/80">{project.location}</p>
          </div>
        </section>

        {/* 2. Sticky info bar */}
        <div className="base-px py-6 border-b border-neutral-200 sticky top-0 bg-white z-30 flex items-center justify-between flex-wrap gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-[0.18em]"
          >
            <span>施工事例</span>
            <span aria-hidden>/</span>
            <Link
              href="/monochrome/archive/projects"
              className="transition-colors hover:text-neutral-900"
            >
              一覧へ戻る
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/monochrome/contact"
              className="button-base button-fill"
            >
              相談する
            </Link>
            <Link
              href="/monochrome/download"
              className="button-base button-outline"
            >
              資料ダウンロード
            </Link>
          </div>
        </div>

        {/* 3. Project info table */}
        <section data-reveal className="base-px py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <dl className="md:col-span-1 space-y-6">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs text-neutral-500 uppercase tracking-[0.2em]">
                    {row.label}
                  </dt>
                  <dd className="text-sm mt-1 text-neutral-900">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="md:col-span-2">
              {project.description.map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-[1.9] text-neutral-800 not-first:mt-6"
                >
                  {para}
                </p>
              ))}

              {project.quote ? (
                <blockquote className="mt-12 border-l-2 border-neutral-900 pl-6 py-2">
                  <p className="text-lg leading-relaxed text-neutral-800">
                    {project.quote.text}
                  </p>
                  <footer className="mt-3 text-sm text-neutral-500">
                    — {project.quote.attribution}
                  </footer>
                </blockquote>
              ) : null}
            </div>
          </div>
        </section>

        {/* 4. Gallery */}
        <section data-reveal className="base-px py-12 md:py-16 bg-beige">
          <h2 className="text-2xl font-normal mb-8">ギャラリー</h2>
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {project.gallery.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className={`relative overflow-hidden ${
                  i % 2 === 0 ? "aspect-[4/3]" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={src}
                  alt={`${project.title} — ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Other projects */}
        <section data-reveal className="base-px py-12 md:py-20">
          <h2 className="text-xl font-medium mb-8">他のプロジェクト</h2>
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/monochrome/archive/project/${other.slug}`}
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
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  {other.product}
                </p>
                <p className="mt-1 text-base font-normal">{other.title}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {other.architect}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Product cross-sell */}
        <section data-reveal className="base-px py-16 md:py-20 bg-dark text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            採用製品
          </p>
          <h2 className="text-3xl mt-2">{project.product}</h2>
          <p className="mt-6 max-w-2xl text-base leading-[1.9] text-white/80">
            {productInfo.blurb}
          </p>
          <Link
            href={productInfo.href}
            className="button-base button-outline-on-dark mt-8 inline-flex"
          >
            製品詳細を見る
          </Link>
        </section>

        {/* 7. CTA */}
        <section data-reveal className="base-px py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-normal">
            あなたのプロジェクトに、モノクロームを。
          </h2>
          <Link
            href="/monochrome/contact"
            className="button-base button-fill mt-8 inline-flex"
          >
            お問い合わせはこちら
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
