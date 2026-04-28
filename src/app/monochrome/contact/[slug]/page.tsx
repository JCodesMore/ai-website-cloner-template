import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { submitContactForm } from "../../_actions/forms";
import { PRODUCTS, PREFECTURES, type ContactProduct } from "../products";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  return {
    title: product
      ? `${product.name} お問い合わせ | Monochrome`
      : "Monochrome",
  };
}

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

const PROPERTY_TYPES = ["新築", "リフォーム", "検討中"];
const SCHEDULE_OPTIONS = [
  "1ヶ月以内",
  "3ヶ月以内",
  "半年以内",
  "1年以内",
  "未定",
];
const SOURCE_OPTIONS = [
  "ウェブ検索",
  "知人の紹介",
  "メディア掲載",
  "展示会",
  "SNS",
  "その他",
];

const ROOF_SHAPES = [
  "切妻",
  "寄棟",
  "片流れ",
  "陸屋根",
  "複合",
  "不明",
];
const WALL_FLOORS = ["1〜2階", "3〜5階", "6階以上"];
const PANEL_LOCATIONS = ["屋根", "地上", "その他"];
const ENERGY_EXISTING = ["あり", "なし", "検討中"];
const APP_OS = ["iOS", "Android"];

function ProductSpecificFields({ slug }: { slug: ContactProduct["slug"] }) {
  if (slug === "roof") {
    return (
      <>
        <div className={fieldCls}>
          <label htmlFor="roof_area" className={labelCls}>
            屋根面積
          </label>
          <input
            id="roof_area"
            name="roof_area"
            type="text"
            className={inputCls}
            placeholder="例：約120㎡"
          />
        </div>
        <div className={fieldCls}>
          <label htmlFor="roof_shape" className={labelCls}>
            屋根の形状
          </label>
          <select
            id="roof_shape"
            name="roof_shape"
            className={selectCls}
            defaultValue=""
          >
            <option value="" disabled>
              選択してください
            </option>
            {ROOF_SHAPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  }

  if (slug === "wall") {
    return (
      <>
        <div className={fieldCls}>
          <label htmlFor="wall_area" className={labelCls}>
            外壁面積
          </label>
          <input
            id="wall_area"
            name="wall_area"
            type="text"
            className={inputCls}
            placeholder="例：約180㎡"
          />
        </div>
        <div className={fieldCls}>
          <label htmlFor="building_floors" className={labelCls}>
            建物階数
          </label>
          <select
            id="building_floors"
            name="building_floors"
            className={selectCls}
            defaultValue=""
          >
            <option value="" disabled>
              選択してください
            </option>
            {WALL_FLOORS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  }

  if (slug === "panel") {
    return (
      <>
        <fieldset className={fieldCls}>
          <legend className={labelCls}>設置場所</legend>
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-1">
            {PANEL_LOCATIONS.map((l) => (
              <label
                key={l}
                className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800"
              >
                <input type="radio" name="panel_location" value={l} />
                {l}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={fieldCls}>
          <label htmlFor="capacity" className={labelCls}>
            想定発電容量
          </label>
          <input
            id="capacity"
            name="capacity"
            type="text"
            className={inputCls}
            placeholder="例：5kW"
          />
        </div>
      </>
    );
  }

  if (slug === "energy") {
    return (
      <>
        <fieldset className={fieldCls}>
          <legend className={labelCls}>既設の太陽光・蓄電池</legend>
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-1">
            {ENERGY_EXISTING.map((e) => (
              <label
                key={e}
                className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800"
              >
                <input type="radio" name="existing_solar" value={e} />
                {e}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className={fieldCls}>
          <legend className={labelCls}>アプリOS</legend>
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-1">
            {APP_OS.map((o) => (
              <label
                key={o}
                className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800"
              >
                <input type="checkbox" name="app_os" value={o} />
                {o}
              </label>
            ))}
          </div>
        </fieldset>
      </>
    );
  }

  if (slug === "power") {
    return (
      <>
        <div className={fieldCls}>
          <label htmlFor="current_provider" className={labelCls}>
            現在の電力会社
          </label>
          <input
            id="current_provider"
            name="current_provider"
            type="text"
            className={inputCls}
          />
        </div>
        <div className={fieldCls}>
          <label htmlFor="monthly_usage" className={labelCls}>
            月間電気使用量
          </label>
          <input
            id="monthly_usage"
            name="monthly_usage"
            type="text"
            className={inputCls}
            placeholder="例：350kWh"
          />
        </div>
      </>
    );
  }

  return null;
}

export default async function ContactProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const others = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section data-reveal className="base-px py-16 md:py-24 bg-beige">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            お問い合わせ
          </p>
          <h1 className="text-3xl md:text-4xl font-normal mt-3">
            {product.name} に関するお問い合わせ
          </h1>
          <p className="mt-3 text-base text-neutral-700">{product.tagline}</p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {PRODUCTS.map((p) => {
              const isActive = p.slug === product.slug;
              return (
                <Link
                  key={p.slug}
                  href={`/monochrome/contact/${p.slug}`}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-black border-b-2 border-black pb-1"
                      : "text-neutral-500 hover:text-black",
                  )}
                >
                  {p.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Form */}
        <section
          data-reveal
          id={product.anchor}
          className="max-w-2xl mx-auto base-px py-16 md:py-20"
        >
          <p className="text-xs text-neutral-500 mb-6">* は必須項目です</p>

          <form action={submitContactForm} className="flex flex-col gap-5">
            <input type="hidden" name="slug" value={product.slug} />
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

            <div className={fieldCls}>
              <label htmlFor="company" className={labelCls}>
                会社名 / 個人
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className={inputCls}
              />
            </div>

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

            <div className={fieldCls}>
              <label htmlFor="phone" className={labelCls}>
                電話番号
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={inputCls}
              />
            </div>

            <div className={fieldCls}>
              <label htmlFor="postal_code" className={labelCls}>
                郵便番号
              </label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                className={inputCls}
                placeholder="例：100-0001"
              />
            </div>

            <div className={fieldCls}>
              <label htmlFor="prefecture" className={labelCls}>
                都道府県
                <RequiredMark />
              </label>
              <select
                id="prefecture"
                name="prefecture"
                required
                className={selectCls}
                defaultValue=""
              >
                <option value="" disabled>
                  選択してください
                </option>
                {PREFECTURES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className={fieldCls}>
              <legend className={labelCls}>
                物件種別
                <RequiredMark />
              </legend>
              <div className="flex flex-col md:flex-row gap-3 md:gap-6 mt-1">
                {PROPERTY_TYPES.map((t) => (
                  <label
                    key={t}
                    className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800"
                  >
                    <input
                      type="radio"
                      name="property_type"
                      value={t}
                      required
                    />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={fieldCls}>
              <label htmlFor="schedule" className={labelCls}>
                着工予定時期
              </label>
              <select
                id="schedule"
                name="schedule"
                className={selectCls}
                defaultValue=""
              >
                <option value="" disabled>
                  選択してください
                </option>
                {SCHEDULE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

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

            <ProductSpecificFields slug={product.slug} />

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

        {/* Resource cross-sell */}
        <section data-reveal className="bg-beige base-px py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-normal">
            もっと詳しく知りたい方へ
          </h3>
          <p className="mt-3 text-base text-neutral-700">
            製品仕様や事例集をPDFでご覧いただけます。
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href={`/monochrome/download/${product.slug}`}
              className="button-base button-outline"
            >
              {product.name} 資料ダウンロード
            </Link>
          </div>
        </section>

        {/* Related products */}
        <section data-reveal className="base-px py-12">
          <h3 className="text-base font-medium mb-6">他の製品はこちら</h3>
          <div data-reveal-stagger className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/monochrome/contact/${p.slug}`}
                className="border border-neutral-200 hover:border-black transition-colors p-6 flex flex-col gap-3"
              >
                <div
                  className="aspect-[4/3] bg-neutral-100"
                  aria-hidden
                />
                <span className="text-base font-medium text-neutral-900">
                  {p.name}
                </span>
                <span className="text-xs text-neutral-500 leading-relaxed">
                  {p.tagline}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
