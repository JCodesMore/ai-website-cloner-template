"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronDown, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { events, eventTags } from "./events-data";

type SortOption = "date" | "alpha";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EventsPageClient() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("date");

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const visibleEvents = useMemo(() => {
    const filtered =
      activeTags.length === 0
        ? events
        : events.filter((event) =>
            event.tags.some((tag) => activeTags.includes(tag))
          );

    const sorted = [...filtered];
    if (sort === "date") {
      sorted.sort((a, b) => b.date.localeCompare(a.date));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [activeTags, sort]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Events</h1>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {eventTags.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-10 appearance-none rounded-full border border-border bg-background pl-4 pr-9 text-sm font-medium outline-none"
          >
            <option value="date">By date</option>
            <option value="alpha">Alphabetical</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-8 divide-y divide-border">
        {visibleEvents.map((event) => (
          <div key={event.slug} className="py-8 first:pt-0">
            <h2 className="text-2xl font-semibold tracking-tight">
              {event.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              {event.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {tag.toLowerCase()}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {event.location}
              </span>
            </div>
          </div>
        ))}

        {visibleEvents.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No events match those filters.
          </p>
        )}
      </div>
    </div>
  );
}
