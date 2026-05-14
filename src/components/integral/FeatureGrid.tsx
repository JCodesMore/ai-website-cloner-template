"use client";

import { useState } from "react";
import { Icon } from "./Icon";
import {
  features,
  featureGroups,
  type Feature,
} from "@/data/integral-security";

type FilterKey = Feature["group"] | "all";

export function FeatureGrid() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered =
    filter === "all" ? features : features.filter((f) => f.group === filter);

  return (
    <section
      id="funcionalidades"
      className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
            <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
            Funcionalidades principales
          </div>
          <h2 className="mt-4 max-w-3xl font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
            Catorce capacidades,
            <br />
            <span className="text-foreground/80">una sola plataforma.</span>
          </h2>
        </header>

        {/* Filter pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Todas"
            count={features.length}
          />
          {(Object.keys(featureGroups) as Feature["group"][]).map((g) => (
            <FilterPill
              key={g}
              active={filter === g}
              onClick={() => setFilter(g)}
              label={featureGroups[g].label}
              count={features.filter((f) => f.group === g).length}
            />
          ))}
        </div>

        {/* Grid */}
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <FeatureCard
              key={f.id}
              feature={f}
              expanded={expanded === f.id}
              onToggle={() => setExpanded(expanded === f.id ? null : f.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
        active
          ? "border-accent bg-accent/25 text-foreground"
          : "border-border/60 bg-background/40 text-foreground/55 hover:bg-secondary"
      }`}
    >
      {label}
      <span className={active ? "text-foreground/80" : "text-foreground/40"}>
        {count}
      </span>
    </button>
  );
}

function FeatureCard({
  feature,
  expanded,
  onToggle,
}: {
  feature: Feature;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className={`flex flex-col border bg-background/40 backdrop-blur transition-all ${
        expanded
          ? "border-accent bg-secondary/40"
          : "border-border/50 hover:-translate-y-0.5 hover:border-border"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`feature-${feature.id}`}
        className="flex flex-col gap-4 p-5 text-left"
      >
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
          <span>
            <span className="text-accent">{feature.letter}</span> · {featureGroupLabel(feature.group)}
          </span>
          <span
            className={`transition-transform ${expanded ? "rotate-45" : ""}`}
            aria-hidden
          >
            +
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center border border-border/60 bg-secondary text-accent">
            <Icon path={feature.icon} size={20} />
          </div>
          <h3 className="mt-1 font-heading text-base font-bold uppercase leading-tight tracking-tight text-foreground">
            {feature.title}
          </h3>
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-foreground/65">
          {feature.description}
        </p>
      </button>

      {/* Expandable bullets — supports flat list OR grouped sub-accordion */}
      <div
        id={`feature-${feature.id}`}
        className={`grid overflow-hidden border-t border-border/40 transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {feature.bulletGroups && feature.bulletGroups.length > 0 ? (
            <BulletGroups groups={feature.bulletGroups} />
          ) : (
            <ul className="space-y-2 p-5 pt-4 font-mono text-[11px] leading-relaxed text-foreground/75">
              {feature.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-1 text-accent">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

function featureGroupLabel(g: Feature["group"]): string {
  return featureGroups[g].label;
}

// Sub-accordion for features that have grouped bullets
function BulletGroups({
  groups,
}: {
  groups: NonNullable<Feature["bulletGroups"]>;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="p-3">
      <ul className="divide-y divide-border/40">
        {groups.map((g, i) => {
          const isOpen = open === i;
          return (
            <li key={g.label}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-3 py-3 px-2 text-left font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  isOpen ? "text-foreground" : "text-foreground/65 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`size-1.5 transition-colors ${
                      isOpen ? "bg-accent" : "bg-foreground/30"
                    }`}
                  />
                  {g.label}
                  <span className="text-foreground/40">{g.items.length}</span>
                </span>
                <span
                  aria-hidden
                  className={`text-accent transition-transform ${isOpen ? "rotate-90" : ""}`}
                >
                  ▸
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="space-y-1.5 px-2 pb-3 pt-1 font-mono text-[11px] leading-relaxed text-foreground/75">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-1 text-accent">▸</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
