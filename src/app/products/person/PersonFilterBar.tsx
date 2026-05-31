"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { institutionTypes } from "@/lib/product-utils";
import { FilterRow } from "@/components/FilterRow";

const advantages = [
  { label: "全部", value: "" },
  { label: "极速下款", value: "45" },
  { label: "社保公积金", value: "46" },
  { label: "征信宽松", value: "53" },
  { label: "3-5年", value: "54" },
  { label: "先息后本", value: "55" },
  { label: "线下", value: "61" },
  { label: "消费分期", value: "62" },
];

function PersonFilterInner() {
  const sp = useSearchParams();
  const ik = sp.get("ik") || "";
  const adv = sp.get("adv") || "";

  const buildHref = (param: string, val: string) => {
    const p = new URLSearchParams();
    if (param === "ik" && adv) p.set("adv", adv);
    else if (param === "adv" && ik) p.set("ik", ik);
    if (val) p.set(param, val);
    return p.toString() ? `/products/person?${p}` : "/products/person";
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <FilterRow title="机构类型" param="ik" value={ik} options={institutionTypes} buildHref={buildHref} />
      <FilterRow title="产品优势" param="adv" value={adv} options={advantages} buildHref={buildHref} />
    </div>
  );
}

export default function PersonFilterBar() {
  return (
    <Suspense fallback={<div className="mb-5 h-[88px] animate-pulse rounded-lg bg-slate-100" />}>
      <PersonFilterInner />
    </Suspense>
  );
}
