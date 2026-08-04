import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Type scale notes (mirrors the FundUp Webflow token set):
 *
 *   h1 scale  5.65 / 4.52 / 3.62 / 2.89 rem  — far too large for long-form legal copy
 *   h2 scale  2.83 / 2.26 / 1.81 / 1.45 rem  — used here for the page title
 *   h3 scale  2.00 / 1.60 / 1.28 / 1.02 rem  — used here for numbered clause headings
 *   h4 scale  1.41 / 1.27 / 1.15 / 1.03 rem  — used here for decimal sub-clauses
 *
 * The site's Webflow breakpoints are max-width 991 / 767 / 479, so mobile-first
 * they become base -> min-[480px] -> md (768px) -> min-[992px].
 */

const PAGE_TITLE_CLASSES = cn(
  "font-heading text-foreground",
  "font-semibold leading-[1.04] tracking-[-0.01em]",
  // `min-[768px]:` not `md:` — Tailwind v4 emits every arbitrary min-width block before the
  // named breakpoints, so a `md:` rule out-cascades its `min-[992px]:` counterpart at ≥992px.
  "text-[1.45rem] min-[480px]:text-[1.81rem] min-[768px]:text-[2.26rem] min-[992px]:text-[2.83rem]",
);

const PROSE_CLASSES = [
  // Body copy.
  "text-base leading-[1.6] text-foreground",
  "[&_p]:mb-5 [&_p:last-child]:mb-0",
  "[&_strong]:font-semibold",
  // Bulleted lists inside a clause.
  "marker:text-muted-foreground",
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul:last-child]:mb-0",
  "[&_li]:mb-2 [&_li:last-child]:mb-0",
  // Numbered clause headings (h3 type scale, weight 500).
  "[&_h2]:font-heading [&_h2]:mb-6 [&_h2]:font-medium [&_h2]:leading-[1.04] [&_h2]:tracking-[-0.01em]",
  "[&_h2]:text-[1.02rem] min-[480px]:[&_h2]:text-[1.28rem] min-[768px]:[&_h2]:text-[1.6rem] min-[992px]:[&_h2]:text-[2rem]",
  // Decimal sub-clause headings (h4 type scale, weight 600).
  "[&_h3]:font-heading [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:font-semibold [&_h3]:leading-[1.3] [&_h3]:tracking-[-0.01em]",
  "[&_h3]:text-[1.03rem] min-[480px]:[&_h3]:text-[1.15rem] min-[768px]:[&_h3]:text-[1.27rem] min-[992px]:[&_h3]:text-[1.41rem]",
  "[&_h2+h3]:mt-0",
  // Generous separation between numbered sections.
  "[&>section+section]:mt-14 md:[&>section+section]:mt-20",
].join(" ");

export interface LegalPageProps {
  /** Page title, rendered as the single h1. */
  title: string;
  /** Licensee / effective-date block shown directly beneath the title. */
  intro?: ReactNode;
  /** The numbered `<section>` elements that make up the document body. */
  children: ReactNode;
  /** Regulatory disclaimer printed at the foot of the document. */
  footnote?: ReactNode;
}

/**
 * Shared shell for FundUp's long-form legal documents (privacy policy, terms).
 * Plain rich text on the light surface, constrained to a readable measure.
 */
export function LegalPage({ title, intro, children, footnote }: LegalPageProps) {
  return (
    // `section-y` handles vertical rhythm at every width — except below 480px, where
    // it is only 4rem (64px) against a 57px fixed nav, leaving a cramped 7px gap.
    // The extra padding is therefore scoped to mobile and explicitly cancelled from
    // 480px up: a `pt-*` utility beats the `@layer components` rule `section-y` lives
    // in, so an unscoped one would *reduce* clearance at desktop rather than add to it.
    //
    // `text-base leading-[1.6]` is set explicitly rather than inherited: `body`
    // matches Webflow's 14px/20px, which is far too tight for long legal prose.
    // A documented divergence — see docs/research/FIXES.md.
    <main className="section-y flex-1 bg-background pt-[104px] text-base leading-[1.6] min-[480px]:pt-[var(--section-padding-y)]">
      <div className="mx-auto w-full max-w-[50rem] px-4 md:px-6">
        <header className="border-b border-border pb-8 md:pb-10">
          <h1 className={PAGE_TITLE_CLASSES}>{title}</h1>
          {intro ? (
            <div className="mt-6 space-y-1 text-sm leading-[1.6] text-muted-foreground">
              {intro}
            </div>
          ) : null}
        </header>

        <div className={cn("mt-12 md:mt-16", PROSE_CLASSES)}>{children}</div>

        {footnote ? (
          <div className="mt-16 border-t border-border pt-8 text-sm leading-[1.6] text-muted-foreground md:mt-20">
            {footnote}
          </div>
        ) : null}
      </div>
    </main>
  );
}
