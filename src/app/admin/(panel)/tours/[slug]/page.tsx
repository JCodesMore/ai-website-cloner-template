import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tourToDraft } from "@/components/admin/models";
import { TourForm } from "@/components/admin/tour-form";
import { Badge, buttonClass, PageHeader } from "@/components/admin/ui";
import { adminTours } from "@/lib/server/content";
import { knownPlaces } from "@/lib/server/places";

export const metadata: Metadata = { title: "Edit tour" };

export default async function EditTourPage({ params }: PageProps<"/admin/tours/[slug]">) {
  const { slug } = await params;
  const entry = adminTours().find((e) => e.item.slug === slug);
  if (!entry) notFound();

  return (
    <>
      <Link href="/admin/tours" className={`${buttonClass.ghost} mb-3 -ml-2`}>
        <ArrowLeft className="size-4" /> Tours
      </Link>
      <PageHeader
        title={entry.item.title}
        description={
          <span className="inline-flex flex-wrap items-center gap-1.5">
            {entry.builtin ? <Badge>Built-in tour</Badge> : <Badge tone="violet">Created here</Badge>}
            {entry.edited && <Badge tone="blue">Edited</Badge>}
            {!entry.published && <Badge tone="amber">Hidden</Badge>}
            {entry.builtin && <span>Changes replace the original; use Reset on the tours list to undo them.</span>}
          </span>
        }
      />
      <TourForm initial={tourToDraft(entry.item, entry.published)} original={slug} builtin={entry.builtin} places={knownPlaces()} />
    </>
  );
}
