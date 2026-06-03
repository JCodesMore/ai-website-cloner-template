"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ImageViewer({ images }: { images: string[] }) {
  const [zoomed, setZoomed] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="评论图片"
            tabIndex={0}
            role="button"
            onClick={() => setZoomed(img)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setZoomed(img); } }}
            className="h-20 w-20 cursor-zoom-in rounded-lg border border-slate-200 object-cover transition-opacity duration-200 hover:opacity-80"
          />
        ))}
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 cursor-zoom-out"
          onClick={() => setZoomed(null)}
          onKeyDown={(e) => { if (e.key === "Escape") setZoomed(null); }}
          tabIndex={0}
          role="dialog"
          aria-label="图片放大查看"
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors duration-200 hover:bg-white/20 cursor-pointer"
            onClick={() => setZoomed(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={zoomed}
            alt="放大的评论图片"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
