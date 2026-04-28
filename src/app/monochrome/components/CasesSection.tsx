import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FeaturedArchitect = {
  name: string;
  image: string;
  href: string;
};

const FEATURED_ARCHITECTS: FeaturedArchitect[] = [
  { name: "SUEP.", image: "/clones/monochrome/images/architects/01.jpg", href: "/monochrome/archive/project/kazeno-ie" },
  {
    name: "Suppose Design Office",
    image: "/clones/monochrome/images/architects/02.jpg",
    href: "/monochrome/archive/project/azabu-no-ie",
  },
  {
    name: "中川エリカ建築設計事務所",
    image: "/clones/monochrome/images/architects/03.jpg",
    href: "/monochrome/archive/project/Akiya-A",
  },
];

const TEXT_ARCHITECTS = [
  "山本健悟建築設計室",
  "能作文徳建築設計事務所＋Studio mnm",
  "DRAWERS",
  "lyhty",
  "NOT A HOTEL株式会社",
  "ミサワホーム株式会社",
  "ツバメアーキテクツ",
  "スキーマ建築計画",
];

export function CasesSection() {
  return (
    <section data-reveal className="relative py-20 md:py-30 lg:py-40 base-px">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-[2rem] font-normal leading-[1.4]">
          モノクローム施工事例
        </h2>
        <Link href="/monochrome/archive/projects" className="button-base button-outline">
          一覧を見る
        </Link>
      </div>

      <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
        {FEATURED_ARCHITECTS.map((architect) => (
          <a
            key={architect.name}
            href={architect.href}
            className="group block"
          >
            <div className="border-t border-black-10 pt-4">
              <p className="text-base font-normal mb-6">{architect.name}</p>
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f3]">
                <Image
                  src={architect.image}
                  alt={architect.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={cn(
                    "object-cover",
                    // Always visible; subtle zoom on hover at lg+
                    "opacity-100 scale-100",
                    "lg:transition-transform lg:duration-700 lg:ease-out-cubic",
                    "group-hover:lg:scale-105"
                  )}
                />
              </div>
            </div>
          </a>
        ))}
      </div>

      <ul className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-x-8 lg:items-start">
        <li className="lg:col-span-1">
          <ul data-reveal-stagger>
            {TEXT_ARCHITECTS.map((name) => (
              <li
                key={name}
                className="border-t border-black-10 py-4 text-base font-normal"
              >
                {name}
              </li>
            ))}
            {/* close the bottom border */}
            <li className="border-t border-black-10 h-0" aria-hidden />
          </ul>
        </li>
      </ul>
    </section>
  );
}
