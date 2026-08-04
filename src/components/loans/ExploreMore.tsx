import Link from "next/link";

import { cn } from "@/lib/utils";

/** One `.sel-explore-link` anchor. */
export interface ExploreLink {
  label: string;
  href: string;
}

interface ExploreMoreProps {
  /** Rendered as `.sel-explore-link` anchors, in order. */
  links: readonly ExploreLink[];
  /** Defaults to the source's "Explore more". */
  label?: string;
  /** Extra classes merged onto the outer `<section>`. */
  className?: string;
}

/**
 * `section.sel-explore` — the footer-adjacent "Explore more" rail.
 *
 * Ships identically on `/self-employed-loans` and `/low-doc-loans` (same class names, same CSS,
 * only the three destinations differ), so it lives here rather than beside either page.
 *
 * `#e63946` is a fourth red, distinct from the brand `#bc1a1a` — see
 * `docs/research/components/loan-pages.spec.md` §2.
 *
 * Neither `.sel-explore-label` nor `.sel-explore-link` declares a `line-height`, so both sit on
 * Webflow's 20px body line box.
 */
export function ExploreMore({ links, label = "Explore more", className }: ExploreMoreProps) {
  return (
    <section
      className={cn(
        "border-t border-[#e0e0e0] bg-[#f5f5f5] px-[24px] pt-[32px] pb-[64px] font-inter",
        "max-[768px]:px-[16px]",
        className,
      )}
    >
      <div className="mx-auto max-w-[700px] text-center font-inter max-[768px]:px-[16px]">
        <p className="m-0 mb-[16px] font-inter text-[13px] leading-[20px] text-[#999999]">
          {label}
        </p>

        <div className="flex flex-wrap justify-center gap-[32px] font-inter max-[768px]:flex-col max-[768px]:items-center">
          {links.map(({ label: linkLabel, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[15px] leading-[20px] font-semibold text-[#e63946] no-underline"
            >
              {linkLabel}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
