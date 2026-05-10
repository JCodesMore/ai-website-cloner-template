"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useDataStore } from "@/lib/data-store";
import {
  type City,
  type Project,
  type IntegrationTag,
  type Country,
} from "@/data/projects";
import { colombiaDepartments, peruRegions } from "@/data/subdivisions";
import {
  allMunicipalities,
  municipalitiesByDept,
  type Municipality,
} from "@/data/municipalities";

// Map picker — Leaflet needs window, so SSR off
const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 280,
        border: "1px solid rgba(213, 224, 255, 0.18)",
        background: "rgba(213, 224, 255, 0.03)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.3em",
        color: "rgba(213, 224, 255, 0.45)",
      }}
    >
      Cargando mapa…
    </div>
  ),
});

const ALL_INTEGRATIONS: IntegrationTag[] = [
  "facial",
  "lpr",
  "epp",
  "intrusion",
  "behavior",
  "people-count",
  "thermal",
  "guard",
  "access",
  "perimeter",
  "alarm",
  "iot",
];

// Common verticals for dropdown — last option lets you free-type
const VERTICAL_OPTIONS = [
  "Retail",
  "Retail · Hospitalidad",
  "Industrial",
  "Industrial · EPP",
  "Logística",
  "Logística portuaria",
  "Aeroportuario",
  "Aeroportuario · Movilidad",
  "Hotelería",
  "Hotelería · Retail",
  "Salud",
  "Salud · Hospitalario",
  "Educación",
  "Educación · Acceso",
  "Corporativo",
  "Corporativo · Acceso",
  "Movilidad · Transporte público",
  "Espacios públicos",
  "Frontera · Logística",
  "Puerto · Carga",
  "Centro Comercial",
  "Banca · Financiero",
  "Energía · Servicios",
  "Otro (escribir)",
];

// Inline SVG chevron for native selects (matches dark theme)
const SELECT_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M0 0l5 6 5-6z' fill='%239eb0c0'/></svg>\")";

export default function AdminPage() {
  const store = useDataStore();
  const {
    cities,
    projects,
    upsertCity,
    removeCity,
    upsertProject,
    removeProject,
    exportJSON,
    importJSON,
    reset,
    hydrated,
  } = store;

  const [selectedCityId, setSelectedCityId] = useState<string | null>(
    cities[0]?.id ?? null
  );
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedCity = useMemo(
    () => cities.find((c) => c.id === selectedCityId) ?? null,
    [cities, selectedCityId]
  );
  const cityProjects = useMemo(
    () => (selectedCityId ? projects.filter((p) => p.cityId === selectedCityId) : []),
    [projects, selectedCityId]
  );
  const editingProject = useMemo(
    () => (editingProjectId ? projects.find((p) => p.id === editingProjectId) ?? null : null),
    [projects, editingProjectId]
  );

  // City wizard state — opens a modal to pick from official municipality list
  const [wizardOpen, setWizardOpen] = useState(false);

  // Auto-prune any leftover placeholder cities ("Nueva ciudad" / new-city-*)
  // from old sessions where the free-text creator was used.
  const placeholderCityIds = useMemo(
    () => cities.filter((c) => c.id.startsWith("new-city-") || c.name === "Nueva ciudad").map((c) => c.id),
    [cities]
  );
  // Run cleanup once on mount
  const cleanupRef = useRef(false);
  if (!cleanupRef.current && placeholderCityIds.length > 0 && hydrated) {
    cleanupRef.current = true;
    placeholderCityIds.forEach((id) => store.removeCity(id));
    if (selectedCityId && placeholderCityIds.includes(selectedCityId)) {
      const remaining = cities.filter((c) => !placeholderCityIds.includes(c.id));
      setSelectedCityId(remaining[0]?.id ?? null);
    }
  }

  function handleAddMunicipality(m: Municipality) {
    // Generate a stable ID from the country + dept + name
    const slug = `${m.country.toLowerCase()}-${m.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;

    // If the city already exists by ID, just select it
    const existing = cities.find((c) => c.id === slug);
    if (existing) {
      setSelectedCityId(existing.id);
      setWizardOpen(false);
      return;
    }

    const c: City = {
      id: slug,
      name: m.name,
      region: m.dept,
      country: m.country,
      lat: m.lat,
      lng: m.lng,
      tier: m.tier,
    };
    upsertCity(c);
    setSelectedCityId(slug);
    setWizardOpen(false);
  }

  function handleNewProject() {
    if (!selectedCityId) return;
    const id = `new-proj-${Date.now()}`;
    const city = cities.find((c) => c.id === selectedCityId)!;
    const p: Project = {
      id,
      cityId: selectedCityId,
      name: "Nuevo proyecto",
      address: "Sin dirección",
      lat: city.lat,
      lng: city.lng,
      vertical: "Retail",
      tagline: "Tagline corto del proyecto.",
      description: "Descripción detallada del proyecto.",
      hero: "/images/features/01-intro.png",
      gallery: [
        "/images/features/01-intro.png",
        "/images/features/02-central-monitoreo.png",
        "/images/features/06-reconocimiento-facial.png",
      ],
      integrations: ["facial", "guard"],
      stats: {
        cameras: 50,
        aiModels: 3,
        eventsPerDay: 1500,
        uptimePct: 99.9,
        avgResponseSec: 5,
        physicalGuards: 8,
      },
    };
    upsertProject(p);
    setEditingProjectId(id);
  }

  function handleExport() {
    const json = exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ars-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportText() {
    const result = importJSON(importText);
    if (result.ok) {
      setImportText("");
      setImportError(null);
      setShowJsonPanel(false);
    } else {
      setImportError(result.error ?? "Error desconocido");
    }
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result ?? "");
      const result = importJSON(text);
      if (!result.ok) setImportError(result.error ?? "Error desconocido");
      else setImportError(null);
    };
    reader.readAsText(file);
  }

  if (!hydrated) {
    return (
      <div className="grid h-screen place-items-center bg-background font-mono text-xs uppercase tracking-[0.3em] text-foreground/55">
        Cargando datos…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-6 py-3 md:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logos/horizontal-blanco.png"
              alt="ARS Intelligence"
              width={140}
              height={32}
              priority
              className="h-8 w-auto"
              style={{ height: "auto", width: "auto", maxHeight: "32px" }}
            />
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/55">
            <span className="text-accent">⚙</span> Admin · Editor de proyectos
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setShowJsonPanel((v) => !v)}
            className="border border-border/60 bg-secondary px-3 py-2 transition-colors hover:bg-secondary/70"
          >
            ⇪ Import/Export
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Restaurar valores por defecto? Se perderán los cambios locales.")) reset();
            }}
            className="border border-border/60 bg-secondary px-3 py-2 transition-colors hover:bg-secondary/70"
          >
            ↻ Reset
          </button>
          <Link
            href="/proyectos"
            className="border border-border/60 bg-foreground px-3 py-2 font-bold text-background transition-opacity hover:opacity-90"
          >
            ▸ Ver mapa
          </Link>
        </div>
      </header>

      {/* JSON Panel */}
      {showJsonPanel && (
        <div className="border-b border-border/60 bg-secondary/40 p-4">
          <div className="mx-auto max-w-5xl space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="border border-border/60 bg-background/60 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-background/90"
              >
                ⬇ Exportar JSON
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="border border-border/60 bg-background/60 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-background/90"
              >
                ⬆ Importar archivo
              </button>
              <span className="font-mono text-[11px] text-foreground/45">
                o pegá JSON abajo
              </span>
            </div>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{ "cities": [...], "projects": [...] }'
              className="min-h-[140px] w-full border border-border/60 bg-background p-3 font-mono text-[11px] text-foreground/90 focus:border-accent focus:outline-none"
            />
            {importError && (
              <div className="font-mono text-[11px] text-red-400">⚠ {importError}</div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleImportText}
                disabled={!importText.trim()}
                className="border border-accent bg-accent/20 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ▸ Aplicar JSON pegado
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportText(exportJSON());
                  setImportError(null);
                }}
                className="border border-border/60 bg-background px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-secondary"
              >
                Cargar datos actuales
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* CITIES SIDEBAR */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-border/60 bg-background/95">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              Ciudades · {cities.length}
            </span>
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="border border-accent bg-accent/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/25"
            >
              + Añadir
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {cities.map((c) => {
              const projCount = projects.filter((p) => p.cityId === c.id).length;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCityId(c.id);
                      setEditingProjectId(null);
                    }}
                    className={`flex w-full items-start justify-between gap-2 border-l-2 px-4 py-3 text-left transition-colors ${
                      selectedCityId === c.id
                        ? "border-accent bg-secondary text-foreground"
                        : "border-transparent text-foreground/70 hover:border-border/60 hover:bg-secondary/40 hover:text-foreground"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-heading text-sm font-bold uppercase tracking-tight">
                        {c.name}
                      </span>
                      <span className="block truncate font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                        {c.region} · {c.country}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                      {projCount}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* MAIN EDITOR */}
        <main className="flex-1 overflow-y-auto p-8">
          {!selectedCity ? (
            <div className="grid h-full place-items-center font-mono text-xs uppercase tracking-[0.25em] text-foreground/40">
              Selecciona o crea una ciudad
            </div>
          ) : editingProject ? (
            <ProjectForm
              key={editingProject.id}
              project={editingProject}
              city={selectedCity}
              onSave={(p) => upsertProject(p)}
              onDelete={() => {
                if (confirm(`¿Eliminar proyecto "${editingProject.name}"?`)) {
                  removeProject(editingProject.id);
                  setEditingProjectId(null);
                }
              }}
              onClose={() => setEditingProjectId(null)}
            />
          ) : (
            <CityEditor
              city={selectedCity}
              cityProjects={cityProjects}
              onSave={(c) => upsertCity(c)}
              onDelete={() => {
                if (confirm(`¿Eliminar "${selectedCity.name}" y sus ${cityProjects.length} proyectos?`)) {
                  removeCity(selectedCity.id);
                  setSelectedCityId(cities[0]?.id ?? null);
                }
              }}
              onNewProject={handleNewProject}
              onEditProject={(id) => setEditingProjectId(id)}
              onDeleteProject={(id) => {
                if (confirm("¿Eliminar este proyecto?")) removeProject(id);
              }}
            />
          )}
        </main>
      </div>

      {/* CITY WIZARD modal */}
      {wizardOpen && (
        <CityWizard
          existingCityIds={cities.map((c) => c.id)}
          onClose={() => setWizardOpen(false)}
          onPick={handleAddMunicipality}
        />
      )}
    </div>
  );
}

// ─────────────────────────── City editor ───────────────────────────

function CityEditor({
  city,
  cityProjects,
  onSave,
  onDelete,
  onNewProject,
  onEditProject,
  onDeleteProject,
}: {
  city: City;
  cityProjects: Project[];
  onSave: (c: City) => void;
  onDelete: () => void;
  onNewProject: () => void;
  onEditProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}) {
  const [draft, setDraft] = useState<City>(city);

  // Re-sync draft when the selected city changes
  useMemo(() => setDraft(city), [city.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const departments =
    draft.country === "CO"
      ? colombiaDepartments.map((d) => d.name)
      : peruRegions.map((d) => d.name);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="font-heading text-3xl font-black uppercase tracking-tight">
          Editar ciudad
        </h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
          ID: {draft.id}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="text-input"
          />
        </Field>
        <Field label="País">
          <select
            value={draft.country}
            onChange={(e) =>
              setDraft({
                ...draft,
                country: e.target.value as Country,
                region: e.target.value === "CO"
                  ? colombiaDepartments[0].name
                  : peruRegions[0].name,
              })
            }
            className="text-input"
          >
            <option value="CO">Colombia</option>
            <option value="PE">Perú</option>
          </select>
        </Field>
        <Field label="Departamento / Región">
          <select
            value={draft.region}
            onChange={(e) => setDraft({ ...draft, region: e.target.value })}
            className="text-input"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tier (afecta tamaño en el mapa)">
          <select
            value={draft.tier}
            onChange={(e) => setDraft({ ...draft, tier: e.target.value as "primary" | "secondary" })}
            className="text-input"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
          </select>
        </Field>
        <Field label="Latitud">
          <input
            type="number"
            step="0.0001"
            value={draft.lat}
            onChange={(e) => setDraft({ ...draft, lat: parseFloat(e.target.value) || 0 })}
            className="text-input"
          />
        </Field>
        <Field label="Longitud">
          <input
            type="number"
            step="0.0001"
            value={draft.lng}
            onChange={(e) => setDraft({ ...draft, lng: parseFloat(e.target.value) || 0 })}
            className="text-input"
          />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(draft)}
          disabled={JSON.stringify(draft) === JSON.stringify(city)}
          className="border border-accent bg-accent/20 px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-accent/30 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ▸ Guardar ciudad
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="border border-border/60 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-red-400 hover:text-red-400"
        >
          ✕ Eliminar ciudad
        </button>
      </div>

      {/* Projects list */}
      <div>
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="font-heading text-xl font-bold uppercase tracking-tight">
            Proyectos · {cityProjects.length}
          </h3>
          <button
            type="button"
            onClick={onNewProject}
            className="border border-accent bg-accent/15 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/25"
          >
            + Nuevo proyecto
          </button>
        </div>

        {cityProjects.length === 0 ? (
          <div className="mt-6 border border-dashed border-border/60 p-10 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/40">
            Sin proyectos en esta ciudad. Click en "Nuevo proyecto" para crear uno.
          </div>
        ) : (
          <ul className="mt-4 grid gap-2">
            {cityProjects.map((p) => (
              <li key={p.id}>
                <div className="flex items-center justify-between gap-3 border border-border/60 bg-secondary/40 p-3">
                  <button
                    type="button"
                    onClick={() => onEditProject(p.id)}
                    className="min-w-0 flex-1 text-left transition-colors hover:text-foreground"
                  >
                    <div className="font-heading text-sm font-bold uppercase tracking-tight">
                      {p.name}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      <span>{p.vertical}</span>
                      <span>·</span>
                      <span>{p.stats.cameras} cámaras</span>
                      <span>·</span>
                      <span>
                        {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditProject(p.id)}
                    className="shrink-0 border border-border/60 bg-background px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-foreground hover:text-background"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProject(p.id)}
                    className="shrink-0 border border-border/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-red-400 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style jsx>{`
        :global(.text-input) {
          background: rgba(213, 224, 255, 0.05);
          border: 1px solid rgba(213, 224, 255, 0.18);
          padding: 8px 10px;
          color: var(--foreground);
          font-family: var(--font-mono);
          font-size: 13px;
          width: 100%;
        }
        :global(.text-input:focus) {
          outline: none;
          border-color: var(--accent);
        }
        :global(select.text-input) {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 32px;
          background-image: ${SELECT_BG};
          background-repeat: no-repeat;
          background-position: right 10px center;
          cursor: pointer;
        }
        :global(select.text-input option),
        :global(.text-input option) {
          background: #020a18;
          color: #d5e0ff;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────── Project editor ───────────────────────────

function ProjectForm({
  project,
  city,
  onSave,
  onDelete,
  onClose,
}: {
  project: Project;
  city: City;
  onSave: (p: Project) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Project>(project);
  useMemo(() => setDraft(project), [project.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleIntegration(tag: IntegrationTag) {
    setDraft((d) => ({
      ...d,
      integrations: d.integrations.includes(tag)
        ? d.integrations.filter((t) => t !== tag)
        : [...d.integrations, tag],
    }));
  }

  function updateGalleryItem(idx: number, value: string) {
    setDraft((d) => {
      const next = d.gallery.slice();
      next[idx] = value;
      return { ...d, gallery: next };
    });
  }
  function addGalleryItem() {
    setDraft((d) => ({ ...d, gallery: [...d.gallery, "/images/features/01-intro.png"] }));
  }
  function removeGalleryItem(idx: number) {
    setDraft((d) => ({ ...d, gallery: d.gallery.filter((_, i) => i !== idx) }));
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(project);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 transition-colors hover:text-foreground"
          >
            ◀ Volver a {city.name}
          </button>
          <h2 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight">
            Editar proyecto
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/50">
            {city.name} · {city.region} · {city.country} · ID: {draft.id}
          </p>
        </div>
      </div>

      {/* Basic info */}
      <Section title="Información básica">
        <Field label="Nombre">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="text-input" />
        </Field>
        <Field label="Dirección">
          <input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} className="text-input" />
        </Field>
        <Field label="Vertical / sector">
          <VerticalPicker
            value={draft.vertical}
            onChange={(v) => setDraft({ ...draft, vertical: v })}
          />
        </Field>
        <Field label="Tagline (frase corta · máx 80)">
          <input
            value={draft.tagline}
            onChange={(e) => setDraft({ ...draft, tagline: e.target.value.slice(0, 80) })}
            className="text-input"
            maxLength={80}
          />
          <div className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/40">
            {draft.tagline.length} / 80
          </div>
        </Field>
        <Field label="Descripción larga" full>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={4}
            className="text-input"
          />
        </Field>
      </Section>

      {/* Coordinates */}
      <Section title="Ubicación exacta (arrastrá el pin en el mapa)" full>
        <div className="md:col-span-2">
          <LocationPicker
            lat={draft.lat || city.lat}
            lng={draft.lng || city.lng}
            onChange={(lat, lng) => setDraft({ ...draft, lat, lng })}
          />
        </div>
        <Field label="Latitud">
          <input
            type="number"
            step="0.000001"
            value={draft.lat}
            onChange={(e) => setDraft({ ...draft, lat: parseFloat(e.target.value) || 0 })}
            className="text-input"
          />
        </Field>
        <Field label="Longitud">
          <input
            type="number"
            step="0.000001"
            value={draft.lng}
            onChange={(e) => setDraft({ ...draft, lng: parseFloat(e.target.value) || 0 })}
            className="text-input"
          />
        </Field>
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
            Tip: arrastrá el pin azul en el mapa, o click sobre el sitio. También podés pegar coordenadas directamente — las del Google Maps funcionan (click derecho → copiar coords).
          </p>
        </div>
      </Section>

      {/* Stats */}
      <Section title="Métricas operativas">
        <Field label="Cámaras">
          <input type="number" min="0" value={draft.stats.cameras} onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, cameras: parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Modelos de IA">
          <input type="number" min="0" value={draft.stats.aiModels} onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, aiModels: parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Eventos / día">
          <input type="number" min="0" value={draft.stats.eventsPerDay} onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, eventsPerDay: parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Uptime (%)">
          <input type="number" step="0.01" min="0" max="100" value={draft.stats.uptimePct} onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, uptimePct: parseFloat(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Respuesta media (s)">
          <input type="number" min="0" value={draft.stats.avgResponseSec} onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, avgResponseSec: parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Guardias en sitio">
          <input type="number" min="0" value={draft.stats.physicalGuards} onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, physicalGuards: parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Alertas críticas / día (opcional)">
          <input type="number" min="0" value={draft.stats.alertsPerDay ?? ""} placeholder="—" onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, alertsPerDay: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Cobertura (m², opcional)">
          <input type="number" min="0" value={draft.stats.coverageM2 ?? ""} placeholder="—" onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, coverageM2: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Retención video (días, opcional)">
          <input type="number" min="0" value={draft.stats.recordingDays ?? ""} placeholder="—" onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, recordingDays: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="NVRs / servidores (opcional)">
          <input type="number" min="0" value={draft.stats.nvrCount ?? ""} placeholder="—" onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, nvrCount: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
        <Field label="Ancho de banda (Mbps, opcional)">
          <input type="number" min="0" value={draft.stats.networkMbps ?? ""} placeholder="—" onChange={(e) => setDraft({ ...draft, stats: { ...draft.stats, networkMbps: e.target.value === "" ? undefined : parseInt(e.target.value) || 0 } })} className="text-input" />
        </Field>
      </Section>

      {/* Integrations */}
      <Section title="Integraciones activas" full>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {ALL_INTEGRATIONS.map((tag) => {
            const active = draft.integrations.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleIntegration(tag)}
                className={`border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  active
                    ? "border-accent bg-accent/25 text-foreground"
                    : "border-border/60 bg-background text-foreground/55 hover:bg-secondary"
                }`}
              >
                {active ? "✓" : "+"} {tag}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Media */}
      <Section title="Imágenes y galería" full>
        <Field label="Hero (imagen principal)" full>
          <input value={draft.hero} onChange={(e) => setDraft({ ...draft, hero: e.target.value })} className="text-input" placeholder="/images/features/01-intro.png" />
          <p className="mt-1 font-mono text-[10px] text-foreground/40">
            Ruta dentro de /public o URL absoluta
          </p>
        </Field>
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              Galería · {draft.gallery.length}
            </span>
            <button type="button" onClick={addGalleryItem} className="border border-accent bg-accent/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/25">
              + Añadir
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {draft.gallery.map((src, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={src}
                  onChange={(e) => updateGalleryItem(i, e.target.value)}
                  className="text-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryItem(i)}
                  className="shrink-0 border border-border/60 px-3 py-2 font-mono text-[10px] text-foreground/55 transition-colors hover:border-red-400 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <Field label="URL de video (opcional, YouTube/Vimeo embed)" full>
          <input value={draft.videoEmbed ?? ""} onChange={(e) => setDraft({ ...draft, videoEmbed: e.target.value || undefined })} className="text-input" placeholder="https://www.youtube.com/embed/..." />
        </Field>
      </Section>

      {/* Save / delete */}
      <div className="sticky bottom-0 -mx-8 flex items-center justify-between gap-3 border-t border-border/60 bg-background/95 px-8 py-4 backdrop-blur">
        <button
          type="button"
          onClick={onDelete}
          className="border border-border/60 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-red-400 hover:text-red-400"
        >
          ✕ Eliminar proyecto
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-border/60 bg-background px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            disabled={!dirty}
            className="border border-accent bg-accent/25 px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ▸ Guardar proyecto
          </button>
        </div>
      </div>

      <style jsx>{`
        :global(.text-input) {
          background: rgba(213, 224, 255, 0.05);
          border: 1px solid rgba(213, 224, 255, 0.18);
          padding: 8px 10px;
          color: var(--foreground);
          font-family: var(--font-mono);
          font-size: 13px;
          width: 100%;
        }
        :global(.text-input:focus) {
          outline: none;
          border-color: var(--accent);
        }
        :global(select.text-input) {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 32px;
          background-image: ${SELECT_BG};
          background-repeat: no-repeat;
          background-position: right 10px center;
          cursor: pointer;
        }
        :global(select.text-input option),
        :global(.text-input option) {
          background: #020a18;
          color: #d5e0ff;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────── CityWizard ───────────────────────────

function CityWizard({
  existingCityIds,
  onClose,
  onPick,
}: {
  existingCityIds: string[];
  onClose: () => void;
  onPick: (m: Municipality) => void;
}) {
  const [country, setCountry] = useState<Country>("CO");
  const [dept, setDept] = useState<string>(colombiaDepartments[0].name);

  const departments = useMemo(
    () =>
      country === "CO"
        ? colombiaDepartments.map((d) => d.name)
        : peruRegions.map((d) => d.name),
    [country]
  );

  // Reset dept if it doesn't match the new country
  if (!departments.includes(dept)) {
    // schedule update outside render via setState in microtask
    Promise.resolve().then(() => setDept(departments[0]));
  }

  const options = useMemo(() => {
    return municipalitiesByDept(country, dept);
  }, [country, dept]);

  function existingId(m: Municipality) {
    const slug = `${m.country.toLowerCase()}-${m.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`;
    return existingCityIds.includes(slug);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-deep/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl border border-border/60 bg-background/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              Añadir ciudad
            </div>
            <h2 className="mt-1 font-heading text-xl font-black uppercase tracking-tight">
              Catálogo de municipios
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="size-8 border border-border/60 bg-secondary text-foreground/60 transition-colors hover:bg-secondary/70 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 border-b border-border/60 px-6 py-4 md:grid-cols-2">
          <label className="block">
            <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              País
            </span>
            <select
              value={country}
              onChange={(e) => {
                const c = e.target.value as Country;
                setCountry(c);
                setDept(
                  c === "CO" ? colombiaDepartments[0].name : peruRegions[0].name
                );
              }}
              className="text-input mt-1"
            >
              <option value="CO">Colombia</option>
              <option value="PE">Perú</option>
            </select>
          </label>
          <label className="block">
            <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              Departamento / Región
            </span>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="text-input mt-1"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-2 py-2">
          {options.length === 0 ? (
            <div className="px-4 py-6 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/40">
              No hay municipios listados para este departamento.<br />
              Podés añadirlos manualmente al archivo <code>src/data/municipalities.ts</code>.
            </div>
          ) : (
            <ul className="grid gap-1">
              {options.map((m) => {
                const existing = existingId(m);
                return (
                  <li key={m.name}>
                    <button
                      type="button"
                      disabled={existing}
                      onClick={() => onPick(m)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                        existing
                          ? "cursor-not-allowed opacity-40"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <span>
                        <span className="block font-heading text-sm font-bold uppercase tracking-tight">
                          {m.name}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                          {m.dept} · {m.country} · {m.lat.toFixed(3)}, {m.lng.toFixed(3)}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
                        {existing ? (
                          <span className="text-foreground/40">Ya añadida</span>
                        ) : (
                          <span className="text-accent">+ añadir ▸</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-border/60 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
          {options.length} municipios listados · podés ajustar coordenadas y datos después de añadir
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── VerticalPicker ───────────────────────────

function VerticalPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isPreset = VERTICAL_OPTIONS.includes(value);
  const [custom, setCustom] = useState(!isPreset);

  return (
    <div>
      {!custom && (
        <select
          value={isPreset ? value : VERTICAL_OPTIONS[0]}
          onChange={(e) => {
            if (e.target.value === "Otro (escribir)") {
              setCustom(true);
              onChange("");
            } else {
              onChange(e.target.value);
            }
          }}
          className="text-input"
        >
          {VERTICAL_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      )}
      {custom && (
        <div className="flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escribí un sector personalizado…"
            className="text-input"
          />
          <button
            type="button"
            onClick={() => {
              setCustom(false);
              onChange(VERTICAL_OPTIONS[0]);
            }}
            className="shrink-0 border border-border/60 bg-secondary px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:bg-secondary/70 hover:text-foreground"
            title="Volver a la lista"
          >
            ▾ lista
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── Helpers ───────────────────────────

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Section({
  title,
  children,
  full = false,
}: {
  title: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <section>
      <h3 className="border-b border-border/60 pb-2 font-heading text-base font-bold uppercase tracking-tight text-foreground/85">
        {title}
      </h3>
      <div className={`mt-4 grid gap-4 ${full ? "" : "md:grid-cols-2"}`}>{children}</div>
    </section>
  );
}
