import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon, ArrowUpRightIcon } from "../components/icons";

export const metadata = { title: "Panel–B | Monochrome" };

type ProductColor = { label: string; hex: string; border?: boolean };

const COLORS: ProductColor[] = [{ label: "Black", hex: "#141419" }];

type Feature = {
  number: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

const FEATURES: Feature[] = [
  {
    number: "01",
    title: "早く、簡単に、安く設置が可能",
    body:
      "勾配が少ない（1寸以下）屋根や、Roof–1では設置ができない屋根形状にも対応が可能。",
    image: "/clones/monochrome/images/kv/kv_02.jpg",
    imageAlt: "Panel–B 設置イメージ",
  },
  {
    number: "02",
    title: "業界最高水準の発電効率23.3%",
    body:
      "セル表面の配線を無くし、均一な黒色を実現したHPBC技術を採用。太陽光の取り込みを最大化し、曇りの日でも高い発電量を維持します。",
    image: "/clones/monochrome/images/kv/kv_06.jpg",
    imageAlt: "Panel–B 発電効率",
  },
  {
    number: "03",
    title: "30年間の無償保証",
    body:
      "業界最高水準の発電効率を誇り、生活に必要なエネルギーを効率的に創出します。30年間の出力保証。さらに、発電状況は常に遠隔監視され、不具合を検知した際には、専門チームが迅速にサポートします。",
    image: "/clones/monochrome/images/kv/kv_15.jpg",
    imageAlt: "Panel–B 30年保証",
  },
];

const SOLAR_PACKAGE = [
  { name: "Energy–1" },
  { name: "太陽光パネル" },
  { name: "蓄電池" },
  { name: "スマート分電盤" },
  { name: "エコキュート" },
];

const FAQ = [
  "なぜ自家消費率を高めることが重要なのでしょうか？",
  "自家消費率を高めるためにはどうしたらよいでしょうか？",
  "太陽光パネルの設置条件はありますか？",
  "太陽光パネルや蓄電池等の費用はいくらぐらいでしょうか？",
  "太陽光パネルや架台の保証はありますでしょうか？",
];

const RELATED = [
  {
    name: "Roof–1",
    tagline: "エネルギーをつくる屋根",
    href: "/monochrome/roof",
    image: "/clones/monochrome/images/products/roof_1.jpg",
  },
  {
    name: "Wall–1",
    tagline: "エネルギーをつくる壁",
    href: "/monochrome/wall",
    image: "/clones/monochrome/images/products/wall_1.jpg",
  },
  {
    name: "Energy–1",
    tagline: "電力コストを下げ、災害時に家族を守るHEMS",
    href: "/monochrome/energy",
    image: "/clones/monochrome/images/products/energy_1.jpg",
  },
  {
    name: "モノクローム電力",
    tagline: "環境に貢献し、電気代がお得になる電力プラン",
    href: "/monochrome/power",
    image: "/clones/monochrome/images/products/energy_2.jpg",
  },
];

type NewsItem = {
  date: string;
  badge: string;
  title: string;
  href: string;
  source?: string;
  external?: boolean;
};

const NEWS: NewsItem[] = [
  {
    date: "2026.4.27",
    badge: "プレスリリース",
    title:
      "モノクローム、HEMS「Energy-1」がみらいエコ住宅2026事業（GX志向型住宅）に対応。工事不要で補助金要件を一体で満たせる提案を強化-AIF認証を取得。発電から制御まで一体提案を強化",
    href: "/monochrome/press/202604-aif",
  },
  {
    date: "2026.4.22",
    badge: "プレスリリース",
    title:
      "モノクローム、シリーズB資金調達を実施-建材一体型太陽光パネル開発スタートアップ。プロダクトから体験へ。一棟からまちへ。",
    href: "/monochrome/press/202604-funding-b",
  },
  {
    date: "2026.4.14",
    badge: "採用情報",
    title: "採用情報",
    href: "/monochrome/press/recruit",
  },
];

const FEATURED: NewsItem[] = [
  {
    date: "2025.8.25",
    badge: "掲載情報",
    title:
      "Forbes JAPANクロストレプレナーアワード、フューチャーライフライン賞に、モノクロームの屋根一体型太陽光パネルRoof-1が搭載の「インフラゼロハウス」が受賞しました",
    source: "Forbes JAPAN",
    href: "https://forbesjapan.com",
    external: true,
  },
  {
    date: "2025.3.26",
    badge: "掲載情報",
    title:
      "脱炭素に取り組む「株式会社モノクローム」の若手活躍を導く組織づくりに迫る！",
    source: "ミライのお仕事",
    href: "https://mirai-no-oshigoto.example",
    external: true,
  },
  {
    date: "2024.6.14",
    badge: "掲載情報",
    title:
      "泊まれる展望台。那須の絶景オフグリッドグランピングサイト-Miwatas Nasu-",
    source: "モノクロームの読み物 / noteブログ",
    href: "https://note.com/monochrome",
    external: true,
  },
];

function NewsRow({ item }: { item: NewsItem }) {
  const external = Boolean(item.external);
  const Arrow = external ? ArrowUpRightIcon : ArrowRightIcon;

  return (
    <a
      href={item.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "group grid items-baseline gap-3 border-t border-neutral-200 py-4 md:gap-6",
        "grid-cols-[80px_1fr_24px] md:grid-cols-[100px_140px_1fr_24px]",
      )}
    >
      <span className="text-sm text-neutral-500">{item.date}</span>
      <span className="hidden w-fit items-center rounded-full border border-neutral-300 px-3 py-0.5 text-xs md:inline-flex">
        {item.badge}
      </span>
      <span className="text-sm leading-[1.6]">
        {item.title}
        {item.source ? (
          <span className="mt-1 block text-xs text-neutral-500">
            {item.source}
          </span>
        ) : null}
      </span>
      <span className="justify-self-end text-neutral-500 transition-colors group-hover:text-black">
        <Arrow />
      </span>
    </a>
  );
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section
          aria-label="Panel–B hero"
          className="relative w-full h-[80vh] overflow-hidden"
        >
          <Image
            src="/clones/monochrome/images/kv/kv_04.jpg"
            alt="Panel–B 太陽光パネル"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end base-px pb-12 md:pb-16 text-white">
            <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-normal">
              Panel–B
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/80">
              最もミニマルな太陽光パネル
            </p>
          </div>
        </section>

        {/* Tagline + chips bar */}
        <div className="base-px py-6 md:py-8 border-b border-neutral-200 sticky top-0 bg-white z-30 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm font-medium">Panel–B</span>
            <ul className="flex items-center gap-3">
              {COLORS.map((color) => (
                <li
                  key={color.label}
                  className="inline-flex items-center gap-1.5 text-xs"
                >
                  <span
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full inline-block shrink-0"
                    style={{
                      background: color.hex,
                      border: color.border ? "1px solid #d9d9d4" : "none",
                    }}
                  />
                  <span>{color.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Lead section */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal max-w-3xl leading-[1.4]">
            オールブラックの太陽光パネル
          </h2>
          <p className="mt-6 text-base md:text-lg leading-[1.8] text-neutral-700 max-w-2xl">
            フレームから表面までオールブラック。建物の外観を損なわない太陽光パネルです。
          </p>
        </section>

        {/* Features */}
        <section data-reveal className="base-px py-20 md:py-30 bg-beige">
          <h2 className="text-3xl font-normal mb-16">Panel–Bの特徴</h2>
          <div>
            {FEATURES.map((feature, idx) => (
              <article
                key={feature.number}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center mt-20 first:mt-0"
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] bg-neutral-100 overflow-hidden",
                    idx % 2 === 1 && "md:order-2",
                  )}
                >
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className={cn(idx % 2 === 1 && "md:order-1")}>
                  <p className="text-sm text-neutral-500">{feature.number}</p>
                  <h3 className="mt-2 text-2xl md:text-3xl font-normal leading-[1.4]">
                    {feature.title}
                  </h3>
                  <p className="mt-6 text-base leading-[1.8] text-neutral-700">
                    {feature.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Solar Standard Package */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4]">
            発電を効率的に自家消費するパッケージを提供
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Solar Standard Package
          </p>
          <ul data-reveal-stagger className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {SOLAR_PACKAGE.map((item) => (
              <li key={item.name}>
                <div
                  aria-label={`${item.name} 製品イメージ`}
                  className="aspect-[4/5] bg-neutral-100"
                />
                <p className="mt-3 text-sm">{item.name}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Power cross-sell */}
        <section data-reveal className="base-px py-16 bg-dark text-white">
          <p className="text-sm text-white/60">モノクローム電力</p>
          <h2 className="text-3xl font-normal mt-2 max-w-2xl leading-[1.4]">
            さらに電気代を下げたい方に。
          </h2>
          <p className="mt-6 text-base leading-[1.8] text-white/80 max-w-2xl">
            太陽光発電導入者のための特別な電気プラン。電気基本料金を最大30%割引。Jクレジットの仕組みにより、発電した電力の環境価値を最大限に活用します。
          </p>
          <Link
            href="/monochrome/power"
            className="button-base button-outline-on-dark mt-8"
          >
            詳しく見る
          </Link>
        </section>

        {/* FAQ teaser */}
        <section data-reveal className="base-px py-20">
          <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] mb-10">
            よくあるご質問
          </h2>
          <ul className="border-t border-neutral-200">
            {FAQ.map((q) => (
              <li key={q} className="border-b border-neutral-200">
                <details className="group">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer py-5 text-base list-none">
                    <span>{q}</span>
                    <span className="text-neutral-400 transition-transform group-open:rotate-45 text-xl leading-none">
                      +
                    </span>
                  </summary>
                </details>
              </li>
            ))}
          </ul>
          <Link
            href="/monochrome/faq"
            className="button-base button-outline mt-8"
          >
            すべての質問を見る
          </Link>
        </section>

        {/* Contact + Resources CTA */}
        <section data-reveal className="base-px py-20 md:py-30 bg-beige">
          <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] mb-10">
            Panel–Bに関するお問い合わせ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white p-8 md:p-10 flex flex-col">
              <h3 className="text-xl font-normal">お問い合わせ</h3>
              <p className="mt-4 text-sm leading-[1.8] text-neutral-700 flex-1">
                Panel–Bの購入をご検討の方はこちらからお問い合わせください。
              </p>
              <Link
                href="/monochrome/contact"
                className="button-base button-fill mt-6 self-start"
              >
                相談する
              </Link>
            </div>
            <div className="bg-white p-8 md:p-10 flex flex-col">
              <h3 className="text-xl font-normal">製品資料</h3>
              <p className="mt-4 text-sm leading-[1.8] text-neutral-700 flex-1">
                Panel–Bの製品資料をご覧になりたい方は製品資料一覧よりご確認ください。
              </p>
              <Link
                href="/monochrome/download"
                className="button-base button-outline mt-6 self-start"
              >
                資料一覧
              </Link>
            </div>
          </div>
        </section>

        {/* Related products */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] mb-10">
            他の製品を見る
          </h2>
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {RELATED.map((p) => (
              <article key={p.name} className="flex flex-col">
                <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={`${p.name} 製品イメージ`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <h3 className="mt-4 text-xl font-normal">{p.name}</h3>
                <p className="mt-1 text-sm text-neutral-600">{p.tagline}</p>
                <Link
                  href={p.href}
                  className="button-base button-outline mt-4 self-start"
                >
                  詳しく見る
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* News + Press */}
        <section data-reveal className="base-px py-20 md:py-30 border-t border-neutral-200">
          <section className="mb-12 md:mb-16">
            <h3 className="mb-2 text-base font-normal">ニュースリリース</h3>
            <div data-reveal-stagger>
              {NEWS.map((item) => (
                <NewsRow key={item.href} item={item} />
              ))}
            </div>
            <div className="border-t border-neutral-200" aria-hidden />
          </section>
          <section>
            <h3 className="mb-2 text-base font-normal">掲載情報</h3>
            <div data-reveal-stagger>
              {FEATURED.map((item) => (
                <NewsRow key={item.href} item={item} />
              ))}
            </div>
            <div className="border-t border-neutral-200" aria-hidden />
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
