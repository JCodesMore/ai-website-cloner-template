"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon, ArrowUpRightIcon } from "../components/icons";

type FeatureTab = {
  label: string;
  body: string;
  note?: string;
};

const FEATURE_TABS: FeatureTab[] = [
  {
    label: "エネルギーの可視化",
    body:
      "スマート分電盤が、回路ごとの電力状況をEnergy–1にデータ連携。部屋や家電ごとの電力状況が見える化され、何に電力が使われているか特定でき、節電アクションを行うことができます。",
  },
  {
    label: "AIによる自動制御",
    body:
      "エコキュートとEnergy–1が連携し、余剰電力を利用してお湯の沸き上げをします。また、ライフスタイルに合わせて無駄な焚きましをカットし電気代を節約します。例えば夜に家族全員がお風呂に入る場合、夜間焚きましを自動でオフします。",
    note: "※開発中",
  },
  {
    label: "災害時も安心の機能",
    body:
      "災害時の自動蓄電池・エコキュートコントロール機能。台風や豪雨などで停電になる確率を計算し、停電前に蓄電池にフル充電したり、エコキュートにお湯を溜めておくことで、もしものときのエネルギーを確保し、家族を守ります。",
    note: "※開発中",
  },
];

type Testimonial = {
  profile: string;
  quote: string;
  body: string;
  avatar: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    profile: "40代 会社役員",
    quote: "見える化で暮らしが劇的に変わる！",
    body:
      "電気が見えると本当に使い方が変わります。必要なところだけ使うように意識したり、昼の電気が余っていれば売電ではなくポータブルバッテリーに充電したり。",
    avatar: "/clones/monochrome/images/energy/voice-01.png",
  },
  {
    profile: "30代 営業",
    quote: "電力を無駄なく使用できます。",
    body:
      "電力使用状況の分析結果を提供し、ライフスタイルに合わせた電気を利用するタイミングを提案します。",
    avatar: "/clones/monochrome/images/energy/voice-02.png",
  },
  {
    profile: "20代 デザイナー",
    quote: "電気代が5,000円安くなりました。",
    body:
      "お風呂に入ったあとは朝までたくさんのお湯はいらないので、おひさまエコキュートの夜間の沸き増し制限をしています。実際、電気代は5000円も安くなりました。",
    avatar: "/clones/monochrome/images/energy/voice-03.png",
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
  "Energy–1の機能はどこまで実装済みですか？",
  "Androidのスマートフォンでも確認できますか？",
  "対象製品の一覧を教えて下さい。コストについても教えてください。",
  "設置場所に制限はありますか？",
  "複数の分電盤でも設置可能ですか？",
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
  const [activeTab, setActiveTab] = useState<number>(0);
  const tab = FEATURE_TABS[activeTab]!;

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-dark text-white relative h-[70vh] flex items-end base-px pb-12 md:pb-20">
          <div>
            <h1 className="text-4xl md:text-6xl font-normal">Energy–1</h1>
            <p className="mt-3 text-lg md:text-xl text-white/80">
              電力コストを下げ、災害時に家族を守るHEMS
            </p>
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <Link
                href="/monochrome/contact"
                className="button-base button-fill"
              >
                相談する
              </Link>
              <Link
                href="/monochrome/download"
                className="button-base button-outline-on-dark"
              >
                資料ダウンロード
              </Link>
            </div>
          </div>
        </section>

        {/* Lead */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-3xl md:text-4xl font-normal max-w-3xl leading-[1.4]">
            電力コストを自動的に削減。災害時には家族を守るHEMS。
          </h2>
          <p className="mt-6 text-base md:text-lg leading-[1.8] text-neutral-700 max-w-2xl">
            Energy–1をコンセントに挿すだけで、アプリで発電量や消費量を見える化し、電力状況をリアルタイムで把握。さらにAIが各種設備を自動制御し、電気代を節約します。
          </p>
        </section>

        {/* Energy efficiency */}
        <section data-reveal className="base-px py-16 md:py-20 bg-beige">
          <h2 className="text-3xl md:text-4xl font-normal max-w-3xl leading-[1.4]">
            エネルギーの無駄をなくし効率的に節電をサポート
          </h2>
          <p className="mt-6 text-base md:text-lg leading-[1.8] text-neutral-700 max-w-3xl">
            これまでの太陽光発電は、余剰電力を売電することが主流でした。しかし売電単価が下落する中、自家消費が経済合理的になりつつあります。Energy–1は、各家庭の電力使用状況をリアルタイムで把握し、AIが最適な使用タイミングを提案します。
          </p>
        </section>

        {/* Savings calculator */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-3xl md:text-4xl font-normal max-w-3xl leading-[1.4]">
            太陽光パネルとEnergy–1を併用で、約86%の電気代削減
          </h2>
          <p className="mt-6 text-sm text-neutral-500">
            想定: 消費電力 500kWh / 発電量 350kWh（3人家族の場合）
          </p>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-base border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 text-left">
                  <th className="py-3 pr-4 font-medium">構成</th>
                  <th className="py-3 pr-4 font-medium">月額電気代</th>
                  <th className="py-3 pr-4 font-medium">削減率</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200">
                  <td className="py-4 pr-4">太陽光なし</td>
                  <td className="py-4 pr-4 text-neutral-700">¥19,784</td>
                  <td className="py-4 pr-4 text-neutral-700">—</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="py-4 pr-4">
                    太陽光 + 蓄電池 + エコキュート
                  </td>
                  <td className="py-4 pr-4 text-neutral-700">¥4,926</td>
                  <td className="py-4 pr-4 text-neutral-700">75%削減</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="py-4 pr-4">
                    太陽光 + パッケージ + Energy–1
                  </td>
                  <td className="py-4 pr-4 text-neutral-700">¥2,751</td>
                  <td className="py-4 pr-4 text-neutral-700">86%削減</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-neutral-500 mt-4 leading-[1.6]">
            ※環境省実証事業（横浜市）に基づく可視化による平均10%の節電効果を含みます。
            <br />
            ※当社想定に基づく試算です。実際の金額は家族構成、ライフスタイル、電気料金、天候、蓄電池設定、機器の経年劣化等により変動します。
          </p>
        </section>

        {/* App features tabs */}
        <section data-reveal className="base-px py-20 md:py-30 bg-dark text-white">
          <h2 className="text-3xl font-normal mb-12">節電がたのしくなるアプリ</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {FEATURE_TABS.map((t, idx) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={cn(
                  "pb-3 border-b-2 transition-colors text-sm md:text-base",
                  activeTab === idx
                    ? "border-white"
                    : "border-transparent text-white/50 hover:text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <div className="aspect-[9/16] max-w-xs bg-gradient-to-br from-neutral-700 to-black rounded-[2rem]" />
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-normal leading-[1.4]">
                {tab.label}
              </h3>
              <p className="mt-6 text-base leading-[1.8] text-white/80">
                {tab.body}
              </p>
              {tab.note ? (
                <p className="mt-4 text-xs text-white/50">{tab.note}</p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section data-reveal className="base-px py-20 md:py-30">
          <h2 className="text-3xl md:text-4xl font-normal mb-12">利用者の声</h2>
          <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {TESTIMONIALS.map((t) => (
              <article key={t.profile} className="bg-beige p-8 flex flex-col">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
                  <Image
                    src={t.avatar}
                    alt={`${t.profile}のプロフィール写真`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <p className="text-lg font-medium leading-[1.5]">
                  {t.quote}
                </p>
                <p className="mt-3 text-sm leading-[1.8] text-neutral-700 flex-1">
                  {t.body}
                </p>
                <p className="text-xs text-neutral-500 mt-4">{t.profile}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Solar Standard Package */}
        <section data-reveal className="base-px py-20">
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

        {/* モノクローム電力 cross-sell */}
        <section data-reveal className="bg-beige base-px py-20">
          <h2 className="text-3xl md:text-4xl font-normal">モノクローム電力</h2>
          <p className="text-2xl mt-2">
            環境に貢献し、電気代がお得になる電力プラン
          </p>
          <p className="mt-6 text-base leading-[1.8] text-neutral-700 max-w-2xl">
            Energy–1を導入しているお客様に、もっともお得な電力プラン。発電したクリーンエネルギーをクレジットに変換し、電気料金に還元。
          </p>
          <Link
            href="/monochrome/power"
            className="button-base button-outline mt-8"
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

        {/* Contact + Resources */}
        <section data-reveal className="base-px py-20 md:py-30 bg-dark text-white">
          <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] mb-10">
            Energy–1に関するお問い合わせ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="border border-white/20 p-8 md:p-10 flex flex-col">
              <h3 className="text-xl font-normal">お問い合わせ</h3>
              <p className="mt-4 text-sm leading-[1.8] text-white/70 flex-1">
                Energy–1の利用をご検討の方はこちらからお問い合わせください。
              </p>
              <Link
                href="/monochrome/contact"
                className="button-base button-fill mt-6 self-start"
              >
                相談する
              </Link>
            </div>
            <div className="border border-white/20 p-8 md:p-10 flex flex-col">
              <h3 className="text-xl font-normal">製品資料</h3>
              <p className="mt-4 text-sm leading-[1.8] text-white/70 flex-1">
                Energy–1の製品資料をご覧になりたい方は製品資料一覧よりご確認ください。
              </p>
              <Link
                href="/monochrome/download"
                className="button-base button-outline-on-dark mt-6 self-start"
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
