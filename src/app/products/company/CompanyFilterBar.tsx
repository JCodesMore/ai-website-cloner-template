"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { institutionTypes } from "@/lib/product-utils";

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

function FilterRow({
  title,
  options,
  param,
  value,
  buildHref,
}: {
  title: string;
  options: readonly { label: string; value: string }[];
  param: string;
  value: string;
  buildHref: (param: string, value: string) => string;
}) {
  return (
    <div className="mb-3 flex items-start gap-3 last:mb-0">
      <span className="mt-1.5 shrink-0 text-sm text-slate-500">{title}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active =
            (!value && !opt.value) || value === opt.value;
          return (
            <a
              key={opt.value}
              href={buildHref(param, opt.value)}
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
  );
}

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
