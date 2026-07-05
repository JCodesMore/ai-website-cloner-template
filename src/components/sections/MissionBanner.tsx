import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function MissionBanner() {
  return (
    <section className="px-4 sm:px-6">
      <div className="relative mx-auto h-[320px] w-full max-w-[1400px] overflow-hidden rounded-2xl sm:h-[420px]">
        <Image
          src="/images/onday/Mosaique_site_internet.png"
          alt="Personne profitant d'un moment en pleine nature"
          fill
          sizes="(max-width: 768px) 100vw, 1400px"
          className="object-cover"
          priority
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />

        <div className="relative flex h-full flex-col justify-end p-6 sm:p-12">
          <h2 className="font-heading text-[22px] leading-tight text-white sm:text-[32px]">
            Le partenaire invisible de vos journées{" "}
            <em className="italic">chargées.</em>
          </h2>
          <h3 className="font-heading mt-1 text-[22px] leading-tight text-white sm:text-[28px]">
            Pour que chaque jour soit un jour{" "}
            <em className="text-[#e0ff0c] italic">on</em>
          </h3>

          <Link
            href="/pages/mission"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white py-2 pr-2 pl-5 text-sm font-medium text-[#003D2A] transition-transform hover:scale-[1.02]"
          >
            Notre mission
            <span className="flex size-7 items-center justify-center rounded-full bg-[#e0ff0c]">
              <ArrowUpRight className="size-4 text-[#003D2A]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
