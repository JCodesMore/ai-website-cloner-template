"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ARTICLES } from "./articles";

const CATEGORIES = [
  "全て",
  "施主インタビュー",
  "建築家紹介",
  "ものづくりコラム",
  "社員紹介（採用）",
] as const;

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState<string>("全て");

  const filtered =
    activeCategory === "全て"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <>
      <SiteHeader />
      <main>
        <section data-reveal className="base-px py-16 md:py-20">
          <h1 className="text-3xl md:text-4xl font-normal">ジャーナル</h1>
          <p className="text-base text-neutral-600 mt-3">
            モノクロームが届ける、未来の景色をめぐる読み物。
          </p>
        </section>

        <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 base-px py-4">
          <div className="flex gap-6 overflow-x-auto whitespace-nowrap">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-black border-b-2 border-black pb-1"
                      : "text-neutral-500 hover:text-black",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <section data-reveal-stagger className="base-px py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {filtered.map((article) => {
            const href = `/monochrome/journal/${article.slug}`;
            return (
              <Link key={article.slug} href={href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f3]">
                  <Image
                    src={article.hero}
                    alt={article.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-xs text-neutral-500">
                  {article.category}
                </p>
                <p className="mt-2 text-base font-normal leading-relaxed">
                  {article.title}
                </p>
                <p className="mt-1 text-xs text-neutral-500">{article.date}</p>
              </Link>
            );
          })}
        </section>

        <div className="mt-16 flex justify-center pb-20">
          <button type="button" className="button-base button-outline">
            もっと見る
          </button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
