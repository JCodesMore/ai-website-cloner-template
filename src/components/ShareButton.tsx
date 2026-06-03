"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title: string;
  variant?: "product" | "article";
  onShare?: () => void;
}

export default function ShareButton({ url, title, variant = "article", onShare }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const detectDevice = (): string => {
    if (typeof navigator === "undefined") return "desktop";
    return /Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
  };

  const handleShare = async () => {
    const deviceType = detectDevice();

    if (navigator.share) {
      try {
        await navigator.share({ title, url: `${window.location.origin}${url}` });
        recordShare("web_share", deviceType);
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(`${window.location.origin}${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    recordShare("copy_link", deviceType);
  };

  const recordShare = (channel: string, deviceType: string) => {
    const articleId = url.split("/").pop();
    fetch(`/api/articles/${articleId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, deviceType }),
      keepalive: true,
    }).catch(() => {});
    onShare?.();
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-emerald-600 cursor-pointer"
      type="button"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied ? "已复制" : "分享"}
    </button>
  );
}
