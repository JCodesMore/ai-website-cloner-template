import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata = { title: "会社情報 | Monochrome" };

type CompanyRow = {
  label: string;
  value: React.ReactNode;
};

const COMPANY_INFO: CompanyRow[] = [
  { label: "法人名", value: "株式会社モノクローム / 株式会社モノクローム建設" },
  { label: "代表者", value: "梅田 優祐 (CEO)" },
  { label: "設立", value: "2020年" },
  { label: "資本金", value: "非公開" },
  {
    label: "本社",
    value: "〒103-0003 東京都中央区日本橋横山町5-13 MIDORI.so 6F",
  },
  { label: "建設拠点", value: "〒240-0105 神奈川県横須賀市秋谷4321" },
  {
    label: "事業内容",
    value: "建材一体型太陽光パネル、HEMS、再生可能エネルギー関連事業",
  },
  {
    label: "お問い合わせ",
    value: (
      <a href="mailto:hello@monochrome.so" className="underline">
        hello@monochrome.so
      </a>
    ),
  },
];

const LEADERS: { name: string; title: string }[] = [
  { name: "梅田 優祐", title: "CEO" },
  { name: "乾 岳志", title: "COO" },
  { name: "大川 知", title: "CTO" },
  { name: "森下 佳織", title: "CFO" },
];

const NEWS = [
  {
    date: "2026.4.27",
    category: "プレスリリース",
    title:
      "モノクローム、HEMS「Energy–1」がみらいエコ住宅2026事業（GX志向型住宅）に対応。工事不要で補助金要件を一体で満たせる提案を強化-AIF認証を取得。",
    href: "/monochrome/press/202604-aif",
  },
  {
    date: "2026.4.22",
    category: "プレスリリース",
    title:
      "モノクローム、シリーズB資金調達を実施-建材一体型太陽光パネル開発スタートアップ。プロダクトから体験へ。一棟からまちへ。",
    href: "/monochrome/press/202604-funding-b",
  },
  {
    date: "2026.4.14",
    category: "採用情報",
    title: "採用情報",
    href: "/monochrome/press/recruit",
  },
] as const;

export default function CompanyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section data-reveal className="base-px py-20 md:py-28">
          <h1 className="text-3xl md:text-4xl font-normal">会社情報</h1>
          <p className="mt-6 text-lg leading-[1.8] max-w-2xl">
            こんにちは、モノクローム です。建材一体型太陽光パネルとHEMSを開発しています。
          </p>
        </section>

        <section data-reveal className="base-px py-16 md:py-20 bg-beige">
          <h2 className="text-2xl md:text-3xl font-normal">
            未来に残したい景色をつくる。
          </h2>
          <p className="mt-6 text-base leading-[1.8] text-neutral-700 max-w-2xl">
            街の景観を守りながら、エネルギー自給率を上げる。建材と発電を一体化することで、これまで太陽光パネルがもたらしていた景観の課題と、エネルギー問題の両方を、デザインの力で解決します。
          </p>
        </section>

        <section data-reveal className="base-px py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-normal mb-8">会社概要</h2>
          <dl className="max-w-3xl">
            {COMPANY_INFO.map((row) => (
              <div
                key={row.label}
                className="flex border-t border-neutral-200 py-4 text-sm md:text-base"
              >
                <dt className="text-neutral-500 w-1/3 shrink-0">{row.label}</dt>
                <dd className="text-neutral-900 leading-relaxed">{row.value}</dd>
              </div>
            ))}
            <div className="border-t border-neutral-200" aria-hidden />
          </dl>
        </section>

        <section data-reveal className="base-px py-16 md:py-20 bg-beige">
          <h2 className="text-2xl md:text-3xl font-normal mb-8">経営チーム</h2>
          <div data-reveal-stagger className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {LEADERS.map((leader) => (
              <div key={leader.name}>
                <div
                  className="aspect-square bg-gradient-to-br from-neutral-200 to-neutral-300"
                  aria-hidden
                />
                <p className="mt-3 text-base font-normal">{leader.name}</p>
                <p className="mt-1 text-sm text-neutral-500">{leader.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-reveal className="base-px py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-normal mb-6">採用情報</h2>
          <p className="text-base leading-[1.8] text-neutral-700 max-w-2xl mb-8">
            事業の立ち上げから成長・拡大までを一緒に創っていける仲間を募集しています。
          </p>
          <Link
            href="/monochrome/press/recruit"
            className="button-base button-fill"
          >
            採用情報を見る
          </Link>
        </section>

        <section data-reveal className="bg-dark text-white py-16 md:py-20 base-px">
          <h3 className="mb-2 text-base font-normal">ニュースリリース</h3>
          <div data-reveal-stagger>
          {NEWS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group grid items-baseline gap-3 border-t border-white/10 py-4 md:gap-6 grid-cols-[80px_1fr_24px] md:grid-cols-[100px_140px_1fr_24px]"
            >
              <span className="text-sm text-white/60">{item.date}</span>
              <span className="hidden w-fit items-center rounded-full border border-white/40 px-3 py-0.5 text-xs md:inline-flex">
                {item.category}
              </span>
              <span className="text-sm leading-[1.6]">{item.title}</span>
              <span className="justify-self-end text-white/60 transition-colors group-hover:text-white">
                →
              </span>
            </Link>
          ))}
          </div>
          <div className="border-t border-white/10" aria-hidden />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
