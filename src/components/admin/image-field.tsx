"use client";

/* eslint-disable @next/next/no-img-element */
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { useRef, useState } from "react";
import { upload } from "@/components/sites/showlanka/site-link";
import { cn } from "@/lib/utils";
import { buttonClass } from "./ui";

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error || "Upload failed.");
  return json.url;
}

/** One image: preview, upload button and the stored path (editable for existing site images). */
export function ImageField({ label, hint, value, onChange, aspect = "aspect-video" }: { label: string; hint?: string; value: string; onChange: (v: string) => void; aspect?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <div
        className={cn("relative overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50", aspect)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void pick(e.dataTransfer.files[0]);
        }}
      >
        {value ? (
          <>
            <img src={upload(value)} alt="" className="absolute inset-0 size-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-slate-700 shadow hover:bg-white"
              aria-label={`Remove ${label.toLowerCase()}`}
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <button type="button" onClick={() => input.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-sm text-slate-500 hover:text-slate-800">
            {busy ? <LoaderCircle className="size-6 animate-spin" /> : <ImagePlus className="size-6" />}
            {busy ? "Uploading…" : "Click or drop an image"}
          </button>
        )}
      </div>
      {value && (
        <button type="button" onClick={() => input.current?.click()} className={cn(buttonClass.ghost, "mt-1 -ml-2")} disabled={busy}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Replace
        </button>
      )}
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** Several images (tour gallery), each removable; uploads append. */
export function GalleryField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const added: string[] = [];
    try {
      for (const f of Array.from(files)) added.push(await uploadImage(f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      onChange([...value, ...added]);
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">Gallery</span>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {value.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative aspect-video overflow-hidden rounded-md border border-slate-200">
            <img src={upload(src)} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 rounded-full bg-white/90 p-0.5 text-slate-700 shadow hover:bg-white"
              aria-label={`Remove gallery image ${i + 1}`}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="flex aspect-video flex-col items-center justify-center gap-0.5 rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 hover:text-slate-800"
        >
          {busy ? <LoaderCircle className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          {busy ? "Uploading…" : "Add images"}
        </button>
      </div>
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => void pick(e.target.files)} />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : <p className="mt-1 text-xs text-slate-500">Shown in rotation after the main image at the top of the tour page.</p>}
    </div>
  );
}
