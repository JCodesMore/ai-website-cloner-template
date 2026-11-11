"use client";

import { Heading2, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { saveNews } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { ImageField } from "./image-field";
import { slugify, youtubeId, type NewsDraft } from "./models";
import { buttonClass, Card, Field, inputClass } from "./ui";

export function NewsForm({ initial, original, builtin }: { initial: NewsDraft; original: string; builtin: boolean }) {
  const [d, setD] = useState<NewsDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!original);
  const [dirty, setDirty] = useState(false);
  const [state, action, pending] = useActionState(saveNews, undefined);
  const body = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof NewsDraft>(key: K, value: NewsDraft[K]) => {
    setDirty(true);
    setD((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);

  /** Start a "## " sub-heading paragraph at the cursor. */
  const insertHeading = () => {
    const el = body.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const before = value.slice(0, s).replace(/\s*$/, "");
    const selected = value.slice(s, e) || "Sub-heading";
    const next = `${before}${before ? "\n\n" : ""}## ${selected}\n\n${value.slice(e).replace(/^\s*/, "")}`;
    set("body", next);
    requestAnimationFrame(() => {
      el.focus();
      const at = before.length + (before ? 2 : 0) + 3;
      el.setSelectionRange(at, at + selected.length);
    });
  };

  const video = youtubeId(d.video);
  const words = d.body.trim() ? d.body.trim().split(/\s+/).length : 0;

  return (
    <form action={action} className="space-y-6 pb-24">
      <input type="hidden" name="draft" value={JSON.stringify(d)} />
      <input type="hidden" name="original" value={original} />

      {state?.errors.length ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">Please fix the following:</p>
          <ul className="mt-1 list-disc pl-5">
            {state.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <Field label="Headline">
                <input
                  className={cn(inputClass, "text-base font-medium")}
                  value={d.title}
                  placeholder="e.g. Sri Lanka extends free visas to 35 countries"
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  required
                />
              </Field>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="news-body" className="text-sm font-medium text-slate-700">
                    Article
                  </label>
                  <button type="button" onClick={insertHeading} className={buttonClass.ghost}>
                    <Heading2 className="size-4" /> Sub-heading
                  </button>
                </div>
                <textarea
                  id="news-body"
                  ref={body}
                  className={cn(inputClass, "min-h-96 leading-relaxed")}
                  value={d.body}
                  onChange={(e) => set("body", e.target.value)}
                  placeholder={"Write the news here.\n\nLeave an empty line between paragraphs.\n\n## A line starting with ## becomes a sub-heading"}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Leave an empty line between paragraphs. Start a line with “## ” for a sub-heading. {words} words.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publishing">
            <div className="space-y-4">
              <Field label="Date">
                <input type="date" className={inputClass} value={d.date} onChange={(e) => set("date", e.target.value)} required />
              </Field>
              <Field label="Web address" hint={builtin ? "Built-in articles keep their address." : undefined}>
                <input
                  className={inputClass}
                  value={d.slug}
                  disabled={builtin}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </Field>
              {builtin && (
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-0.5 size-4 accent-[#0057a7]" checked={d.linkOriginal} onChange={(e) => set("linkOriginal", e.target.checked)} />
                  Link to the full original article on showlanka.com
                </label>
              )}
            </div>
          </Card>
          <Card title="Media">
            <div className="space-y-4">
              <ImageField label="Main image" hint="Shown above the article." value={d.hero} onChange={(v) => set("hero", v)} />
              <ImageField label="Thumbnail" hint="Optional. For the news list; uses the main image if empty." value={d.card} onChange={(v) => set("card", v)} />
              <Field label="YouTube video" hint={video === null ? "Paste a YouTube link or video ID." : video ? `Video ID: ${video}` : "Optional. Paste a YouTube link."}>
                <input className={cn(inputClass, video === null && "border-red-300")} value={d.video} placeholder="https://youtu.be/…" onChange={(e) => set("video", e.target.value)} />
              </Field>
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-[#0057a7]" checked={d.published} onChange={(e) => set("published", e.target.checked)} />
            Show on the website
          </label>
          <div className="flex gap-2">
            {original && d.published && (
              <a href={`/${original}`} target="_blank" rel="noopener" className={buttonClass.secondary}>
                View article
              </a>
            )}
            <button type="submit" className={buttonClass.primary} disabled={pending}>
              {pending && <LoaderCircle className="size-4 animate-spin" />}
              {original ? "Save changes" : d.published ? "Publish article" : "Save as hidden"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
