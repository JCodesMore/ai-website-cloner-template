"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { removeEnquiry, updateEnquiryStatus } from "@/app/admin/actions";
import { ENQUIRY_STATUSES } from "@/lib/server/enquiry-statuses";
import { cn } from "@/lib/utils";
import { buttonClass } from "./ui";

const HELP: Record<string, string> = {
  new: "Not answered yet",
  contacted: "You have replied",
  booked: "Tour confirmed",
  closed: "No further action",
};

export function EnquiryActions({ id, status }: { id: number; status: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Enquiry status">
        {ENQUIRY_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={status === s}
            disabled={pending}
            onClick={() => start(() => updateEnquiryStatus(id, s))}
            className={cn(
              "rounded-lg border px-3 py-2 text-left text-sm transition disabled:opacity-60",
              status === s ? "border-[#0057a7] bg-[#0057a7]/5 ring-1 ring-[#0057a7]" : "border-slate-200 hover:bg-slate-50",
            )}
          >
            <span className="block font-medium capitalize">{s}</span>
            <span className="block text-xs text-slate-500">{HELP[s]}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={pending}
        className={cn(buttonClass.danger, "w-full")}
        onClick={() => {
          if (confirm("Delete this enquiry permanently?")) start(() => removeEnquiry(id));
        }}
      >
        <Trash2 className="size-4" /> Delete enquiry
      </button>
    </div>
  );
}
