import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "ありがとうございます | Monochrome",
  robots: { index: false, follow: false },
};

type SearchParams = {
  form?: string;
  product?: string;
  status?: string;
};

type PageProps = { searchParams: Promise<SearchParams> };

const PRODUCT_NAMES: Record<string, string> = {
  roof: "Roof–1",
  wall: "Wall–1",
  panel: "Panel–B",
  energy: "Energy–1",
  power: "モノクローム電力",
};

function getCopy(sp: SearchParams): { title: string; body: string } {
  const isError = sp.status === "error";

  if (isError) {
    return {
      title: "入力内容に問題がありました",
      body: "必須項目が未入力か、メールアドレスの形式が正しくありません。お手数ですが前のページに戻って再度ご確認ください。",
    };
  }

  if (sp.form === "contact") {
    const productName = sp.product ? PRODUCT_NAMES[sp.product] : undefined;
    const productLine = productName
      ? `${productName} に関するお問い合わせを承りました。`
      : "お問い合わせを承りました。";
    return {
      title: "ありがとうございます。",
      body: `${productLine}担当者より3営業日以内にご連絡いたします。お急ぎの場合は support@monochrome.so までご連絡ください。`,
    };
  }

  if (sp.form === "newsletter") {
    return {
      title: "ありがとうございます。",
      body: "ご登録いただきありがとうございます。確認メールをお送りしましたのでご確認ください。",
    };
  }

  if (sp.form === "builder") {
    return {
      title: "ありがとうございます。",
      body: "工務店パートナー応募を受け付けました。担当者より約1ヶ月以内にご連絡します。",
    };
  }

  return {
    title: "ありがとうございます。",
    body: "ご送信いただきありがとうございます。担当者より追ってご連絡いたします。",
  };
}

export default async function ThanksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { title, body } = getCopy(sp);
  const isError = sp.status === "error";

  return (
    <>
      <SiteHeader />
      <main>
        <section data-reveal className="max-w-2xl mx-auto base-px py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            {isError ? "Error" : "Thank you"}
          </p>
          <h1 className="text-3xl md:text-4xl font-normal mt-4">{title}</h1>
          <p className="mt-6 text-base text-neutral-700 leading-relaxed">
            {body}
          </p>
          <div className="mt-12 flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link
              href="/monochrome"
              className="button-base button-fill w-full md:w-auto justify-center"
            >
              ホームへ戻る
            </Link>
            <Link
              href="/monochrome/journal"
              className="button-base button-outline w-full md:w-auto justify-center"
            >
              ジャーナルを読む
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
