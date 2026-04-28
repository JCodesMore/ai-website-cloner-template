import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { PROJECTS } from "../project/projects";

export const metadata = { title: "施工事例 | Monochrome" };

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section data-reveal className="base-px py-16 md:py-20">
          <h1 className="text-3xl md:text-4xl font-normal">施工事例</h1>
          <p className="text-base text-neutral-600 mt-3">
            モノクローム建材を採用した、住宅・施設・公共空間のプロジェクト。
          </p>
        </section>

        <section data-reveal-stagger className="base-px py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
          {PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/monochrome/archive/project/${project.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f3]">
                <Image
                  src={project.hero}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <p className="text-base font-normal">{project.title}</p>
                <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  {project.product}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                {project.architect}
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                {project.location}
              </p>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
