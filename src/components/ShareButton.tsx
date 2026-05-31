"use client";

import { useState, useEffect } from "react";
import { Share2, Smartphone, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  productId: string;
  productName: string;
  rate?: string;
  amount?: string;
  term?: string;
  repayment?: string;
}

export default function ShareButton({ productId }: ShareButtonProps) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const productUrl = origin
    ? `${origin}/products/detail/${productId}`
    : `/products/detail/${productId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(productUrl)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed left-[calc(50%-660px)] top-1/2 z-10 -translate-y-1/2">
      <button
        className="group flex w-14 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 shadow-lg transition-shadow duration-200 hover:shadow-xl cursor-pointer"
        type="button"
        onMouseEnter={(e) => {
          const popover = e.currentTarget.nextElementSibling as HTMLElement;
          if (popover) popover.style.display = "block";
        }}
        onMouseLeave={(e) => {
          const popover = e.currentTarget.nextElementSibling as HTMLElement;
          if (popover) popover.style.display = "none";
        }}
      >
        <Share2 className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
        <span className="text-xs font-semibold text-slate-600">分享</span>
      </button>
      <div
        className="absolute left-16 top-1/2 z-50 hidden w-[280px] -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-xl"
        onMouseEnter={(e) => { e.currentTarget.style.display = "block"; }}
        onMouseLeave={(e) => { e.currentTarget.style.display = "none"; }}
      >
        <p className="mb-3 text-sm font-semibold text-slate-900">分享本产品</p>
        <img src={qrUrl} alt="qrcode" className="mx-auto mb-2 h-[130px] w-[130px]" />
        <p className="mb-3 flex items-center justify-center gap-1 text-xs text-slate-400">
          <Smartphone className="h-3.5 w-3.5" /> 微信扫码，分享给好友
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-600 px-4 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-yellow-700 cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "已复制" : "复制链接"}
        </button>
      </div>
    </div>
  );
}
