import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { emptyTour, tourToDraft } from "@/components/admin/models";
import { TourForm } from "@/components/admin/tour-form";
import { buttonClass, inputClass, PageHeader } from "@/components/admin/ui";
import { adminTours } from "@/lib/server/content";
import { knownPlaces } from "@/lib/server/places";

export const metadata: Metadata = { title: "New tour" };

export default async function NewTourPage({ searchParams }: PageProps<"/admin/tours/new">) {
  const { from } = await searchParams;
  const tours = adminTours();
  const source = typeof from === "string" ? tours.find((e) => e.item.slug === from)?.item : undefined;
  const initial = source ? { ...tourToDraft(source), title: `${source.title} (copy)`, slug: "", code: "" } : emptyTour();

  return (
    <>
      <Link href="/admin/tours" className={`${buttonClass.ghost} mb-3 -ml-2`}>
        <ArrowLeft className="size-4" /> Tours
      </Link>
      <PageHeader title={source ? "New tour from a copy" : "New tour"} description={source ? `Starting from “${source.title}”.` : "Fill in the details, then create the tour."} />

      {/* Plain GET form: reloads this page with ?from=<slug> to prefill from an existing tour. */}
      <form action="/admin/tours/new" className="mb-6 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <label htmlFor="from" className="text-sm font-medium whitespace-nowrap text-slate-700">
          Start from an existing tour
        </label>
        <select id="from" name="from" defaultValue={source?.slug ?? ""} className={inputClass}>
          <option value="">Blank tour</option>
          {tours.map((e) => (
            <option key={e.item.slug} value={e.item.slug}>
              {e.item.title}
            </option>
          ))}
        </select>
        <button type="submit" className={buttonClass.secondary}>
          Use
        </button>
      </form>

      <TourForm key={source?.slug ?? "blank"} initial={initial} original="" builtin={false} places={knownPlaces()} />
    </>
  );
}
