"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { institutionTypes } from "@/lib/product-utils";

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
          const active = (!value && !opt.value) || value === opt.value;
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
