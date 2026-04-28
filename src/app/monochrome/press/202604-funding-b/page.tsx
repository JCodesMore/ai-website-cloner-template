import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "シリーズB資金調達を実施 | Monochrome",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <article data-reveal className="max-w-3xl mx-auto base-px py-20 md:py-28">
          <p className="text-sm text-neutral-500">
            2026.4.22 · プレスリリース
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal mt-4 leading-[1.4]">
            モノクローム、シリーズB資金調達を実施-建材一体型太陽光パネル開発スタートアップ。プロダクトから体験へ。一棟からまちへ。
          </h1>

          <div className="mt-12">
            <p className="text-base leading-[1.8] text-neutral-800">
              株式会社モノクローム（本社：東京都中央区、代表取締役：梅田優祐）は、シリーズB資金調達を実施したことをお知らせします。今回の調達額は17億円で、累計資金調達額は33億円に達します。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">調達の背景</h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              モノクロームは、建材一体型太陽光パネル「Roof–1」「Wall–1」「Panel–B」とHEMS「Energy–1」を開発・販売してきました。創業以来、「未来に残したい景色をつくる」をミッションに掲げ、再生可能エネルギーと建築の景観調和を実現する製品を提供してきました。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">
              「プロダクトから体験へ。一棟からまちへ。」
            </h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              今回の調達により、モノクロームは事業フェーズを「プロダクト中心」から「体験・まちづくり中心」へと拡張します。これまで個別住宅向けに製品を提供してきましたが、今後は工務店・建築家・自治体・電力会社と連携し、街区・地域単位での再エネ循環モデルの実現に取り組みます。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">主な投資家</h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              今回の調達は、複数の国内VC・事業会社・金融機関から実施しました。投資家各社からは、再エネ住宅市場の成長性、モノクロームの製品技術、組織能力に対する高い評価を頂きました。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">今後の展開</h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              資金は、製品開発の加速、施工パートナー網の全国展開、Energy–1のソフトウェア機能拡充、海外展開のための研究開発に投資します。また、工務店パートナー・施工パートナーの認定制度を全国に拡大し、モノクローム認定施工店制度を強化します。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">会社概要</h2>
            <dl className="text-sm leading-[1.8] text-neutral-800 grid grid-cols-[6rem_1fr] gap-y-1">
              <dt className="text-neutral-500">社名</dt>
              <dd>株式会社モノクローム</dd>
              <dt className="text-neutral-500">代表者</dt>
              <dd>梅田 優祐</dd>
              <dt className="text-neutral-500">設立</dt>
              <dd>2020年</dd>
              <dt className="text-neutral-500">本社</dt>
              <dd>東京都中央区日本橋横山町5-13 MIDORI.so 6F</dd>
              <dt className="text-neutral-500">事業内容</dt>
              <dd>建材一体型太陽光パネル・HEMSの開発販売</dd>
              <dt className="text-neutral-500">URL</dt>
              <dd>
                <a
                  href="https://www.monochrome.so"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-black"
                >
                  https://www.monochrome.so
                </a>
              </dd>
            </dl>

            <h2 className="text-xl font-medium mt-12 mb-4">お問い合わせ先</h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              株式会社モノクローム 広報担当
              <br />
              E-mail: press@monochrome.so
            </p>
          </div>

          <div className="mt-16 flex flex-wrap gap-4 justify-between border-t border-neutral-200 pt-8">
            <Link
              href="/monochrome/press"
              className="button-base button-outline"
            >
              ニュース一覧へ
            </Link>
            <Link
              href="/monochrome/contact"
              className="button-base button-fill"
            >
              お問い合わせ
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
