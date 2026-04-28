import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TourSection() {
  return (
    <section
      className={cn(
        "relative py-20 md:py-30 lg:py-40 base-px bg-beige"
      )}
    >
      <h2 className="text-[2rem] font-normal mb-12">見学会</h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-8 items-center">
        <div className="md:col-span-6 lg:col-span-5 relative aspect-[4/3] overflow-hidden">
          <Image
            src="/images/event.jpg"
            alt="開催中の見学会の様子"
            fill
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="md:col-span-6 lg:col-span-7 lg:pl-8">
          <h3 className="text-[1.5rem] md:text-[1.75rem] font-normal leading-[1.5] mb-6">
            ただいま開催予定の見学会はございません。
          </h3>
          <p className="text-sm md:text-base leading-[1.8] text-[#141419]/60 mb-10 whitespace-pre-line">
            {`最新のイベント情報はニュースレターにて配信を行なっております。\nまた見学会に関するご質問はお問い合わせフォームよりお願いします。`}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/newsletter" className="button-base button-fill">
              ニュースレター
            </Link>
            <Link href="/contact" className="button-base button-fill">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
