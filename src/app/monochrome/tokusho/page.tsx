import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata = { title: "特定商取引法に基づく表記 | Monochrome" };

type Row = { term: string; value: string };

const ROWS: Row[] = [
  { term: "販売業者", value: "株式会社モノクローム" },
  { term: "代表者", value: "梅田 優祐" },
  { term: "住所", value: "〒240-0105 神奈川県横須賀市秋谷4321" },
  {
    term: "電話番号",
    value: "050-1720-9022（月〜金 9:00〜17:00、祝日・年末年始除く）",
  },
  { term: "メールアドレス", value: "support@energy.monochrome.so" },
  { term: "販売価格", value: "供給地域・契約プランにより異なります" },
  { term: "支払方法", value: "クレジットカード払い、口座振替" },
  {
    term: "支払い時期",
    value: "前月検針日から当月検針日前日までの料金を翌月支払い",
  },
  {
    term: "電気供給開始日",
    value:
      "切替えの場合は最初の計量日または検針日。引越しの場合は申込時の希望日または協議のうえ決定した日",
  },
  {
    term: "契約解除",
    value:
      "最後の使用日の5営業日前までにご連絡ください（建物解体に伴う解除は10営業日前まで）",
  },
  {
    term: "その他",
    value:
      "使用済み電気の払戻しは致しかねます。非常変災による使用制限・停止は当社の責任の対象外となります",
  },
];

export default function TokushoPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <article data-reveal className="max-w-3xl mx-auto base-px py-20 md:py-28">
          <h1 className="text-3xl md:text-4xl font-normal mb-3 text-neutral-900">
            特定商取引法に基づく表記
          </h1>
          <p className="text-sm text-neutral-500 mb-12">
            「モノクローム電力」
          </p>

          <table className="w-full text-sm border-t border-neutral-200">
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.term}
                  className="border-b border-neutral-200 align-top"
                >
                  <th
                    scope="row"
                    className="text-neutral-500 w-1/3 py-4 pr-4 text-left font-normal"
                  >
                    {row.term}
                  </th>
                  <td className="text-neutral-900 py-4 leading-relaxed">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
