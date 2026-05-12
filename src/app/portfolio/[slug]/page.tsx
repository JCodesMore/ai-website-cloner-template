import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { PORTFOLIO } from "@/lib/pages-content";

export function generateStaticParams() {
  return PORTFOLIO.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = PORTFOLIO.find((p) => p.slug === slug);
  return { title: item ? `${item.title} — VertexLink` : "Portfolio — VertexLink" };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = PORTFOLIO.find((p) => p.slug === slug);
  if (!item) notFound();

  const idx = PORTFOLIO.findIndex((p) => p.slug === slug);
  const prev = PORTFOLIO[(idx - 1 + PORTFOLIO.length) % PORTFOLIO.length];
  const next = PORTFOLIO[(idx + 1) % PORTFOLIO.length];

  return (
    <>
      <PageHero
        title={item.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Portfolio", href: "/portfolio" },
          { label: item.title },
        ]}
      />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <Image
            src={item.image}
            alt={item.title}
            width={1400}
            height={800}
            className="w-full rounded-[10px] mb-12"
          />

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <span className="text-primary font-bold text-sm uppercase tracking-wider mb-3 block">
                {item.category}
              </span>
              <h2 className="yo-headline-split text-[36px] md:text-[44px] leading-none mb-6">
                {item.title}
              </h2>
              <p className="text-body mb-5 leading-[1.8]">
                VertexLink partnered with a regional carrier to deploy {item.title.toLowerCase()} across
                three districts. The result: 30% better latency, 50% fewer support tickets, and a happier
                community of subscribers who finally stopped worrying about their connection.
              </p>
              <p className="text-body mb-8 leading-[1.8]">
                Our team designed, installed, and now monitors the live network 24/7 from our operations
                centre. We tuned every backbone, every uplink, every router — so neighbourhoods can focus
                on what they actually want to do online.
              </p>

              <h3 className="text-2xl font-extrabold mb-5">Project highlights</h3>
              <ul className="grid sm:grid-cols-2 gap-3 mb-12">
                {[
                  "Full-fibre last-mile",
                  "Redundant uplinks per node",
                  "24/7 NOC monitoring",
                  "30-day SLA refund guarantee",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckIcon className="size-5 text-primary shrink-0 mt-1" />
                    <span className="font-bold">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-4">
              <div className="bg-light rounded-[10px] p-6">
                <h4 className="text-xl font-extrabold mb-5 flex items-center gap-2">
                  <span className="text-primary">|</span>Project Details
                </h4>
                <dl className="space-y-4 text-sm">
                  <div className="flex justify-between gap-4 pb-3 border-b border-black/10">
                    <dt className="font-bold">Category</dt>
                    <dd>{item.category}</dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-3 border-b border-black/10">
                    <dt className="font-bold">Client</dt>
                    <dd>VertexLink Network</dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-3 border-b border-black/10">
                    <dt className="font-bold">Duration</dt>
                    <dd>3 months</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-bold">Year</dt>
                    <dd>2025</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-16 pt-10 border-t border-black/10">
            <Link href={`/portfolio/${prev.slug}`} className="group flex items-center gap-4">
              <Image src={prev.image} alt="" width={100} height={80} className="w-20 h-16 object-cover rounded-md shrink-0" />
              <div>
                <span className="text-xs uppercase text-body">← Previous</span>
                <h5 className="font-extrabold group-hover:text-primary transition-colors line-clamp-1">
                  {prev.title}
                </h5>
              </div>
            </Link>
            <Link href={`/portfolio/${next.slug}`} className="group flex items-center gap-4 sm:justify-end sm:text-right">
              <div className="sm:order-2">
                <span className="text-xs uppercase text-body">Next →</span>
                <h5 className="font-extrabold group-hover:text-primary transition-colors line-clamp-1">
                  {next.title}
                </h5>
              </div>
              <Image src={next.image} alt="" width={100} height={80} className="w-20 h-16 object-cover rounded-md shrink-0 sm:order-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
