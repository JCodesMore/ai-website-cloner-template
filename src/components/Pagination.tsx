"use client";

import Link from "next/link";
import { PAGINATION_WINDOW } from "@/lib/constants";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  extraParams?: string;
  onPage?: (page: number) => void;
}

function getWindowPages(current: number, total: number, win: number): (number | "...")[] {
  if (total <= win + 2) return Array.from({ length: total }, (_, i) => i + 1);

  const half = Math.floor(win / 2);
  let start = current - half;
  let end = current + half;

  if (start < 2) { start = 1; end = Math.min(win, total - 1); }
  if (end > total - 1) { end = total; start = Math.max(total - win + 1, 2); }

  const result: (number | "...")[] = [1];
  if (start > 2) result.push("...");
  for (let i = start; i <= end; i++) {
    if (i > 1 && i < total) result.push(i);
  }
  if (end < total - 1) result.push("...");
  if (total > 1) result.push(total);
  return result;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseHref,
  extraParams = "",
  onPage,
}: PaginationProps) {
  const pages = getWindowPages(currentPage, totalPages, PAGINATION_WINDOW);
  const connector = baseHref.includes("?") ? "&" : "?";
  const sep = extraParams
    ? extraParams.startsWith("&")
      ? extraParams
      : `&${extraParams}`
    : "";

  const href = (page: number) =>
    onPage ? "#" : `${baseHref}${connector}page=${page}${sep}`;

  const handleClick = (page: number) => (e: React.MouseEvent) => {
    if (onPage) {
      e.preventDefault();
      onPage(page);
    }
  };

  const linkClass =
    "inline-flex h-9 min-w-[36px] items-center justify-center rounded-md px-3 text-sm text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900";
  const activeClass =
    "inline-flex h-9 min-w-[36px] items-center justify-center rounded-md px-3 text-sm font-semibold bg-slate-900 text-white";
  const disabledClass =
    "inline-flex h-9 min-w-[36px] items-center justify-center rounded-md px-3 text-sm text-slate-300 cursor-not-allowed";

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link className={linkClass} href={href(1)} onClick={handleClick(1)}>
          首页
        </Link>
      ) : (
        <span className={disabledClass}>首页</span>
      )}
      {currentPage > 1 ? (
        <Link className={linkClass} href={href(currentPage - 1)} onClick={handleClick(currentPage - 1)}>
          上一页
        </Link>
      ) : (
        <span className={disabledClass}>上一页</span>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="inline-flex h-9 w-9 items-center justify-center text-sm text-slate-400">…</span>
        ) : p === currentPage ? (
          <span className={activeClass} key={p}>
            {p}
          </span>
        ) : (
          <Link className={linkClass} key={p} href={href(p)} onClick={handleClick(p)}>
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages ? (
        <Link className={linkClass} href={href(currentPage + 1)} onClick={handleClick(currentPage + 1)}>
          下一页
        </Link>
      ) : (
        <span className={disabledClass}>下一页</span>
      )}
      {currentPage < totalPages ? (
        <Link className={linkClass} href={href(totalPages)} onClick={handleClick(totalPages)}>
          尾页
        </Link>
      ) : (
        <span className={disabledClass}>尾页</span>
      )}
    </nav>
  );
}
