import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  MonochromeMark,
} from "@/components/icons";

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
    href: "/press/1",
  },
  {
    date: "2026.4.22",
    badge: "プレスリリース",
    title:
      "モノクローム、シリーズB資金調達を実施-建材一体型太陽光パネル開発スタートアップ。プロダクトから体験へ。一棟からまちへ。",
    href: "/press/2",
  },
  {
    date: "2026.4.14",
    badge: "採用情報",
    title: "採用情報",
    href: "/recruit",
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

type FooterColumn = {
  id: string;
  links: { label: string; href: string }[];
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "products",
    links: [
      { label: "Roof-1", href: "/roof-1" },
      { label: "Wall-1", href: "/wall-1" },
      { label: "Panel-B", href: "/panel-b" },
      { label: "Energy-1", href: "/energy-1" },
      { label: "モノクローム電力", href: "/electricity" },
    ],
  },
  {
    id: "resources",
    links: [
      { label: "ジャーナル", href: "/journal" },
      { label: "ニュース", href: "/press" },
      { label: "よくあるご質問", href: "/faq" },
      { label: "施工事例", href: "/cases" },
    ],
  },
  {
    id: "company",
    links: [
      { label: "会社情報", href: "/about" },
      { label: "採用情報", href: "/careers" },
    ],
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
        "group grid items-baseline gap-3 border-t border-white/10 py-4 md:gap-6",
        "grid-cols-[80px_1fr_24px] md:grid-cols-[100px_140px_1fr_24px]",
      )}
    >
      <span className="text-sm text-white/60">{item.date}</span>
      <span className="hidden w-fit items-center rounded-full border border-white/40 px-3 py-0.5 text-xs md:inline-flex">
        {item.badge}
      </span>
      <span className="text-sm leading-[1.6]">
        {item.title}
        {item.source ? (
          <span className="mt-1 block text-xs text-white/60">
            {item.source}
          </span>
        ) : null}
      </span>
      <span className="justify-self-end text-white/60 transition-colors group-hover:text-white">
        <Arrow />
      </span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-dark text-white py-16 md:py-20 lg:py-30 base-px">
      {/* News releases */}
      <section className="mb-12 md:mb-16">
        <h3 className="mb-2 text-base font-normal">ニュースリリース</h3>
        {NEWS.map((item) => (
          <NewsRow key={item.href} item={item} />
        ))}
        <div className="border-t border-white/10" aria-hidden />
      </section>

      {/* Featured / press mentions */}
      <section className="mb-12 md:mb-16">
        <h3 className="mb-2 text-base font-normal">掲載情報</h3>
        {FEATURED.map((item) => (
          <NewsRow key={item.href} item={item} />
        ))}
        <div className="border-t border-white/10" aria-hidden />
      </section>

      {/* Link grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-x-12">
        <div>
          <MonochromeMark className="text-white" />
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <ul key={col.id} className="flex flex-col gap-3">
            {col.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        ))}
        <div className="flex flex-col gap-3">
          <Link
            href="/contact"
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            お問い合わせ
          </Link>
          <Link
            href="/newsletter"
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            ニュースレター登録
          </Link>
          <Link
            href="/download"
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            製品資料一覧
          </Link>
          <Link
            href="/tour"
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            見学会
          </Link>
          <Link
            href="/builders"
            className="button-base button-outline-on-dark mt-2 w-fit"
          >
            工務店の方はこちら
          </Link>
          <Link
            href="/partners"
            className="button-base button-outline-on-dark w-fit"
          >
            施工パートナー募集
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <ul className="flex gap-6">
          <li>
            <a
              href="https://x.com/monochromeso"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              X
            </a>
          </li>
          <li>
            <a
              href="https://instagram.com/monochrome.so"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://note.com/monochrome"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              note
            </a>
          </li>
        </ul>
        <ul className="flex gap-6">
          <li>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/legal" className="transition-colors hover:text-white">
              特定商取引法に基づく表記
            </Link>
          </li>
        </ul>
        <p className="text-white/40">Copyright © Monochrome 2026</p>
      </div>
    </footer>
  );
}
