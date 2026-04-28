import Link from "next/link";
import { cn } from "@/lib/utils";

const CONTACT_BLOCKS = [
  {
    title: "お問い合わせ",
    body: "モノクローム製品の購入をご検討の方は\nこちらからお問い合わせください。",
    cta: "相談する",
    href: "/contact",
  },
  {
    title: "資料請求",
    body: "モノクロームの製品資料をご覧になりたい方は\n製品資料一覧よりご確認ください。",
    cta: "資料ダウンロード",
    href: "/download",
  },
];

export function ContactSection() {
  return (
    <section data-reveal className="relative bg-gray md:flex">
      {CONTACT_BLOCKS.map((b, i) => (
        <div
          key={b.title}
          className={cn(
            "flex-1 flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32",
            i === 0 && "border-b md:border-b-0 md:border-r border-black-10",
          )}
        >
          <h2 className="text-[2rem] font-normal mb-6">{b.title}</h2>
          <p className="text-sm md:text-base leading-[1.8] text-[#141419]/60 mb-10 whitespace-pre-line">
            {b.body}
          </p>
          <Link href={b.href} className="button-base button-fill px-8 h-11">
            {b.cta}
          </Link>
        </div>
      ))}
    </section>
  );
}
