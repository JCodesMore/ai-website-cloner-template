"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { months, toursPage } from "./content/pages";
import type { Tour } from "./content/types";
import { PackageCard } from "./subpage-parts";

/** filters.js: the bare query string (e.g. "?group") preselects the category. */
function categoryFromQuery(params: URLSearchParams) {
  const key = [...params.keys()][0] ?? "";
  return toursPage.categories.some((c) => c.value === key) ? key : "";
}

export function ToursList({ tours }: { tours: Tour[] }) {
  const params = useSearchParams();
  const [category, setCategory] = useState(() => categoryFromQuery(params));
  const [dayRange, setDayRange] = useState("");
  const [month, setMonth] = useState("");
  // Follow later client-side navigations to another "?category" link.
  const [lastParams, setLastParams] = useState(params.toString());
  if (lastParams !== params.toString()) {
    setLastParams(params.toString());
    setCategory(categoryFromQuery(params));
  }

  const matches = (t: Tour) => {
    if (category && !t.categories.includes(category)) return false;
    if (month && t.months.length && !t.months.includes(Number(month))) return false;
    if (dayRange) {
      const [min, max] = dayRange.split(",").map((n) => parseInt(n.trim(), 10));
      const days = parseInt(t.duration, 10);
      if (days < min || days > max) return false;
    }
    return true;
  };
  const anyVisible = tours.some(matches);

  return (
    <section className="packages-list">
      <div className="container-fluid">
        <div className="row filter-container">
          <div className="col-lg-3 col-md-4 col-12 filters">
            <select
              className="form-control"
              aria-label="Filter by tour category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All tour categories</option>
              {toursPage.categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-3 col-md-4 col-12 filters">
            <select
              className="form-control"
              aria-label="Filter by number of days"
              value={dayRange}
              onChange={(e) => setDayRange(e.target.value)}
            >
              <option value="">All Days</option>
              {toursPage.dayRanges.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-3 col-md-4 col-12 filters">
            <select className="form-control" aria-label="Filter by month" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">All year</option>
              {months.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="packages-content-container">
          <p className={`no-packages-message${anyVisible ? "" : " visible"}`}>
            No tour packages match these filters. Try another category, length or month.
          </p>
          <div className="row">
            {tours.map((t) => (
              <PackageCard key={t.slug} tour={t} hidden={!matches(t)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
