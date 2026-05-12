import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { SERVICE_DETAILS } from "@/lib/pages-content";

export function generateStaticParams() {
  return SERVICE_DETAILS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICE_DETAILS.find((s) => s.slug === slug);
  return { title: service ? `${service.title} — VertexLink` : "Service — VertexLink" };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICE_DETAILS.find((s) => s.slug === slug);
  if (!service) notFound();

  const related = SERVICE_DETAILS.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <>
      <PageHero
        title={service.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="grid lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-4">
              <div className="bg-light rounded-[10px] p-6 mb-8">
                <h4 className="text-xl font-extrabold mb-5 flex items-center gap-2">
                  <span className="text-primary">|</span>All Services
                </h4>
                <ul className="space-y-1">
                  {SERVICE_DETAILS.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                          s.slug === slug
                            ? "bg-primary text-white"
                            : "bg-white hover:text-primary"
                        }`}
                      >
                        <span className="font-bold">{s.title}</span>
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative bg-secondary rounded-[10px] p-8 text-white overflow-hidden">
                <h4 className="text-xl font-extrabold mb-3">Need help?</h4>
                <p className="text-white/80 mb-5 text-sm">
                  Talk to a human about which plan fits your home or business.
                </p>
                <Link href="/contact" className="yo-btn yo-btn-primary">
                  Get a free quote
                </Link>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <Image
                src="/img/services/service-detail-01.jpg"
                alt={service.title}
                width={1200}
                height={700}
                className="w-full rounded-[10px] mb-10"
              />
              <h2 className="yo-headline-split text-[36px] md:text-[44px] leading-none mb-6">
                {service.title}
              </h2>
              {service.longDescription.map((p) => (
                <p key={p.slice(0, 30)} className="text-body mb-5 leading-[1.8]">
                  {p}
                </p>
              ))}

              <ul className="grid sm:grid-cols-2 gap-4 mt-8 mb-12">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckIcon className="size-5 text-primary shrink-0 mt-1" />
                    <span className="font-bold">{b}</span>
                  </li>
                ))}
              </ul>

              {related.length > 0 && (
                <div className="border-t border-black/10 pt-10">
                  <h3 className="text-2xl font-extrabold mb-6">Related services</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/services/${r.slug}`}
                        className="flex items-center gap-4 p-4 rounded-md bg-light hover:bg-primary/5 transition-colors"
                      >
                        <Image src={r.icon} alt="" width={40} height={40} />
                        <div>
                          <h5 className="font-extrabold">{r.title}</h5>
                          <p className="text-sm text-body line-clamp-1">{r.intro}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
