import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon, ArrowUpRightIcon } from "../components/icons";

export const metadata = { title: "Wall–1 | Monochrome" };

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
    title: "壁面で発電量を増やす",
    body:
      "屋根面積が限られた高層建築や小さな住宅でも、壁面に設置することで発電量を増やせます。地上から31mの高さまで設置可能です。",
    image: "/clones/monochrome/images/kv/kv_05.jpg",
    imageAlt: "Wall–1 壁面発電",
  },
  {
    number: "02",
    title: "豪雪地域でも確実に発電",
    body:
      "壁設置のため、降雪による発電量低下の心配がありません。",
    image: "/clones/monochrome/images/kv/kv_08.jpg",
    imageAlt: "Wall–1 豪雪地域での発電",
  },
  {
    number: "03",
    title: "マット仕上げで反射を抑える",
    body:
      "特殊なガラス加工により光の反射を抑制。一般的な架台式太陽光パネルの約1/40の光沢度で、街並みに馴染む控えめな外観を実現しました。",
    image: "/clones/monochrome/images/kv/kv_10.jpg",
    imageAlt: "Wall–1 マット仕上げ",
  },
  {
    number: "04",
    title: "99%リサイクル",
    body:
      "独自の技術で素材単位までに分別できるマテリアルリサイクル。専門のリサイクル工場との提携で、環境にやさしいものづくりを実現します。",
    image: "/clones/monochrome/images/kv/kv_12.jpg",
    imageAlt: "Wall–1 リサイクル",
  },
  {
    number: "05",
    title: "リフォームに対応",
    body:
      "Wall–1はカバー工法に対応。既存の外壁を剥がさず、その上から重ねて施工できます。",
    image: "/clones/monochrome/images/kv/kv_14.jpg",
    imageAlt: "Wall–1 リフォーム対応",
  },
];

type WarrantyRow = {
  model: string;
  product: string;
  power: string;
  height: string;
};

const WARRANTY_ROWS: WarrantyRow[] = [
  {
    model: "太陽光発電モジュール（500m+ 沿岸）",
    product: "製品20年",
    power: "出力25年（97%/1年, 90%/10年, 80%/25年）",
    height: "設置高31mまで",
  },
  {
    model: "金属外装材",
    product: "塗膜15年",
    power: "穴あき25年",
    height: "設置高31mまで",
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
  "リフォームでも設置可能ですか？",
  "壁面でも十分な発電量を確保できますか？",
  "太陽光パネルを載せない部分の壁は、別途手配が必要ですか？",
  "設置場所に制限はありますか？",
  "反射光は問題になりませんか？",
];

const RELATED = [
  {
    name: "Roof–1",
    tagline: "エネルギーをつくる屋根",
    href: "/monochrome/roof",
    image: "/clones/monochrome/images/products/roof_1.jpg",
  },
  {
    name: "Panel–B",
    tagline: "最もミニマルな太陽光パネル",
    href: "/monochrome/panel",
    image: "/clones/monochrome/images/products/panel_1.jpg",
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
          aria-label="Wall–1 hero"
          className="relative w-full h-[80vh] overflow-hidden"
        >
          <Image
            src="/clones/monochrome/images/kv/kv_05.jpg"
            alt="Wall–1 壁一体型太陽光パネル"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end base-px pb-12 md:pb-16 text-white">
            <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-normal">
              Wall–1
            </h1>
            <p className="mt-3 text-base md:text-lg text-white/80">
              エネルギーをつくる壁
            </p>
          </div>
        </section>

        {/* Tagline + chips bar */}
        <div className="base-px py-6 md:py-8 border-b border-neutral-200 sticky top-0 bg-white z-30 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm font-medium">Wall–1</span>
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
            すべて一体化。壁として機能する太陽光パネル
          </h2>
          <p className="mt-6 text-base md:text-lg leading-[1.8] text-neutral-700 max-w-2xl">
            外壁材と太陽光セルが一体化。壁として設置ができるから、たった1回の施工で完了。
          </p>
        </section>

        {/* Features */}
        <section data-reveal className="base-px py-20 md:py-30 bg-beige">
          <h2 className="text-3xl font-normal mb-16">Wall–1の特徴</h2>
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

        {/* Warranty detail */}
        <section data-reveal className="base-px py-16 md:py-20">
          <h3 className="text-2xl md:text-3xl font-normal mb-4">
            豪雪地帯・沿岸地域でも安心の25年間出力保証
          </h3>
          <p className="text-base leading-[1.8] text-neutral-700 max-w-2xl mb-8">
            Wall–1モジュールは25年間無償出力保証です。風雨だけでなく、ゲリラ雷雨などで発生する雹、鳥獣、海岸地域の場合は塩水など、様々な衝撃や侵食への耐久性を担保するため、独自の耐久テストをおこなっています。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 text-left">
                  <th className="py-3 pr-4 font-medium">モデル</th>
                  <th className="py-3 pr-4 font-medium">製品保証</th>
                  <th className="py-3 pr-4 font-medium">出力保証</th>
                  <th className="py-3 pr-4 font-medium">設置高</th>
                </tr>
              </thead>
              <tbody>
                {WARRANTY_ROWS.map((row) => (
                  <tr key={row.model} className="border-b border-neutral-200">
                    <td className="py-4 pr-4 font-medium">{row.model}</td>
                    <td className="py-4 pr-4 text-neutral-700">
                      {row.product}
                    </td>
                    <td className="py-4 pr-4 text-neutral-700">{row.power}</td>
                    <td className="py-4 pr-4 text-neutral-700">{row.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-500 mt-4">
            ※自然災害・事故に起因する不具合は保証対象外となります。詳細は保証約款をご確認ください。
          </p>
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
            Wall–1に関するお問い合わせ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white p-8 md:p-10 flex flex-col">
              <h3 className="text-xl font-normal">お問い合わせ</h3>
              <p className="mt-4 text-sm leading-[1.8] text-neutral-700 flex-1">
                Wall–1の購入をご検討の方はこちらからお問い合わせください。
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
                Wall–1の製品資料をご覧になりたい方は製品資料一覧よりご確認ください。
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
