"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { institutionTypes } from "@/lib/product-utils";
import { FilterRow } from "@/components/FilterRow";

const tags = [
  { label: "全部", value: "" },
  { label: "专精特新", value: "24" },
  { label: "国高新", value: "25" },
  { label: "科技类", value: "26" },
  { label: "创新类", value: "27" },
  { label: "涉农类", value: "29" },
  { label: "小巨人", value: "37" },
  { label: "专利贷", value: "38" },
];

const advantages = [
  { label: "全部", value: "" },
  { label: "3-5年", value: "35" },
  { label: "国有银行", value: "40" },
  { label: "先息后本", value: "41" },
  { label: "法人不连带", value: "42" },
  { label: "法人不占股", value: "44" },
  { label: "轻视征信", value: "51" },
  { label: "负债高", value: "58" },
  { label: "线下", value: "60" },
];

function CompanyFilterInner() {
  const sp = useSearchParams();
  const ik = sp.get("ik") || "";
  const tag = sp.get("tag") || "";
  const adv = sp.get("adv") || "";

  const buildHref = (param: string, val: string) => {
    const p = new URLSearchParams();
    if (param === "ik") {
      if (tag) p.set("tag", tag);
      if (adv) p.set("adv", adv);
    } else if (param === "tag") {
      if (ik) p.set("ik", ik);
      if (adv) p.set("adv", adv);
    } else if (param === "adv") {
      if (ik) p.set("ik", ik);
      if (tag) p.set("tag", tag);
    }
    if (val) p.set(param, val);
    return p.toString() ? `/products/company?${p}` : "/products/company";
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <FilterRow title="机构类型" param="ik" value={ik} options={institutionTypes} buildHref={buildHref} />
      <FilterRow title="企业标签" param="tag" value={tag} options={tags} buildHref={buildHref} />
      <FilterRow title="产品优势" param="adv" value={adv} options={advantages} buildHref={buildHref} />
    </div>
  );
}

export default function CompanyFilterBar() {
  return (
    <Suspense fallback={<div className="mb-5 h-[140px] animate-pulse rounded-lg bg-slate-100" />}>
      <CompanyFilterInner />
    </Suspense>
  );
}
