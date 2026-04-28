import Link from "next/link";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon } from "../components/icons";
import { submitNewsletter } from "../_actions/forms";

export const metadata = { title: "ニュースレター登録 | Monochrome" };

type NewsItem = {
  date: string;
  badge: string;
  title: string;
  href: string;
};

const NEWS: NewsItem[] = [
  {
    date: "2026.4.27",
    badge: "プレスリリース",
    title:
      "モノクローム、HEMS「Energy-1」がみらいエコ住宅2026事業（GX志向型住宅）に対応。工事不要で補助金要件を一体で満たせる提案を強化-AIF認証を取得。発電から制御まで一体提案を強化",
    href: "/monochrome/press/202604-aif",
  },
  {
    date: "2026.4.22",
    badge: "プレスリリース",
    title:
      "モノクローム、シリーズB資金調達を実施-建材一体型太陽光パネル開発スタートアップ。プロダクトから体験へ。一棟からまちへ。",
    href: "/monochrome/press/202604-funding-b",
  },
  {
    date: "2026.4.14",
    badge: "採用情報",
    title: "採用情報",
    href: "/monochrome/press/recruit",
  },
];

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group grid items-baseline gap-3 border-t border-neutral-200 py-4 md:gap-6",
        "grid-cols-[80px_1fr_24px] md:grid-cols-[100px_140px_1fr_24px]",
      )}
    >
      <span className="text-sm text-neutral-500">{item.date}</span>
      <span className="hidden w-fit items-center rounded-full border border-neutral-400 px-3 py-0.5 text-xs text-neutral-700 md:inline-flex">
        {item.badge}
      </span>
      <span className="text-sm leading-[1.6] text-neutral-900">
        {item.title}
      </span>
      <span className="justify-self-end text-neutral-400 transition-colors group-hover:text-neutral-900">
        <ArrowRightIcon />
      </span>
    </Link>
  );
}

export default function NewsletterPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section data-reveal className="max-w-2xl mx-auto base-px py-24 md:py-32">
          <h1 className="text-3xl md:text-4xl font-normal mb-4 text-neutral-900">
            ニュースレター登録
          </h1>
          <p className="text-base text-neutral-600 mb-10 leading-relaxed">
            モノクローム製品に関するお知らせをご希望のお客様は、以下よりメールアドレスをご登録ください。
          </p>

          <form action={submitNewsletter} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="newsletter-email"
                className="text-sm text-neutral-800"
              >
                メールアドレス <span aria-hidden>*</span>
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="example@email.com"
                className="w-full border border-neutral-300 px-4 py-3 text-base focus:border-black focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="button-base button-fill w-full justify-center mt-2"
            >
              登録する
            </button>

            <p className="text-xs text-neutral-500 mt-3">
              ご登録いただいたメールアドレスは
              <Link
                href="/monochrome/privacy-policy"
                className="underline underline-offset-2 hover:text-neutral-800"
              >
                プライバシーポリシー
              </Link>
              に従って取り扱います。
            </p>
          </form>

          <section data-reveal className="mt-20">
            <h2 className="mb-2 text-base font-normal text-neutral-900">
              ニュースリリース
            </h2>
            <div data-reveal-stagger>
              {NEWS.map((item) => (
                <NewsRow key={item.href} item={item} />
              ))}
            </div>
            <div className="border-t border-neutral-200" aria-hidden />
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
