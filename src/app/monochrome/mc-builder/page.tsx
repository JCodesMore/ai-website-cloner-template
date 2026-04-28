import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { submitBuilderApplication } from "../_actions/forms";

export const metadata = { title: "工務店の方へ | Monochrome" };

const PREFECTURES: string[] = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

const CONTACT_METHODS: string[] = ["電話", "メール", "どちらでも可"];

const INQUIRY_TYPES: string[] = [
  "お見積りについて",
  "Roof–1について詳しく知りたい",
  "Roof–1の販売パートナーになりたい",
  "Roof–1の認定施工店になりたい",
  "その他",
];

const REFERRAL_OPTIONS: string[] = ["はい", "いいえ"];

const SOURCE_OPTIONS: string[] = [
  "ウェブ検索",
  "知人の紹介",
  "メディア掲載",
  "展示会",
  "SNS",
  "その他",
];

const inputCls =
  "w-full border border-neutral-300 bg-white px-4 py-3 text-base focus:border-black focus:outline-none transition-colors";
const textareaCls = `${inputCls} min-h-32`;
const selectCls = `${inputCls} appearance-none cursor-pointer`;
const labelCls = "text-sm font-medium text-neutral-900";
const fieldCls = "flex flex-col gap-2";

function RequiredMark() {
  return (
    <span aria-hidden className="text-red-600 ml-0.5">
      *
    </span>
  );
}

export default function McBuilderPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section data-reveal className="base-px py-20 md:py-28">
          <h1 className="text-3xl md:text-4xl font-normal">工務店の方へ</h1>
          <p className="text-base text-neutral-600 mt-6 max-w-2xl leading-relaxed">
            Roof–1の販売店になっていただける、工務店のパートナーを探しています。モノクロームから建材のみの販売をさせていただきます。詳しくはお問い合わせください。
          </p>
          <p className="mt-3 text-sm text-neutral-500">
            ※商社様の登録は受け付けておりません。
          </p>
        </section>

        {/* Form */}
        <section data-reveal className="base-px pb-24 max-w-3xl mx-auto">
          <p className="text-xs text-neutral-500">* は必須項目です</p>

          <form
            action={submitBuilderApplication}
            className="flex flex-col gap-6 mt-12"
          >
            {/* 会社名 */}
            <div className={fieldCls}>
              <label htmlFor="company" className={labelCls}>
                会社名
                <RequiredMark />
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                className={inputCls}
              />
            </div>

            {/* お名前 */}
            <div className={fieldCls}>
              <label htmlFor="name" className={labelCls}>
                お名前
                <RequiredMark />
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={inputCls}
              />
            </div>

            {/* メールアドレス */}
            <div className={fieldCls}>
              <label htmlFor="email" className={labelCls}>
                メールアドレス
                <RequiredMark />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputCls}
              />
            </div>

            {/* 電話番号 */}
            <div className={fieldCls}>
              <label htmlFor="phone" className={labelCls}>
                電話番号
                <RequiredMark />
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={inputCls}
              />
            </div>

            {/* ご希望の連絡方法 */}
            <fieldset className={fieldCls}>
              <legend className={labelCls}>
                ご希望の連絡方法
                <RequiredMark />
              </legend>
              <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-1">
                {CONTACT_METHODS.map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800"
                  >
                    <input
                      type="radio"
                      name="contact_method"
                      value={m}
                      required
                    />
                    {m}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* お問い合わせ種別 */}
            <div className={fieldCls}>
              <label htmlFor="inquiry_type" className={labelCls}>
                お問い合わせ種別
                <RequiredMark />
              </label>
              <select
                id="inquiry_type"
                name="inquiry_type"
                required
                className={selectCls}
                defaultValue=""
              >
                <option value="" disabled>
                  選択してください
                </option>
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 対応可能エリア */}
            <fieldset className={fieldCls}>
              <legend className={labelCls}>
                対応可能エリア
                <RequiredMark />
              </legend>
              <p className="text-sm text-neutral-600">
                2都道府県以上 選択してください
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-2">
                {PREFECTURES.map((p) => (
                  <label
                    key={p}
                    className="flex items-center gap-2 cursor-pointer text-neutral-800"
                  >
                    <input type="checkbox" name="areas" value={p} />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 認定施工店からの紹介 */}
            <fieldset className={fieldCls}>
              <legend className={labelCls}>
                認定施工店からの紹介を希望しますか？
                <RequiredMark />
              </legend>
              <div className="flex gap-6 mt-1">
                {REFERRAL_OPTIONS.map((o) => (
                  <label
                    key={o}
                    className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800"
                  >
                    <input
                      type="radio"
                      name="referral"
                      value={o}
                      required
                    />
                    {o}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* ご相談内容 */}
            <div className={fieldCls}>
              <label htmlFor="message" className={labelCls}>
                ご相談内容
              </label>
              <textarea
                id="message"
                name="message"
                className={textareaCls}
              />
            </div>

            {/* 着工予定時期 */}
            <div className={fieldCls}>
              <label htmlFor="start_date" className={labelCls}>
                着工予定時期
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                className={inputCls}
              />
            </div>

            {/* 図面ファイル */}
            <div className={fieldCls}>
              <label htmlFor="drawing" className={labelCls}>
                図面ファイル
              </label>
              <input
                id="drawing"
                name="drawing"
                type="file"
                accept=".pdf,.zip"
                className="text-sm"
              />
            </div>

            {/* 製品をどこで知りましたか */}
            <div className={fieldCls}>
              <label htmlFor="source" className={labelCls}>
                製品をどこで知りましたか？
                <RequiredMark />
              </label>
              <select
                id="source"
                name="source"
                required
                className={selectCls}
                defaultValue=""
              >
                <option value="" disabled>
                  選択してください
                </option>
                {SOURCE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* プライバシーポリシー */}
            <div className={fieldCls}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800">
                <input
                  type="checkbox"
                  name="privacy_agree"
                  value="1"
                  required
                />
                <span>
                  <Link
                    href="/monochrome/privacy-policy"
                    className="underline underline-offset-2 hover:text-neutral-900"
                  >
                    プライバシーポリシー
                  </Link>
                  に同意します
                  <RequiredMark />
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="button-base button-fill w-full md:w-auto justify-center mt-4"
            >
              送信する
            </button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
