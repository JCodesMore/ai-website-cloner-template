import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SMART_ENERGY = [
  {
    name: "Energy-1",
    image: "/clones/monochrome/images/products/energy_1.jpg",
    imageAlt: "Energy-1 HEMS device",
    subtitle: "電力コストを下げ、災害時に家族を守るHEMS",
    detailHref: "/energy-1",
    consultHref: "/contact",
  },
  {
    name: "モノクローム電力",
    image: "/clones/monochrome/images/products/energy_2.jpg",
    imageAlt: "Monochrome electricity plan",
    subtitle: "環境に貢献し、電気代がお得になる電力プラン",
    detailHref: "/electricity",
    consultHref: "/contact",
  },
];

export function SmartEnergySection() {
  return (
    <section
      data-reveal
      className={cn(
        "relative pt-16 border-t border-black-10 md:pt-30 base-px py-16 md:py-20 lg:py-30",
      )}
    >
      <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] mb-10 lg:mb-14">
        エネルギーをかしこく使う
      </h2>
      <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-12">
        {SMART_ENERGY.map((item) => (
          <article key={item.name} className="flex flex-col">
            <h3 className="text-[1.5rem] lg:text-[1.75rem] font-normal mb-4">
              {item.name}
            </h3>
            <div className="relative aspect-[5/3] overflow-hidden bg-[#f5f5f3]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                className="object-cover"
              />
            </div>
            <footer className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mt-4">
              <p className="text-sm text-[#141419]/60">{item.subtitle}</p>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={item.detailHref}
                  className="button-base button-outline"
                >
                  詳しく見る
                </Link>
                <Link
                  href={item.consultHref}
                  className="button-base button-fill"
                >
                  相談する
                </Link>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
