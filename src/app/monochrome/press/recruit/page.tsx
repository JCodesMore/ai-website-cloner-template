import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = { title: "採用情報 | Monochrome" };

type Position = {
  title: string;
  description: string;
};

const POSITIONS: Position[] = [
  {
    title: "電気施工管理",
    description: "太陽光・蓄電池システムの施工管理",
  },
  {
    title: "電気工事士",
    description: "現場での電気工事業務",
  },
  {
    title: "Sales Manager",
    description: "営業組織のマネジメントとパイプライン構築",
  },
  {
    title: "Sales Developer",
    description: "新規顧客開拓と提案営業",
  },
  {
    title: "Business Developer & Product Manager",
    description: "新規事業企画とプロダクト開発",
  },
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

export default function RecruitPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section data-reveal className="base-px py-20 md:py-28">
          <h1 className="text-3xl md:text-4xl font-normal">採用情報</h1>
          <p className="mt-6 text-base leading-[1.8] max-w-2xl text-neutral-700">
            モノクロームでは、事業の立ち上げから成長・拡大までを一緒に創っていける仲間を募集しています。建材一体型太陽光パネルとHEMSで、未来に残したい景色をつくる。私たちと一緒に、その挑戦を進めていきませんか。
          </p>
        </section>

        <section data-reveal className="base-px py-16 md:py-20 bg-beige">
          <h2 className="text-2xl md:text-3xl font-normal mb-8">募集職種</h2>
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {POSITIONS.map((position) => (
              <div
                key={position.title}
                className="bg-white p-8 border border-neutral-200 flex flex-col"
              >
                <h3 className="text-lg font-normal">{position.title}</h3>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed flex-1">
                  {position.description}
                </p>
                <div className="mt-6 flex justify-end">
                  <a
                    href="mailto:hello@monochrome.so"
                    className="button-base button-outline"
                  >
                    応募する
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section data-reveal className="base-px py-16">
          <h2 className="text-2xl md:text-3xl font-normal mb-6">
            採用パートナー募集
          </h2>
          <p className="text-base leading-[1.8] text-neutral-700 max-w-2xl mb-8">
            金属加工・電気工事を専門とする施工パートナー会社も募集しています。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/monochrome/mc-builder"
              className="button-base button-outline"
            >
              工務店パートナー
            </Link>
            <Link
              href="/monochrome/installer-partner-application"
              className="button-base button-outline"
            >
              施工パートナー
            </Link>
          </div>
        </section>

        <section data-reveal className="base-px py-16 bg-beige text-center">
          <p className="text-base leading-[1.8] text-neutral-700">
            ご応募・ご質問は
            <a href="mailto:hello@monochrome.so" className="underline">
              hello@monochrome.so
            </a>
            までお気軽にご連絡ください。
          </p>
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
