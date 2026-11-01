"use client";

import { ArrowDown, ArrowUp, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import { saveTour } from "@/app/admin/actions";
import { months as MONTHS, toursPage } from "@/components/sites/showlanka/content/pages";
import { cn } from "@/lib/utils";
import { GalleryField, ImageField } from "./image-field";
import { draftToTour, slugify, type TourDraft } from "./models";
import { buttonClass, Card, Field, inputClass } from "./ui";

type Props = {
  initial: TourDraft;
  /** Slug being edited ("" for a new tour) */
  original: string;
  builtin: boolean;
  places: Record<string, [number, number]>;
};

function move<T>(list: T[], i: number, by: number) {
  const j = i + by;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function ListControls({ i, count, onMove, onRemove, label }: { i: number; count: number; onMove: (by: number) => void; onRemove: () => void; label: string }) {
  return (
    <div className="flex shrink-0 gap-0.5">
      <button type="button" className={buttonClass.ghost} onClick={() => onMove(-1)} disabled={i === 0} aria-label={`Move ${label} up`}>
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={buttonClass.ghost} onClick={() => onMove(1)} disabled={i === count - 1} aria-label={`Move ${label} down`}>
        <ArrowDown className="size-4" />
      </button>
      <button type="button" className={cn(buttonClass.ghost, "hover:bg-red-50 hover:text-red-700")} onClick={onRemove} aria-label={`Remove ${label}`}>
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm capitalize transition",
        on ? "border-[#0057a7] bg-[#0057a7] text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
      )}
    >
      {children}
    </button>
  );
}

export function TourForm({ initial, original, builtin, places }: Props) {
  const [d, setD] = useState<TourDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!original);
  const [dirty, setDirty] = useState(false);
  const [state, action, pending] = useActionState(saveTour, undefined);

  const set = <K extends keyof TourDraft>(key: K, value: TourDraft[K]) => {
    setDirty(true);
    setD((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!dirty || pending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, pending]);

  useEffect(() => {
    if (state?.errors.length) document.getElementById("form-errors")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  const placeNames = Object.keys(places);
  const preview = draftToTour(d);
  const pct = preview.ok ? preview.value.discount : "";

  return (
    <form action={action} className="space-y-6 pb-24">
      <input type="hidden" name="draft" value={JSON.stringify(d)} />
      <input type="hidden" name="original" value={original} />

      {state?.errors.length ? (
        <div id="form-errors" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-medium">Please fix the following:</p>
          <ul className="mt-1 list-disc pl-5">
            {state.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Card title="Tour details">
        <div className="grid gap-4 md:grid-cols-6">
          <Field label="Tour title" className="md:col-span-6">
            <input
              className={inputClass}
              value={d.title}
              placeholder="e.g. Sri Lanka Highlights 10 Days private tour"
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              required
            />
          </Field>
          <Field
            label="Web address"
            className="md:col-span-4"
            hint={builtin ? "Built-in tours keep their address so existing links keep working." : "Lowercase words joined by dashes."}
          >
            <span className="flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 px-3 text-sm text-slate-500">showlanka.com/</span>
              <input
                className={cn(inputClass, "rounded-l-none")}
                value={d.slug}
                disabled={builtin}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
              />
            </span>
          </Field>
          <Field label="Tour code" className="md:col-span-2" hint="Optional">
            <input className={inputClass} value={d.code} onChange={(e) => set("code", e.target.value)} placeholder="e.g. 3050" />
          </Field>
          <Field label="Days" className="md:col-span-2">
            <input className={inputClass} inputMode="numeric" value={d.days} onChange={(e) => set("days", e.target.value.replace(/\D/g, ""))} required />
          </Field>
          <Field label="Nights" className="md:col-span-2" hint="Leave blank for days − 1">
            <input className={inputClass} inputMode="numeric" value={d.nights} onChange={(e) => set("nights", e.target.value.replace(/\D/g, ""))} />
          </Field>
          <div className="md:col-span-6">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Categories</span>
            <div className="flex flex-wrap gap-2">
              {toursPage.categories.map((c) => (
                <Toggle
                  key={c.value}
                  on={d.categories.includes(c.value)}
                  onClick={() => set("categories", d.categories.includes(c.value) ? d.categories.filter((x) => x !== c.value) : [...d.categories, c.value])}
                >
                  {c.label}
                </Toggle>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500">Used by the filters on the Sri Lanka Tours page. Private tours are also listed as “Similar Tour Packages”.</p>
          </div>
          <div className="md:col-span-6">
            <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
              Best months to travel
              <button
                type="button"
                className="text-xs font-normal text-[#0057a7] hover:underline"
                onClick={() => set("months", d.months.length === 12 ? [] : MONTHS.map((_, i) => i + 1))}
              >
                {d.months.length === 12 ? "Clear all" : "Select all"}
              </button>
            </span>
            <div className="flex flex-wrap gap-2">
              {MONTHS.map((m, i) => (
                <Toggle key={m} on={d.months.includes(i + 1)} onClick={() => set("months", d.months.includes(i + 1) ? d.months.filter((x) => x !== i + 1) : [...d.months, i + 1])}>
                  {m.slice(0, 3)}
                </Toggle>
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500">None selected means the tour shows for every month.</p>
          </div>
        </div>
      </Card>

      <Card title="Images">
        <div className="grid gap-5 md:grid-cols-2">
          <ImageField label="Main image" hint="Large photo at the top of the tour page (landscape, at least 1600 px wide)." value={d.hero} onChange={(v) => set("hero", v)} />
          <ImageField label="Listing card image" hint="Optional. Shown on the tours list; uses the main image if empty." value={d.card} onChange={(v) => set("card", v)} />
        </div>
        <div className="mt-5">
          <GalleryField value={d.gallery} onChange={(v) => set("gallery", v)} />
        </div>
      </Card>

      <Card title="Prices (US$ per person)" action={pct && pct !== "0% Off" ? <span className="text-sm font-medium text-emerald-700">{pct}</span> : undefined}>
        <div className="space-y-3">
          {d.prices.map((p, i) => (
            <div key={i} className="grid grid-cols-[6rem_1fr_1fr] items-end gap-3">
              <span className="pb-2 text-sm font-medium text-slate-700">
                {i + 1} {i ? "travellers" : "traveller"}
              </span>
              <Field label="Price">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={p.price}
                  placeholder={i ? "Not offered" : "e.g. 767"}
                  onChange={(e) => set("prices", d.prices.map((x, j) => (j === i ? { ...x, price: e.target.value.replace(/[^\d.]/g, "") } : x)))}
                />
              </Field>
              <Field label="Was (before discount)">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={p.old}
                  placeholder="Optional"
                  onChange={(e) => set("prices", d.prices.map((x, j) => (j === i ? { ...x, old: e.target.value.replace(/[^\d.]/g, "") } : x)))}
                />
              </Field>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Leave a price blank if that party size is not offered. The 3-traveller price is shown on the tour card. A “was” price shows a strikethrough price, the saving and a discount badge.</p>
      </Card>

      <Card
        title={`Itinerary (${d.itinerary.length} ${d.itinerary.length === 1 ? "day" : "days"})`}
        action={
          <button type="button" className={buttonClass.ghost} onClick={() => set("itinerary", [...d.itinerary, { title: "", attractions: "", overnight: d.itinerary.at(-1)?.overnight ?? "" }])}>
            <Plus className="size-4" /> Add day
          </button>
        }
      >
        <ol className="space-y-4">
          {d.itinerary.map((day, i) => (
            <li key={i} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-900">Day {i + 1}</span>
                <ListControls
                  i={i}
                  count={d.itinerary.length}
                  label={`day ${i + 1}`}
                  onMove={(by) => set("itinerary", move(d.itinerary, i, by))}
                  onRemove={() => set("itinerary", d.itinerary.filter((_, j) => j !== i))}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Title" className="md:col-span-2">
                  <input
                    className={inputClass}
                    value={day.title}
                    placeholder="e.g. Arrival & proceed to Sigiriya"
                    onChange={(e) => set("itinerary", d.itinerary.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  />
                </Field>
                <Field label="Attractions" hint="One per line.">
                  <textarea
                    className={cn(inputClass, "min-h-28")}
                    value={day.attractions}
                    placeholder={"Pinnawela Elephant Orphanage\nDambulla Cave Temple"}
                    onChange={(e) => set("itinerary", d.itinerary.map((x, j) => (j === i ? { ...x, attractions: e.target.value } : x)))}
                  />
                </Field>
                <Field label="Overnight">
                  <input
                    className={inputClass}
                    value={day.overnight}
                    placeholder="e.g. Overnight stay at Kandy"
                    onChange={(e) => set("itinerary", d.itinerary.map((x, j) => (j === i ? { ...x, overnight: e.target.value } : x)))}
                  />
                </Field>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card
        title="What's included"
        action={
          <button type="button" className={buttonClass.ghost} onClick={() => set("tabs", [...d.tabs, { name: "", items: "" }])}>
            <Plus className="size-4" /> Add section
          </button>
        }
      >
        <p className="-mt-1 mb-4 text-xs text-slate-500">Each section becomes a tab next to “Itinerary” on the tour page. Empty sections are left out.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {d.tabs.map((tab, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center gap-2">
                <input
                  className={cn(inputClass, "font-medium")}
                  value={tab.name}
                  placeholder="Section name, e.g. Excludes"
                  aria-label="Section name"
                  onChange={(e) => set("tabs", d.tabs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                />
                <ListControls
                  i={i}
                  count={d.tabs.length}
                  label={tab.name || "section"}
                  onMove={(by) => set("tabs", move(d.tabs, i, by))}
                  onRemove={() => set("tabs", d.tabs.filter((_, j) => j !== i))}
                />
              </div>
              <textarea
                className={cn(inputClass, "min-h-28")}
                value={tab.items}
                placeholder="One item per line"
                aria-label={`${tab.name || "Section"} items`}
                onChange={(e) => set("tabs", d.tabs.map((x, j) => (j === i ? { ...x, items: e.target.value } : x)))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Route map"
        action={
          <button type="button" className={buttonClass.ghost} onClick={() => set("stops", [...d.stops, { name: "", lat: "", lng: "" }])}>
            <Plus className="size-4" /> Add stop
          </button>
        }
      >
        <p className="-mt-1 mb-4 text-xs text-slate-500">
          Stops in travel order; the map draws a loop through them. Pick a place from the list to fill in its position, or type the latitude and
          longitude yourself (right-click a spot in Google Maps to copy them).
        </p>
        <datalist id="known-places">
          {placeNames.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        <ol className="space-y-2">
          {d.stops.map((s, i) => (
            <li key={i} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-2 md:grid-cols-[1.5rem_2fr_1fr_1fr_auto]">
              <span className="text-right text-sm text-slate-400 tabular-nums">{i + 1}</span>
              <input
                className={inputClass}
                list="known-places"
                value={s.name}
                placeholder="Place name"
                aria-label={`Stop ${i + 1} name`}
                onChange={(e) => {
                  const name = e.target.value;
                  const known = places[name];
                  set("stops", d.stops.map((x, j) => (j === i ? { name, lat: known ? String(known[0]) : x.lat, lng: known ? String(known[1]) : x.lng } : x)));
                }}
              />
              <span className="col-span-3 col-start-2 grid grid-cols-2 gap-2 md:col-span-2 md:col-start-auto">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={s.lat}
                  placeholder="Latitude"
                  aria-label={`Stop ${i + 1} latitude`}
                  onChange={(e) => set("stops", d.stops.map((x, j) => (j === i ? { ...x, lat: e.target.value } : x)))}
                />
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={s.lng}
                  placeholder="Longitude"
                  aria-label={`Stop ${i + 1} longitude`}
                  onChange={(e) => set("stops", d.stops.map((x, j) => (j === i ? { ...x, lng: e.target.value } : x)))}
                />
              </span>
              <span className="col-start-3 row-start-1 md:col-start-auto md:row-start-auto">
                <ListControls
                  i={i}
                  count={d.stops.length}
                  label={s.name || `stop ${i + 1}`}
                  onMove={(by) => set("stops", move(d.stops, i, by))}
                  onRemove={() => set("stops", d.stops.filter((_, j) => j !== i))}
                />
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="size-4 accent-[#0057a7]" checked={d.published} onChange={(e) => set("published", e.target.checked)} />
            Show on the website
          </label>
          <div className="flex gap-2">
            {original && d.published && (
              <a href={`/${original}`} target="_blank" rel="noopener" className={buttonClass.secondary}>
                View page
              </a>
            )}
            <button type="submit" className={buttonClass.primary} disabled={pending}>
              {pending && <LoaderCircle className="size-4 animate-spin" />}
              {original ? "Save changes" : "Create tour"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
