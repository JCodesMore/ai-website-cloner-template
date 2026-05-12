import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  bg?: string;
  crumbs?: BreadcrumbItem[];
}

export function PageHero({
  title,
  bg = "/img/bg/bg-03.jpg",
  crumbs,
}: PageHeroProps) {
  const trail = crumbs ?? [{ label: "Home", href: "/" }, { label: title }];

  return (
    <section className="relative overflow-hidden">
      <div
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* Left-to-right secondary overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-secondary/85 from-30% via-secondary/45 via-60% to-transparent"
        />
        <div className="yo-container relative z-10 py-28 lg:py-36 pt-[200px] lg:pt-[240px]">
          <h1 className="yo-headline-split text-white text-[40px] md:text-[52px] lg:text-[64px] leading-none mb-5">
            {title}
          </h1>
          <ol className="flex flex-wrap items-center gap-2 text-white/90 text-sm font-semibold">
            {trail.map((item, idx) => (
              <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-primary">{item.label}</span>
                )}
                {idx < trail.length - 1 && (
                  <span aria-hidden className="text-white/40">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Decorative ambient shapes */}
      <span
        aria-hidden
        className="hidden sm:block absolute bottom-10 left-[5%] z-10 size-3 border-2 border-primary yo-anim-x"
      />
      <span
        aria-hidden
        className="hidden sm:block absolute top-1/4 right-[20%] z-10 size-3 rounded-full bg-primary yo-anim-drift"
      />
    </section>
  );
}
