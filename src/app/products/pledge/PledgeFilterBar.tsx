"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { institutionTypes } from "@/lib/product-utils";
import { FilterRow } from "@/components/FilterRow";

function PledgeFilterInner() {
  const sp = useSearchParams();
  const ik = sp.get("ik") || "";

  const buildHref = (_param: string, val: string) => {
    const p = new URLSearchParams();
    if (val) p.set("ik", val);
    return p.toString() ? `/products/pledge?${p}` : "/products/pledge";
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <FilterRow title="机构类型" param="ik" value={ik} options={institutionTypes} buildHref={buildHref} />
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
