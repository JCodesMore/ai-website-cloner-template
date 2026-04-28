import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata = { title: "プライバシーポリシー | Monochrome" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <article data-reveal className="max-w-3xl mx-auto base-px py-20 md:py-28 text-base leading-relaxed text-neutral-800">
          <h1 className="text-3xl md:text-4xl font-normal mb-8 text-neutral-900">
            プライバシーポリシー
          </h1>

          <p>
            株式会社モノクロームおよびそのグループ会社（以下「当社グループ」）は、個人情報保護法及び関連法令を遵守し、本プライバシーポリシーに従って個人情報を取り扱います。
          </p>

          <section>
            <h2 className="text-xl font-medium mt-12 mb-4 text-neutral-900">
              1. 個人情報の取得
            </h2>
            <p>
              当社グループは、ウェブサイト上での製品に関するお問い合わせ等を通じて個人情報を取得し、次条に定める利用目的の範囲内でのみ利用します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mt-12 mb-4 text-neutral-900">
              2. 個人情報の利用目的
            </h2>
            <p>
              法令で許可される場合を除き、当社グループは個人情報を以下の目的でのみ利用します：
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-1.5">
              <li>お問い合わせ内容の確認、ご要望への対応（製品提案を含む）</li>
              <li>現地調査、訪問、打ち合わせ</li>
              <li>製品の出荷および配送に関するお問い合わせ対応</li>
              <li>設置工事、業務委託、施工管理</li>
              <li>系統連系、売電、補助金申請等の手続き</li>
              <li>決済、請求、ファイナンス支援プログラムのご案内</li>
              <li>製品の技術改善、業務改善、新製品開発</li>
              <li>アフターサービスおよび瑕疵対応</li>
              <li>各種お問い合わせへの対応</li>
              <li>ニュースレターの配信</li>
              <li>マーケティングデータ分析および戦略立案</li>
            </ul>
            <p className="mt-4 text-sm text-neutral-600">
              ※採用に関する個人情報は、採用活動の目的のみに利用します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mt-12 mb-4 text-neutral-900">
              3. 個人データの共同利用
            </h2>
            <p>
              当社グループは、適切な事業運営のために必要な範囲で、グループ各社間で個人データ（氏名、住所、電話番号、メールアドレス）を共同利用します。管理責任は株式会社モノクロームが負います。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mt-12 mb-4 text-neutral-900">
              4. 個人データの管理
            </h2>
            <p>
              当社グループは、個人情報への不正アクセス、紛失、改ざん、漏洩を防止するために必要な措置を講じ、業務委託先を適切に監督します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mt-12 mb-4 text-neutral-900">
              5. 個人データの第三者提供
            </h2>
            <p>
              法令で許可され、かつ目的達成に必要な場合、当社グループは個人データを第三者および業務委託先に提供します。提供する情報は氏名、住所、電話番号、メールアドレスその他目的に必要な事項に限定されます。提供例：製品お問い合わせ、施工契約、技術図面。提供先：施工会社、物流業者、機器メーカー、サプライヤー、業務提携先。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mt-12 mb-4 text-neutral-900">
              6. 個人情報に関するお問い合わせ
            </h2>
            <p>
              データの利用、開示、訂正、削除、利用停止、第三者提供の停止に関するお問い合わせは下記までお願いします。
            </p>
            <p className="mt-3">
              E-mail:{" "}
              <a
                href="mailto:help@monochrome.so"
                className="underline underline-offset-2 hover:text-neutral-900"
              >
                help@monochrome.so
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mt-12 mb-4 text-neutral-900">
              7. ポリシーの変更
            </h2>
            <p>
              当社グループは、必要に応じて本プライバシーポリシーを変更することがあります。変更内容は本ページに掲載します。
            </p>
          </section>

          <p className="mt-16 text-right text-sm text-neutral-500">
            制定日 2024年1月1日 / 最終改定日 2026年4月1日
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
