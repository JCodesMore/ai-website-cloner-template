"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import type { AnimeRow as RowData } from "@/types/anime";
import { AnimeCard } from "./AnimeCard";

const badgeStyles: Record<string, string> = {
  HOT: "bg-red-500/15 text-red-400",
  SEASONAL: "bg-accent/15 text-accent",
  TOP: "bg-amber-500/15 text-amber-400",
  NEW: "bg-sky-500/15 text-sky-400",
};

export function AnimeRow({ row }: { row: RowData }) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <section className="relative py-5 pl-6 md:pl-[92px]">
      <div className="mb-3 flex items-center gap-3 pr-6">
        <h2 className="font-heading text-[21.6px] font-extrabold tracking-[-0.3px]">
          {row.heading}
        </h2>
        {row.badge && (
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeStyles[row.badge]}`}
          >
            {row.badge}
          </span>
        )}
        {row.viewAllHref && (
          <Link
            href={row.viewAllHref}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-accent"
          >
            View All <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>

      <div className="group relative">
        <div
          ref={scroller}
          className="row-scroll gap-3 pr-6"
        >
          {row.items.map((item) => (
            <AnimeCard key={item.id} data={item} />
          ))}
        </div>

        {/* edge arrows */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute -left-1 top-[38%] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-strong)] bg-background/80 opacity-0 backdrop-blur transition-opacity hover:bg-background group-hover:opacity-100"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute right-5 top-[38%] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border-strong)] bg-background/80 opacity-0 backdrop-blur transition-opacity hover:bg-background group-hover:opacity-100"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
