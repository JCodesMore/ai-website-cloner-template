"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

interface BannerProps {
  productCount?: number;
  commentCount?: number;
}

export default function Banner({ productCount = 816, commentCount = 0 }: BannerProps) {
  const router = useRouter();
  const [wd, setWd] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!wd.trim()) return;
    router.push(`/products/search?wd=${encodeURIComponent(wd.trim())}`);
  }

  return (
    <section className="bg-slate-900 py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-lg text-slate-300 md:text-xl">
          已收录全网{" "}
          <strong className="text-3xl font-bold text-white md:text-4xl">
            {productCount.toLocaleString()}
          </strong>{" "}
          个贷款产品
          {commentCount > 0 && (
            <span className="text-slate-400">
              ，基于{" "}
              <strong className="font-semibold text-emerald-400">
                {commentCount.toLocaleString()}
              </strong>{" "}
              条真实用户评论
            </span>
          )}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          用数据说话，用口碑导航 — 找贷款先查银脉圈
        </p>
        <form
          className="mx-auto mt-6 flex max-w-xl items-center"
          onSubmit={handleSubmit}
        >
          <input
            className="h-11 flex-1 rounded-l-lg border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
            type="text"
            name="wd"
            value={wd}
            onChange={(e) => setWd(e.target.value)}
            placeholder="请输入产品名称或机构名称"
          />
          <button
            className="flex h-11 items-center gap-1.5 rounded-r-lg bg-emerald-600 px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700 cursor-pointer"
            type="submit"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            搜索
          </button>
        </form>
      </div>
    </section>
  );
}
