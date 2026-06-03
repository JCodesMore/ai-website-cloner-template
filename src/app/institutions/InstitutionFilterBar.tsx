"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { institutionTypes } from "@/lib/product-utils";
import { FilterRow } from "@/components/FilterRow";

const sorts = [
  { label: "产品最多", ob: "productNum", od: "desc" },
  { label: "产品最少", ob: "productNum", od: "asc" },
];

function InstitutionFilterInner() {
  const sp = useSearchParams();
  const ik = sp.get("ik") || "";
  const wd = sp.get("wd") || "";
  const ob = sp.get("ob") || "";
  const od = sp.get("od") || "";

  const buildHref = (param: string, val: string) => {
    const p = new URLSearchParams();
    if (wd) p.set("wd", wd);
    if (param === "ik") {
      if (ob) { p.set("ob", ob); p.set("od", od); }
    }
    if (val) p.set(param, val);
    return p.toString() ? `/institutions?${p}` : "/institutions";
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <FilterRow title="机构类型" param="ik" value={ik} options={institutionTypes} buildHref={buildHref} />

      <div className="flex items-start gap-3">
        <span className="mt-1.5 shrink-0 text-sm text-slate-500">产品排序</span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
          {sorts.map((sort) => {
            const active = (ob === sort.ob && od === sort.od) || (!ob && sort.ob === "productNum" && sort.od === "desc");
            const sp = new URLSearchParams();
            sp.set("ob", sort.ob);
            sp.set("od", sort.od);
            if (ik) sp.set("ik", ik);
            if (wd) sp.set("wd", wd);
            return (
              <a
                key={sort.label}
                href={`/institutions?${sp}`}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {sort.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function InstitutionFilterBar() {
  return (
    <Suspense fallback={<div className="mb-5 h-[88px] animate-pulse rounded-lg bg-slate-100" />}>
      <InstitutionFilterInner />
    </Suspense>
  );
}
