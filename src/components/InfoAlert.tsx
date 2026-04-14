"use client";

import { useState } from "react";
import { CloseIcon, InfoIcon } from "@/components/icons";

export function InfoAlert() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <section
      id="AlertSection"
      className="w-full"
      style={{ backgroundColor: "rgba(113, 184, 242, 0.1)" }}
    >
      <div className="relative mx-auto flex items-center justify-center px-5 text-[16px] leading-[20px] text-[#545454]" style={{ minHeight: 73 }}>
        <div className="flex items-center gap-3 max-[640px]:flex-col max-[640px]:gap-2 max-[640px]:py-3 max-[640px]:text-center">
          <InfoIcon width={32} height={29} className="shrink-0" />
          <p className="m-0">
            &apos;This account belongs to someone else&apos; message{" "}
            <a
              href="/us/Answer/Detail/000002706"
              className="font-medium text-[#116fbb] hover:underline"
            >
              Read more
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Dismiss alert"
          className="absolute right-5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center text-[#545454] hover:opacity-70"
        >
          <CloseIcon width={14} height={14} />
        </button>
      </div>
    </section>
  );
}
