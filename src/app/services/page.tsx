import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SERVICE_DETAILS } from "@/lib/pages-content";

export const metadata = {
  title: "Our Services — VertexLink",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Our Services" />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="text-center mb-16">
            <span className="yo-subtitle">Our Services</span>
            <h2 className="yo-headline-split text-[36px] md:text-[44px] lg:text-[48px] leading-none mt-5 max-w-3xl mx-auto">
              Everything you need to <span className="light">stay connected</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_DETAILS.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group relative bg-light rounded-[10px] p-10 transition-colors duration-300 hover:bg-primary/5"
              >
                <div className="relative w-fit mb-6">
                  <Image src={s.icon} alt="" width={60} height={60} className="relative z-10" />
                  <span
                    aria-hidden
                    className="absolute -right-4 -bottom-2 size-10 rounded-full bg-primary/15 z-0"
                  />
                </div>
                <h3 className="text-2xl font-extrabold mb-4 group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="text-body leading-[1.7]">{s.intro}</p>
                <span className="mt-6 inline-block text-primary font-bold text-sm uppercase tracking-wider">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
