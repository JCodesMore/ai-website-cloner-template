import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon, ArrowUpRightIcon } from "../components/icons";

export const metadata = { title: "モノクローム電力 | Monochrome" };

type Benefit = {
  title: string;
  body: string;
};

const BENEFITS: Benefit[] = [
  {
    title: "基本料金の最大70%割引",
    body: "地域の大手電力会社より基本料金を最大70%割引。",
  },
  {
    title: "電気料金の固定単価",
    body:
      "電力単価を固定化することで、市場価格の変動に左右されない、安定した電気料金を実現。",
  },
  {
    title: "電気料金の最大2.5%が寄付に",
    body:
      "月々の電気料金の最大2.5%をお客様の指定したソーシャルグッドな活動をする団体に寄付。",
  },
];

type RateRow = {
  item: string;
  monochrome: string;
  tepco: string;
};

const RATE_TABLE_B: RateRow[] = [
  { item: "基本料金 40A", monochrome: "¥428.66 / 月", tepco: "¥1,247.00 / 月" },
  { item: "基本料金 50A", monochrome: "¥659.33 / 月", tepco: "¥1,558.75 / 月" },
  { item: "基本料金 60A", monochrome: "¥890.00 / 月", tepco: "¥1,870.50 / 月" },
  { item: "単価 (≤120kWh)", monochrome: "¥27.99/kWh", tepco: "¥29.80/kWh" },
  { item: "単価 (121-300kWh)", monochrome: "¥27.99/kWh", tepco: "¥36.40/kWh" },
  { item: "単価 (>300kWh)", monochrome: "¥27.99/kWh", tepco: "¥40.49/kWh" },
];

const RATE_TABLE_C: RateRow[] = [
  { item: "基本料金", monochrome: "¥230.67/kVA", tepco: "¥311.75/kVA" },
  { item: "単価 (≤120kWh)", monochrome: "¥27.99/kWh", tepco: "¥29.80/kWh" },
  { item: "単価 (121-300kWh)", monochrome: "¥27.99/kWh", tepco: "¥36.40/kWh" },
  { item: "単価 (>300kWh)", monochrome: "¥27.99/kWh", tepco: "¥40.49/kWh" },
];

const RATE_TABLE_LV: RateRow[] = [
  { item: "基本料金", monochrome: "¥731.97/kW", tepco: "¥1,098.05/kW" },
  { item: "夏季単価", monochrome: "¥26.97/kWh", tepco: "¥27.14/kWh" },
  { item: "その他季節", monochrome: "¥26.97/kWh", tepco: "¥25.57/kWh" },
];

const SOLAR_PACKAGE = [
  { name: "Energy–1" },
  { name: "太陽光パネル" },
  { name: "蓄電池" },
  { name: "スマート分電盤" },
  { name: "エコキュート" },
];

const FAQ = [
  "モノクローム電力の利用条件は？",
  "既存の電力会社からの切替手続きはどう進めますか？",
  "寄付先はどこから選べますか？",
  "解約する場合、違約金はかかりますか？",
  "申込み後、いつから利用開始できますか？",
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

function RateTable({
  caption,
  rows,
}: {
  caption: string;
  rows: RateRow[];
}) {
  return (
    <div className="mt-12 first:mt-0">
      <h3 className="text-lg md:text-xl font-medium mb-4">{caption}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-neutral-300 text-left">
              <th className="py-3 pr-4 font-medium">項目</th>
              <th className="py-3 pr-4 font-medium">モノクローム</th>
              <th className="py-3 pr-4 font-medium">東京電力</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.item} className="border-b border-neutral-200">
                <td className="py-4 pr-4 font-medium">{row.item}</td>
                <td className="py-4 pr-4 text-neutral-700">{row.monochrome}</td>
                <td className="py-4 pr-4 text-neutral-700">{row.tepco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-dark text-white relative h-[70vh] flex items-end base-px pb-12 md:pb-20">
          <div>
            <h1 className="text-4xl md:text-6xl font-normal">
              モノクローム電力
            </h1>
            <p className="mt-3 text-lg md:text-xl text-white/80">
              環境に貢献し、電気代がお得になる電力プラン
            </p>
          </div>
        </section>

        {/* Lead */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-3xl md:text-4xl font-normal max-w-3xl leading-[1.4]">
            太陽光発電ユーザーのために生まれた電力プラン
          </h2>
          <p className="mt-6 text-base md:text-lg leading-[1.8] text-neutral-700 max-w-2xl">
            太陽光発電をお持ちのお客様だけが利用できる特別な電力プランです。発電した電力の環境価値を最大限に活用します。
          </p>
        </section>

        {/* Three benefit cards */}
        <section data-reveal className="base-px py-16 bg-beige">
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <article key={b.title} className="bg-white p-8 flex flex-col">
                <h3 className="text-xl font-medium leading-[1.5]">{b.title}</h3>
                <p className="mt-4 text-sm leading-[1.8] text-neutral-700">
                  {b.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Rate plans comparison */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-3xl md:text-4xl font-normal">どれくらいお得？</h2>
          <p className="mt-2 text-lg text-neutral-600">東京電力との料金比較</p>

          <RateTable caption="従量電灯B (40A〜60A)" rows={RATE_TABLE_B} />
          <RateTable caption="従量電灯C" rows={RATE_TABLE_C} />
          <RateTable caption="動力・低圧" rows={RATE_TABLE_LV} />
        </section>

        {/* Savings simulation */}
        <section data-reveal className="base-px py-16 bg-beige">
          <h3 className="text-xl md:text-2xl font-medium leading-[1.5]">
            想定: 4人家族、オール電化、太陽光8kW + 蓄電池13.5kWh
          </h3>
          <dl className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6">
              <dt className="text-sm text-neutral-500">モノクローム月額</dt>
              <dd className="mt-2 text-2xl font-medium">¥14,496</dd>
            </div>
            <div className="bg-white p-6">
              <dt className="text-sm text-neutral-500">東京電力月額</dt>
              <dd className="mt-2 text-2xl font-medium">¥15,974</dd>
            </div>
            <div className="bg-white p-6">
              <dt className="text-sm text-neutral-500">月間節約</dt>
              <dd className="mt-2 text-2xl font-medium">¥1,478（9.3%）</dd>
            </div>
          </dl>
        </section>

        {/* Why cheaper */}
        <section data-reveal className="base-px py-20">
          <h2 className="text-3xl md:text-4xl font-normal max-w-3xl leading-[1.4]">
            なぜ安くなるのか？
          </h2>
          <p className="mt-6 text-base md:text-lg leading-[1.8] text-neutral-700 max-w-3xl">
            モノクローム電力は、太陽光発電ユーザーが発電した電力の環境価値を電力会社が買い取り、その対価を電気料金から差し引く仕組みです。Jクレジット制度を活用することで、再生可能エネルギーの環境価値を経済価値に変換します。
          </p>
        </section>

        {/* Solar Standard Package + 関連設備 */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] max-w-3xl">
            モノクロームなら、お得な電力プランと合わせて、関連設備もまとめてご提案します。
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

        {/* Contact section */}
        <section data-reveal className="base-px py-20 md:py-30 bg-dark text-white">
          <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] mb-10">
            モノクローム電力に関するお問い合わせ
          </h2>
          <div className="border border-white/20 p-8 md:p-10 flex flex-col max-w-2xl">
            <h3 className="text-xl font-normal">お問い合わせ</h3>
            <p className="mt-4 text-sm leading-[1.8] text-white/70">
              モノクローム電力の利用をご検討の方はこちらからお問い合わせください。
            </p>
            <Link
              href="/monochrome/contact"
              className="button-base button-fill mt-6 self-start"
            >
              相談する
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/50">
            <Link
              href="/monochrome/tokusho"
              className="underline hover:text-white"
            >
              特定商取引法に基づく表記
            </Link>
          </p>
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
