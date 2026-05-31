"use client";

import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "确定",
  cancelText = "取消",
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={loading ? undefined : onCancel}
        className="absolute inset-0 bg-black/45"
      />
      <div className="relative w-[360px] max-w-[90vw] animate-in fade-in zoom-in-95 rounded-xl bg-white shadow-xl duration-200">
        <div className="px-6 pt-7">
          <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{message}</p>
        </div>
        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex min-w-[72px] items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-800 disabled:opacity-60 cursor-pointer"
          >
            {loading && (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {loading ? "处理中..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
