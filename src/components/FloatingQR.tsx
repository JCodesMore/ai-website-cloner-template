"use client";

import { useState } from "react";
import { QrCode, X } from "lucide-react";

export default function FloatingQR({ pagePath }: { pagePath?: string }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    fetch("/api/qr/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: pagePath || window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-600 text-white shadow-lg transition-all duration-200 hover:bg-yellow-700 hover:shadow-xl cursor-pointer"
        type="button"
        aria-label="微信联系"
      >
        <QrCode className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="relative mx-4 w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="mb-2 text-lg font-bold text-slate-900">微信扫码咨询</h3>
            <p className="mb-4 text-sm text-slate-500">扫码添加微信，免费获取贷款建议</p>
            <img
              src="/images/wechat-qr.png"
              alt="微信二维码"
              className="mx-auto h-52 w-52 rounded-lg border border-slate-100 object-cover"
            />
            <p className="mt-3 text-xs text-slate-400">微信扫一扫 或 长按识别</p>
          </div>
        </div>
      )}
    </>
  );
}
