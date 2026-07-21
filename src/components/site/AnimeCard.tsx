"use client";

import Image from "next/image";
import type { AnimeCardData } from "@/types/anime";
import { useOverlay } from "@/components/overlay/OverlayProvider";

export function AnimeCard({ data }: { data: AnimeCardData }) {
  const { openDetail } = useOverlay();

  return (
    <button
      type="button"
      onClick={() => openDetail(data)}
      className="group block w-[150px] shrink-0 snap-start text-left sm:w-[172px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted transition-transform duration-300 group-hover:scale-[1.04] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
        <Image
          src={data.poster}
          alt={data.title}
          fill
          sizes="172px"
          className="object-cover"
        />
        {/* badges */}
        {data.status === "RELEASING" && (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--accent-foreground)]">
            Releasing
          </span>
        )}
        {data.episodeBadge && (
          <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            {data.episodeBadge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <h3 className="mt-2 line-clamp-2 text-[13px] font-medium leading-snug text-slate-200 transition-colors group-hover:text-accent">
        {data.title}
      </h3>
    </button>
  );
}
