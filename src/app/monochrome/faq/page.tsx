import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata = { title: "よくあるご質問 | Monochrome" };

type QA = { q: string; a: string };
type Section = { title: string; items: QA[] };

const SECTIONS: Section[] = [
  {
    title: "Roof–1 製品に関するご質問",
    items: [
      {
        q: "Roof–1は他社の製品と比べて、何が違いますか？",
        a: "Roof–1は屋根材と太陽光パネルが完全に一体化した建材一体型太陽光パネルです。架台や追加の屋根材が不要で、軽量・高耐久・25年保証を実現しています。",
      },
      {
        q: "太陽光パネルを載せない部分の屋根は、別途手配が必要ですか？",
        a: "いいえ。Roof–1モジュールと組み合わせ可能な専用の金属屋根材をモノクロームから一括でお届けします。",
      },
      {
        q: "太陽光パネルはどれだけ載せるのがよいですか？",
        a: "ご家庭の電力使用量・屋根形状・予算に応じて最適な発電容量をご提案します。お問い合わせフォームよりご相談ください。",
      },
      {
        q: "色のバリエーションはありますか？",
        a: "Black、Silver、Roof–1eの3種類をご用意しています。建物のデザインに合わせてお選びいただけます。",
      },
      {
        q: "蓄電池、V2Hも導入したいです",
        a: "HEMS「Energy–1」と組み合わせることで、蓄電池やV2H機器も一括で最適制御できます。詳しくはご相談ください。",
      },
    ],
  },
  {
    title: "リフォームに関するご質問",
    items: [
      {
        q: "リフォームで屋根材を交換するタイミングはいつが適切ですか？",
        a: "一般的に築20〜30年を目安にご検討ください。屋根材の劣化具合により最適なタイミングをご提案します。",
      },
      {
        q: "どのような施工方法が可能ですか？",
        a: "既存屋根の上から重ねる「カバー工法」と、既存屋根を撤去する「葺き替え工法」の両方に対応しています。",
      },
      {
        q: "見積がほしいです。",
        a: "お問い合わせフォームより、ご住所・建物情報をお送りください。担当者より概算見積もりをご連絡します。",
      },
      {
        q: "屋根単体のリフォーム＋架台式太陽光の設置より、Roof–1は安くなりますか？",
        a: "多くのケースで、Roof–1の方が屋根リフォームと架台式太陽光の合計費用より低コストになります。",
      },
      {
        q: "屋根リフォームの工事期間はどれくらいですか？",
        a: "一般的な戸建て住宅で約1〜2週間が目安です。屋根形状や規模により変動します。",
      },
      {
        q: "リフォーム工事中に、生活への影響はありますか？",
        a: "屋内での生活は通常通り可能です。ただし足場の設置や騒音が発生する時間帯がございます。",
      },
      {
        q: "現地の調査・施工は誰が行いますか？",
        a: "モノクローム認定施工店または当社建設子会社が責任を持って対応します。",
      },
      {
        q: "築古の建物ですが、耐震上問題ないでしょうか？",
        a: "Roof–1は軽量設計のため、耐震上のリスクは小さいです。事前の構造調査により安全性を確認します。",
      },
    ],
  },
  {
    title: "対応エリア",
    items: [
      {
        q: "対応エリアを教えてください。",
        a: "全国対応です。離島や一部地域では追加費用が発生する場合があります。",
      },
      {
        q: "積雪地域ですが、設置できますか？",
        a: "積雪140cmまでの通常モデル、300cmまでの豪雪地域モデルをご用意しています。",
      },
      {
        q: "塩害地域ですが、設置できますか？",
        a: "海岸から500m以上離れた地域では標準保証対応、それ以内の地域では特別仕様にて対応可能です。",
      },
    ],
  },
  {
    title: "注文・納期",
    items: [
      {
        q: "見積の取得や注文はどのように進めたらいいですか？注文前に相談したいこともあります。",
        a: "お問い合わせフォームよりご連絡ください。担当者より具体的な進め方をご案内します。",
      },
      {
        q: "検討や注文はどのように進めたらいいですか？",
        a: "お問い合わせ→現地調査→お見積り→ご契約→工事の流れで進めます。",
      },
      {
        q: "納期はどれくらいかかりますか？",
        a: "ご契約から施工完了まで、一般的に2〜4ヶ月が目安です。",
      },
      {
        q: "国や自治体が出しているリフォーム費用の助成金制度は利用できますか？",
        a: "多くの補助金制度が利用可能です。最新情報はお問い合わせください。",
      },
      {
        q: "補助金申請の代行は行っていますか？",
        a: "提携施工店による申請サポートをご提供しています。",
      },
    ],
  },
  {
    title: "保証・アフターサービス",
    items: [
      {
        q: "保証期間・費用はどれくらいですか？",
        a: "Roof–1モジュールは20〜25年の出力保証を無償でご提供します。",
      },
      {
        q: "太陽光パネルにもし何かあった場合、屋根ごと張り替える必要がありますか？",
        a: "いいえ。モジュール単位での交換が可能なため、損傷した部分のみの修理で対応できます。",
      },
      {
        q: "太陽光パネルの廃棄問題も目にするのですが、Roof–1は大丈夫でしょうか？",
        a: "Roof–1は99%リサイクル可能な設計です。専門のリサイクル工場と提携し、素材単位までの分別を実現しています。",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <article data-reveal className="max-w-3xl mx-auto base-px py-20 md:py-28">
          <h1 className="text-3xl md:text-4xl font-normal mb-2 text-neutral-900">
            よくあるご質問
          </h1>

          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-medium mt-12 mb-4 border-b border-neutral-200 pb-3 text-neutral-900">
                {section.title}
              </h2>
              <div>
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group border-b border-neutral-200 py-5"
                  >
                    <summary className="cursor-pointer list-none text-base font-medium flex items-start gap-3 text-neutral-900">
                      <span
                        aria-hidden
                        className="text-neutral-400 transition-transform shrink-0 mt-0.5 leading-none text-lg group-open:rotate-45"
                      >
                        +
                      </span>
                      <span className="flex-1 leading-relaxed">{item.q}</span>
                    </summary>
                    <p className="mt-3 pl-6 text-base leading-relaxed text-neutral-700">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
