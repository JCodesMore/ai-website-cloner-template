"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MonogramIcon } from "./icons";

type JournalArticle = {
  date: string;
  category: string;
  title: string;
  image: string;
  imageAlt: string;
  href: string;
  productBadge: string;
};

const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    date: "02/04",
    category: "建築家紹介",
    title:
      "【建築家インタビュー】「太陽にありがとうと言える暮らし」建築家・堀部安嗣の葉山の自邸",
    image: "/clones/monochrome/images/journal/article_1.png",
    imageAlt: "Roof-1 architect interview",
    href: "/journal/article-1",
    productBadge: "Roof-1",
  },
  {
    date: "01/28",
    category: "プロダクト",
    title: "Wall-1の魅力—外壁が発電する新しい建築の風景",
    image: "/clones/monochrome/images/journal/article_2.webp",
    imageAlt: "Wall-1 product feature",
    href: "/journal/article-2",
    productBadge: "Wall-1",
  },
  {
    date: "01/15",
    category: "施工事例",
    title: "Panel-Bを採用した最先端の住宅事例",
    image: "/clones/monochrome/images/journal/article_3.jpg",
    imageAlt: "Panel-B case study",
    href: "/journal/article-3",
    productBadge: "Panel-B",
  },
  {
    date: "01/02",
    category: "ニュース",
    title: "Energy-1で実現する次世代のエネルギーマネジメント",
    image: "/clones/monochrome/images/journal/article_4.jpg",
    imageAlt: "Energy-1 management feature",
    href: "/journal/article-4",
    productBadge: "Energy-1",
  },
];

const CYCLE_MS = 6000;

export function JournalSection() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % JOURNAL_ARTICLES.length);
    }, CYCLE_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [active]);

  const handleSelect = (index: number) => {
    setActive(index);
  };

  const current = JOURNAL_ARTICLES[active];

  return (
    <section className="py-20 md:py-20 lg:py-40 base-px text-white bg-dark overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MonogramIcon className="w-5 h-5" />
          <span className="ml-3 text-base">ジャーナル</span>
        </div>
        <Link
          href="/journal"
          className="button-base button-outline-on-dark"
        >
          一覧を見る
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-12">
        <div className="col-span-12 lg:col-span-10 relative aspect-[16/10] overflow-hidden">
          {JOURNAL_ARTICLES.map((article, i) => (
            <div
              key={article.href}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out-expo",
                i === active ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={i !== active}
            >
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="(min-width: 1024px) 83vw, 100vw"
                className="object-cover"
                priority={i === 0}
              />
              {article.productBadge ? (
                <div className="absolute left-6 top-6 flex items-center gap-2 text-white">
                  <MonogramIcon className="w-4 h-4" />
                  <span className="text-sm">{article.productBadge}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex flex-col col-span-2 gap-3">
          {JOURNAL_ARTICLES.map((article, i) => (
            <button
              key={article.href}
              type="button"
              onClick={() => handleSelect(i)}
              aria-label={`Show article ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "relative w-full aspect-square overflow-hidden transition-opacity duration-300 ease-out-expo",
                i === active
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-100",
              )}
            >
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-3xl font-normal">
        {String(active + 1).padStart(2, "0")}{" "}
        <span className="text-white/40">
          / {String(JOURNAL_ARTICLES.length).padStart(2, "0")}
        </span>
      </p>

      <h3 className="mt-4 text-xl lg:text-2xl font-normal max-w-3xl">
        {current.title}
      </h3>
      <p className="mt-2 text-sm text-white/60">
        {current.date} · {current.category}
      </p>
    </section>
  );
}
