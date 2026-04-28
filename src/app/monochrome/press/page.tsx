"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon, ArrowUpRightIcon } from "../components/icons";

type NewsItem = {
  date: string;
  category: string;
  title: string;
  href: string;
  source?: string;
  external: boolean;
};

const NEWS: NewsItem[] = [
  {
    date: "2026.4.27",
    category: "プレスリリース",
    title:
      "モノクローム、HEMS「Energy–1」がみらいエコ住宅2026事業（GX志向型住宅）に対応。工事不要で補助金要件を一体で満たせる提案を強化-AIF認証を取得。",
    href: "/monochrome/press/202604-aif",
    external: false,
  },
  {
    date: "2026.4.22",
    category: "プレスリリース",
    title:
      "モノクローム、シリーズB資金調達を実施-建材一体型太陽光パネル開発スタートアップ。プロダクトから体験へ。一棟からまちへ。",
    href: "/monochrome/press/202604-funding-b",
    external: false,
  },
  {
    date: "2026.2.12",
    category: "プレスリリース",
    title:
      "モノクローム、外壁材一体型太陽光パネル「Wall–1」を発売― 壁を発電面に変える新提案 ―",
    href: "/monochrome/press/wall-1-launch-202602",
    external: false,
  },
  {
    date: "2026.1.20",
    category: "プレスリリース",
    title:
      "モノクロームの屋根一体型太陽光パネル「Roof–1」、住宅ブランド「BESS」の特別モデルにオプション採用",
    href: "/monochrome/press/bess-rcc-adoption-202601",
    external: false,
  },
  {
    date: "2025.12.23",
    category: "プレスリリース",
    title:
      "白馬村 × ゴールドウイン × モノクローム「公共施設の屋根を\"村の発電所\"に」──再エネ循環モデルの実現を目指す。",
    href: "/monochrome/press/hakuba-village-renewable-202512",
    external: false,
  },
  {
    date: "2025.9.4",
    category: "プレスリリース",
    title: "新色追加。エネルギーをつくる屋根「Roof–1」、シルバー色の販売を開始",
    href: "/monochrome/press/roof-1-silver-launch-2509",
    external: false,
  },
  {
    date: "2025.3.6",
    category: "プレスリリース",
    title: "モノクローム、初期費用０円リースプランの提供を開始",
    href: "/monochrome/press/lease-zero-2503",
    external: false,
  },
  {
    date: "2024.10.15",
    category: "プレスリリース",
    title: "Roof-1認定施工店制度開始、協力会社を募集します。",
    href: "/monochrome/press/certified-installer-program-2410",
    external: false,
  },
  {
    date: "2024.9.21",
    category: "プレスリリース",
    title:
      "モノクローム建設が横須賀市、「公共施設への再生可能エネルギー等導入事業」事業者に決定。",
    href: "/monochrome/press/yokosuka-city-renewable-2409",
    external: false,
  },
  {
    date: "2024.6.25",
    category: "プレスリリース",
    title:
      "屋根一体型太陽光パネルRoof–1、国際的なデザイン賞「レッドドット・デザイン賞2024」を受賞",
    href: "/monochrome/press/red-dot-design-award-2406",
    external: false,
  },
  {
    date: "2026.4.14",
    category: "採用情報",
    title: "採用情報",
    href: "/monochrome/press/recruit",
    external: false,
  },
  {
    date: "2025.8.25",
    category: "掲載情報",
    title:
      "Forbes JAPANクロストレプレナーアワード、フューチャーライフライン賞に、モノクロームの屋根一体型太陽光パネルRoof–1が搭載の「インフラゼロハウス」が受賞しました",
    source: "Forbes JAPAN",
    href: "https://forbesjapan.com/articles/detail/81489",
    external: true,
  },
  {
    date: "2025.3.26",
    category: "掲載情報",
    title:
      "脱炭素に取り組む「株式会社モノクローム」の若手活躍を導く組織づくりに迫る！",
    source: "ミライのお仕事",
    href: "https://morejob.co.jp/mirai/monochrome/",
    external: true,
  },
  {
    date: "2024.6.14",
    category: "掲載情報",
    title:
      "泊まれる展望台。那須の絶景オフグリッドグランピングサイト-Miwatas Nasu-",
    source: "モノクロームの読み物 / noteブログ",
    href: "https://note.com/monochrome_so/n/n738e5765b866",
    external: true,
  },
];

const CATEGORIES = ["全て", "プレスリリース", "採用情報", "掲載情報"] as const;

function NewsRow({ item }: { item: NewsItem }) {
  const Arrow = item.external ? ArrowUpRightIcon : ArrowRightIcon;

  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className={cn(
        "group grid items-baseline gap-3 border-t border-neutral-200 py-4 md:gap-6",
        "grid-cols-[80px_1fr_24px] md:grid-cols-[100px_140px_1fr_24px]",
      )}
    >
      <span className="text-sm text-neutral-500">{item.date}</span>
      <span className="hidden w-fit items-center rounded-full border border-neutral-300 px-3 py-0.5 text-xs md:inline-flex">
        {item.category}
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

export default function PressPage() {
  const [activeCategory, setActiveCategory] = useState<string>("全て");

  const filtered =
    activeCategory === "全て"
      ? NEWS
      : NEWS.filter((n) => n.category === activeCategory);

  return (
    <>
      <SiteHeader />
      <main>
        <section data-reveal className="base-px py-16 md:py-20">
          <h1 className="text-3xl md:text-4xl font-normal">ニュース</h1>
          <p className="text-base text-neutral-600 mt-3">
            プレスリリースとメディア掲載情報をお届けします。
          </p>
        </section>

        <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 base-px py-4">
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-black border-b-2 border-black pb-1"
                      : "text-neutral-500 hover:text-black",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <section data-reveal className="base-px py-12 md:py-16">
          <div data-reveal-stagger>
            {filtered.map((item, idx) => (
              <NewsRow key={`${item.href}-${idx}`} item={item} />
            ))}
          </div>
          <div className="border-t border-neutral-200" aria-hidden />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
