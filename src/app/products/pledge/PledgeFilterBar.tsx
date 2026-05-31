"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { institutionTypes } from "@/lib/product-utils";

function PledgeFilterInner() {
  const sp = useSearchParams();
  const ik = sp.get("ik") || "";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 shrink-0 text-sm text-slate-500">机构类型</span>
        <div className="flex flex-wrap gap-1.5">
          {institutionTypes.map((opt) => {
            const active = (!ik && !opt.value) || ik === opt.value;
            const p = new URLSearchParams();
            if (opt.value) p.set("ik", opt.value);
            const href = p.toString() ? `/products/pledge?${p}` : "/products/pledge";
            return (
              <a
                key={opt.value}
                href={href}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ${
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {opt.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PledgeFilterBar() {
  return (
    <Suspense fallback={<div className="mb-5 h-[52px] animate-pulse rounded-lg bg-slate-100" />}>
      <PledgeFilterInner />
    </Suspense>
  );
}
