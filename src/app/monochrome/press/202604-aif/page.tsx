import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "HEMS「Energy–1」がみらいエコ住宅2026事業に対応 | Monochrome",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <article data-reveal className="max-w-3xl mx-auto base-px py-20 md:py-28">
          <p className="text-sm text-neutral-500">
            2026.4.27 · プレスリリース
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal mt-4 leading-[1.4]">
            モノクローム、HEMS「Energy–1」がみらいエコ住宅2026事業（GX志向型住宅）に対応。工事不要で補助金要件を一体で満たせる提案を強化-AIF認証を取得。発電から制御まで一体提案を強化
          </h1>

          <div className="mt-12">
            <p className="text-base leading-[1.8] text-neutral-800">
              株式会社モノクローム（本社：東京都中央区、代表取締役：梅田優祐）が開発・販売するHEMS（Home
              Energy Management
              System）「Energy–1」が、経済産業省「みらいエコ住宅2026事業」のGX志向型住宅向け補助金要件に対応しました。同時に、ECHONET
              Lite
              AIF認証を取得し、太陽光発電・蓄電池・エコキュート等の各種設備を統合制御する一体提案を強化します。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">
              みらいエコ住宅2026事業について
            </h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              みらいエコ住宅2026事業は、経済産業省・国土交通省・環境省が連携して実施する住宅向け補助金制度で、断熱・省エネ・再エネ設備等を備えたGX志向型住宅を支援します。本制度では、HEMSによるエネルギー管理が補助金要件の一つとなっています。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">
              Energy–1の対応内容
            </h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              Energy–1は、コンセントに挿すだけで設置可能な手軽さながら、AIF認証取得により業界標準の通信プロトコルに準拠。太陽光発電量、消費電力、蓄電池残量等をリアルタイムで把握し、AI制御により家庭全体の電力使用を最適化します。今回の補助金対応により、新築・リフォーム両面で工事不要のHEMS導入が可能となります。
            </p>

            <h2 className="text-xl font-medium mt-12 mb-4">今後の展開</h2>
            <p className="text-base leading-[1.8] text-neutral-800">
              モノクロームでは、Roof–1・Wall–1といった建材一体型太陽光パネルとEnergy–1を組み合わせた「Solar
              Standard
              Package」を提供しており、補助金活用と再エネ導入を一体で実現します。今後も、住宅・建築領域における脱炭素化を加速させる製品開発に取り組みます。
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
