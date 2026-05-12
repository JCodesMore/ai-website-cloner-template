import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { PORTFOLIO } from "@/lib/pages-content";

export const metadata = { title: "Portfolio — VertexLink" };

export default function PortfolioPage() {
  return (
    <>
      <PageHero title="Portfolio" />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="text-center mb-16">
            <span className="yo-subtitle">Our Portfolio</span>
            <h2 className="yo-headline-split text-[36px] md:text-[44px] lg:text-[48px] leading-none mt-5 max-w-2xl mx-auto">
              Projects that <span className="light">power our community</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO.map((p) => (
              <Link
                key={p.slug}
                href={`/portfolio/${p.slug}`}
                className="group block relative overflow-hidden rounded-[10px]"
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  width={600}
                  height={500}
                  className="w-full aspect-[6/5] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/0 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 block">
                    {p.category}
                  </span>
                  <h3 className="text-2xl font-extrabold">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
