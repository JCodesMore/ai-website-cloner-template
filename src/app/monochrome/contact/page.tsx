import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon } from "../components/icons";
import { cn } from "@/lib/utils";

export const metadata = { title: "お問い合わせ | Monochrome" };

type ProductCard = {
  name: string;
  tagline: string;
  href: string;
};

const PRODUCTS: ProductCard[] = [
  {
    name: "Roof–1",
    tagline: "エネルギーをつくる屋根",
    href: "/monochrome/contact/roof",
  },
  {
    name: "Wall–1",
    tagline: "エネルギーをつくる壁",
    href: "/monochrome/contact/wall",
  },
  {
    name: "Panel–B",
    tagline: "最もミニマルな太陽光パネル",
    href: "/monochrome/contact/panel",
  },
  {
    name: "Energy–1",
    tagline: "電力コストを下げるHEMS",
    href: "/monochrome/contact/energy",
  },
  {
    name: "モノクローム電力",
    tagline: "お得な電力プラン",
    href: "/monochrome/contact/power",
  },
];

type NewsItem = {
  date: string;
  badge: string;
  title: string;
  href: string;
};

const NEWS: NewsItem[] = [
  {
    date: "2026.4.27",
    badge: "プレスリリース",
    title:
      "モノクローム、HEMS「Energy–1」がみらいエコ住宅2026事業（GX志向型住宅）に対応",
    href: "/monochrome/press/202604-aif",
  },
  {
    date: "2026.4.22",
    badge: "プレスリリース",
    title: "モノクローム、シリーズB資金調達を実施",
    href: "/monochrome/press/202604-funding-b",
  },
  {
    date: "2026.4.14",
    badge: "採用情報",
    title: "採用情報",
    href: "/monochrome/press/recruit",
  },
];

function NewsReleases() {
  return (
    <section data-reveal className="bg-dark text-white py-16 md:py-20 base-px">
      <h3 className="mb-2 text-base font-normal">ニュースリリース</h3>
      <div data-reveal-stagger>
      {NEWS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group grid items-baseline gap-3 border-t border-white/10 py-4 md:gap-6",
            "grid-cols-[80px_1fr_24px] md:grid-cols-[100px_140px_1fr_24px]",
          )}
        >
          <span className="text-sm text-white/60">{item.date}</span>
          <span className="hidden w-fit items-center rounded-full border border-white/40 px-3 py-0.5 text-xs md:inline-flex">
            {item.badge}
          </span>
          <span className="text-sm leading-[1.6]">{item.title}</span>
          <span className="justify-self-end text-white/60 transition-colors group-hover:text-white">
            <ArrowRightIcon />
          </span>
        </Link>
      ))}
      </div>
      <div className="border-t border-white/10" aria-hidden />
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section data-reveal className="base-px py-20 md:py-28">
          <h1 className="text-3xl md:text-4xl font-normal">お問い合わせ</h1>
          <p className="text-base text-neutral-600 mt-3 max-w-2xl leading-relaxed">
            お問い合わせ頂く製品をお選びください。
          </p>
        </section>

        {/* Product picker grid */}
        <section data-reveal className="base-px pb-16">
          <div data-reveal-stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {PRODUCTS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="aspect-square border border-neutral-200 hover:border-black transition-colors flex flex-col items-center justify-center gap-3 text-center p-6"
              >
                <span className="text-lg font-medium text-neutral-900">
                  {p.name}
                </span>
                <span className="text-sm text-neutral-600 leading-relaxed">
                  {p.tagline}
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-sm text-neutral-600">
            工務店パートナー登録ご希望の方は
            <Link
              href="/monochrome/mc-builder"
              className="underline underline-offset-2 hover:text-neutral-900"
            >
              こちら
            </Link>
            、施工パートナー登録は
            <Link
              href="/monochrome/installer-partner-application"
              className="underline underline-offset-2 hover:text-neutral-900"
            >
              こちら
            </Link>
            より承ります。
          </p>
        </section>

        {/* Materials request */}
        <section data-reveal className="bg-beige base-px py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl md:text-3xl font-normal">資料請求</h2>
              <p className="text-base leading-relaxed text-neutral-800">
                製品資料をご覧になりたい方は、製品資料一覧よりご確認ください。
              </p>
              <Link
                href="/monochrome/download"
                className="button-base button-outline w-fit"
              >
                資料ダウンロード
              </Link>
            </div>
            <div
              className="aspect-[4/3] bg-neutral-200 rounded-lg"
              aria-hidden
            />
          </div>
        </section>

        <NewsReleases />
      </main>
      <SiteFooter />
    </>
  );
}
