"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LatamMap } from "@/components/LatamMap";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Scramble } from "@/components/Scramble";
import { ProjectDetail } from "@/components/ProjectDetail";
import { useI18n } from "@/lib/i18n/context";
import { useDataStore } from "@/lib/data-store";
import type { Country } from "@/data/projects";
import { colombiaDepartments, peruRegions } from "@/data/subdivisions";

type Filters = {
  country: Country | "ALL";
  department: string | "ALL";
};

export default function ProyectosPage() {
  const { t, locale } = useI18n();
  const {
    cities,
    getCityById,
    getProjectById,
    projectsByCity,
    totalCamerasByCity,
  } = useDataStore();

  const [entered, setEntered] = useState(false);
  const [focusCityId, setFocusCityId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    country: "ALL",
    department: "ALL",
  });

  const tp = t.projectsPage;
  const isES = locale === "es";

  // Department options: full admin-1 list of the selected country (all
  // departments shown, not only those with current projects)
  const availableDepartments = useMemo(() => {
    if (filters.country === "CO") return colombiaDepartments.map((d) => d.name);
    if (filters.country === "PE") return peruRegions.map((d) => d.name);
    // "ALL" — show all CO + PE depts that have at least one city in our store
    const set = new Set<string>();
    cities.forEach((c) => set.add(c.region));
    return Array.from(set).sort();
  }, [filters.country, cities]);

  // Cities filtered by current selection
  const filteredCities = useMemo(() => {
    return cities.filter((c) => {
      if (filters.country !== "ALL" && c.country !== filters.country) return false;
      if (filters.department !== "ALL" && c.region !== filters.department) return false;
      return true;
    });
  }, [filters, cities]);

  // Wire filters to map focus
  const focusCountry: Country | null =
    filters.country === "ALL" ? null : filters.country;
  const focusDepartmentName: string | null =
    filters.department === "ALL" ? null : filters.department;

  // When user changes country in the filter, clear the department
  // (this is handled inside setFilters when country changes)

  // Clear focusCity when filters narrow down to exclude it
  useEffect(() => {
    if (focusCityId) {
      const c = getCityById(focusCityId);
      if (!c) {
        setFocusCityId(null);
        return;
      }
      const matches =
        (filters.country === "ALL" || c.country === filters.country) &&
        (filters.department === "ALL" || c.region === filters.department);
      if (!matches) setFocusCityId(null);
    }
  }, [filters, focusCityId, getCityById]);

  const focusedCity = focusCityId ? getCityById(focusCityId) : null;
  const activeProject = activeProjectId ? getProjectById(activeProjectId) : null;
  const activeProjectCity = activeProject
    ? getCityById(activeProject.cityId)
    : null;

  const labelCountry = isES ? "País" : "Country";
  const labelDept = isES ? "Departamento / Región" : "Department / Region";
  const labelCity = isES ? "Ciudad" : "City";
  const labelAll = isES ? "Todos" : "All";

  return (
    <div className="relative h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div
          className="glow-blob absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(35,72,212,0.22), transparent 70%)",
          }}
        />
      </div>

      <header className="absolute inset-x-0 top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logos/horizontal-blanco.png"
              alt="ARS Intelligence"
              width={160}
              height={36}
              priority
              className="h-9 w-auto"
              style={{ height: "auto", width: "auto", maxHeight: "36px" }}
            />
          </Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/plataforma"
              className="bevel-btn group hidden items-center gap-2 border border-accent/60 bg-accent/15 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-foreground backdrop-blur transition-colors hover:bg-accent/25 sm:flex"
            >
              <span className="text-accent">◇</span> Plataforma
            </Link>
            <Link
              href="/laboratorio"
              className="bevel-btn group hidden items-center gap-2 border border-border bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur transition-colors hover:bg-background/70 hover:text-foreground md:flex"
            >
              <span className="text-accent">◎</span> Laboratorio
            </Link>
            <Link
              href="/admin"
              className="bevel-btn group flex items-center gap-2 border border-border bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur transition-colors hover:bg-background/70 hover:text-foreground"
            >
              <span className="text-accent">⚙</span> Admin
            </Link>
            <Link
              href="/"
              className="bevel-btn group flex items-center gap-2 border border-border bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur transition-colors hover:bg-background/70 hover:text-foreground"
            >
              <span className="text-accent">◀</span>{" "}
              <Scramble text={t.nav.home} trigger={locale} />
            </Link>
          </nav>
        </div>
      </header>

      {/* INTRO */}
      {!entered && (
        <div className="relative z-30 flex h-full flex-col items-center justify-center px-6 pb-16 pt-24">
          <div className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/50">
            <Scramble text={tp.howTo} trigger={locale} />
          </div>
          <h1 className="text-center font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight md:text-6xl">
            <Scramble as="span" text={tp.title1} trigger={`${locale}-1`} durationMs={900} />
            <br />
            <Scramble as="span" text={tp.title2} trigger={`${locale}-2`} durationMs={900} delayMs={200} />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-foreground/70 md:text-base">
            {tp.intro}
          </p>
          <div className="mt-12 grid w-full max-w-4xl gap-4 md:grid-cols-3">
            <IntroCard num="001" title={tp.cards.scroll.title} body={tp.cards.scroll.body} icon="↕" locale={locale} />
            <IntroCard num="002" title={tp.cards.drag.title} body={tp.cards.drag.body} icon="✥" locale={locale} />
            <IntroCard num="003" title={tp.cards.click.title} body={tp.cards.click.body} icon="◉" locale={locale} />
          </div>
          <button
            type="button"
            onClick={() => setEntered(true)}
            className="bevel-btn mt-10 inline-flex items-center gap-3 border border-border bg-background/40 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-foreground backdrop-blur transition-all hover:bg-background/70"
          >
            <span className="text-accent">▸</span>
            <Scramble text={tp.enter} trigger={locale} />
          </button>
        </div>
      )}

      {entered && (
        <>
          <div className="absolute inset-0 z-10">
            <LatamMap
              focusCityId={focusCityId}
              focusCountry={focusCountry}
              focusDepartmentName={focusDepartmentName}
              onCitySelect={(id) => {
                setFocusCityId(id);
                setActiveProjectId(null);
              }}
              onCountrySelect={(country) => {
                if (country === null) {
                  setFilters({ country: "ALL", department: "ALL" });
                } else {
                  setFilters({ country, department: "ALL" });
                }
              }}
              onDepartmentSelect={(name) => {
                setFilters((f) => ({ ...f, department: name ?? "ALL" }));
              }}
              onProjectSelect={(id) => setActiveProjectId(id)}
            />
          </div>

          <aside
            className={`absolute left-0 top-0 z-30 flex h-full w-full max-w-sm flex-col border-r border-border/60 bg-background/90 backdrop-blur-md transition-transform duration-300 md:max-w-md ${
              listOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
          >
            <div className="border-b border-border/60 px-6 pb-5 pt-24">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                {focusedCity ? (isES ? "Proyectos en" : "Projects in") : tp.listTitle}
              </div>
              <div className="mt-2 font-heading text-xl font-bold">
                {focusedCity ? focusedCity.name : tp.listSubtitle}
              </div>

              {focusedCity ? (
                <button
                  type="button"
                  onClick={() => setFocusCityId(null)}
                  className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55 transition-colors hover:text-foreground"
                >
                  <span className="text-accent">◀</span>
                  {isES ? "Volver al mapa" : "Back to map"}
                </button>
              ) : (
                <div className="mt-5 space-y-3">
                  <FilterSelect
                    label={labelCountry}
                    value={filters.country}
                    onChange={(v) =>
                      setFilters({
                        country: v as Country | "ALL",
                        department: "ALL",
                      })
                    }
                    options={[
                      { val: "ALL", label: labelAll },
                      { val: "CO", label: "Colombia" },
                      { val: "PE", label: "Perú" },
                    ]}
                  />
                  <FilterSelect
                    label={labelDept}
                    value={filters.department}
                    onChange={(v) => setFilters((f) => ({ ...f, department: v }))}
                    options={[
                      { val: "ALL", label: labelAll },
                      ...availableDepartments.map((d) => ({ val: d, label: d })),
                    ]}
                  />
                  <FilterSelect
                    label={labelCity}
                    value={focusCityId ?? "ALL"}
                    onChange={(v) => setFocusCityId(v === "ALL" ? null : v)}
                    options={[
                      { val: "ALL", label: labelAll },
                      ...filteredCities.map((c) => ({ val: c.id, label: c.name })),
                    ]}
                    disabled={filteredCities.length === 0}
                  />
                  <div className="flex items-center justify-between border-t border-border/30 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                    <span>{filteredCities.length} {isES ? "ciudades" : "cities"}</span>
                    <span className="text-accent">
                      {filteredCities.reduce(
                        (acc, c) => acc + projectsByCity(c.id).length,
                        0
                      )}{" "}
                      {isES ? "proyectos" : "projects"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <ul className="flex-1 overflow-y-auto py-2">
              {focusedCity
                ? projectsByCity(focusedCity.id).map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProjectId(p.id);
                          setListOpen(false);
                        }}
                        className="group flex w-full items-start gap-4 border-l-2 border-transparent px-6 py-4 text-left transition-colors hover:border-border hover:bg-secondary/40"
                      >
                        <div className="relative size-14 shrink-0 overflow-hidden border border-border/60 bg-secondary">
                          <Image src={p.hero} alt="" fill sizes="56px" className="object-cover opacity-80" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-heading text-sm font-bold uppercase leading-tight tracking-tight text-foreground">
                            {p.name}
                          </div>
                          <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                            {p.vertical}
                          </div>
                          <div className="mt-1 font-mono text-[10px] tracking-[0.22em] text-accent">
                            {p.stats.cameras} {tp.panel.cameras} · {p.stats.aiModels} IA
                          </div>
                        </div>
                        <span className="font-mono text-foreground/35 transition-colors group-hover:text-foreground">▸</span>
                      </button>
                    </li>
                  ))
                : filteredCities.length === 0
                ? (
                    <li className="px-6 py-6 font-mono text-xs text-foreground/40">
                      {isES ? "Sin resultados con esos filtros" : "No matches for these filters"}
                    </li>
                  )
                : filteredCities.map((c) => {
                    const pc = projectsByCity(c.id).length;
                    const tc = totalCamerasByCity(c.id);
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setFocusCityId(c.id);
                            setListOpen(false);
                          }}
                          className="group flex w-full items-center justify-between gap-3 border-l-2 border-transparent px-6 py-3 text-left font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-border hover:bg-secondary/40 hover:text-foreground"
                        >
                          <span>
                            <span className="block text-foreground/85">{c.name}</span>
                            <span className="mt-0.5 block text-[9px] tracking-[0.3em] text-foreground/40">
                              {c.region} · {c.country}
                            </span>
                          </span>
                          <span className="text-right text-foreground/60">
                            <span className="block font-bold text-accent">{pc}</span>
                            <span className="block text-[9px] tracking-[0.25em] text-foreground/40">
                              {tc} {tp.panel.cameras}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
            </ul>
          </aside>

          <div className="absolute inset-x-0 bottom-0 z-30 border-t border-border/40 bg-background/40 backdrop-blur">
            <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/65 md:px-10">
              <button
                type="button"
                onClick={() => setListOpen((v) => !v)}
                className="flex items-center gap-2 transition-colors hover:text-foreground md:hidden"
              >
                <span className="text-accent">≡</span>
                <Scramble text={tp.bottomBar.openList} trigger={locale} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (focusCityId) setFocusCityId(null);
                  else if (filters.department !== "ALL")
                    setFilters((f) => ({ ...f, department: "ALL" }));
                  else if (filters.country !== "ALL")
                    setFilters({ country: "ALL", department: "ALL" });
                  else {
                    setEntered(false);
                    setActiveProjectId(null);
                  }
                }}
                className="hidden items-center gap-2 transition-colors hover:text-foreground md:flex"
              >
                <span className="text-accent">◀</span>
                <Scramble text={tp.bottomBar.back} trigger={locale} />
              </button>
              <div className="flex items-center gap-2 text-foreground/45">
                <span className="size-1.5 bg-accent" />
                {focusedCity
                  ? `${projectsByCity(focusedCity.id).length} ${isES ? "proyectos" : "projects"}`
                  : `${filteredCities.length} ${isES ? "ciudades" : "cities"}`}
              </div>
              <button
                type="button"
                onClick={() => {
                  setFilters({ country: "ALL", department: "ALL" });
                  setFocusCityId(null);
                }}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Scramble text={isES ? "Limpiar filtros" : "Clear filters"} trigger={locale} />
                <span className="text-accent">↻</span>
              </button>
            </div>
          </div>

          <ProjectDetail
            project={activeProject ?? null}
            cityName={activeProjectCity?.name ?? ""}
            onClose={() => setActiveProjectId(null)}
          />
        </>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Array<{ val: string; label: string }>;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 w-full appearance-none border border-border/60 bg-secondary px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-secondary/70 focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M0 0l5 6 5-6z' fill='%239eb0c0'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: "32px",
        }}
      >
        {options.map((o) => (
          <option key={o.val} value={o.val} className="bg-background text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function IntroCard({
  num,
  title,
  body,
  icon,
  locale,
}: {
  num: string;
  title: string;
  body: string;
  icon: string;
  locale: string;
}) {
  return (
    <div className="bevel-card relative border border-border/60 bg-background/40 p-6 backdrop-blur">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
        <span className="size-1.5 bg-accent" />
        <span>{num}</span>
      </div>
      <div className="my-8 flex justify-center">
        <div
          className="grid size-20 place-items-center rounded-full border border-border/60 text-3xl text-foreground/80"
          style={{ background: "radial-gradient(closest-side, rgba(35,72,212,0.18), transparent 70%)" }}
        >
          {icon}
        </div>
      </div>
      <div className="mt-6 font-heading text-xl font-black uppercase tracking-tight">
        <Scramble text={title} trigger={`${locale}-${num}-t`} />
      </div>
      <div className="mt-1 font-mono text-xs text-foreground/60">{body}</div>
    </div>
  );
}
