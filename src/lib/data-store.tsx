"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cities as seedCities,
  projects as seedProjects,
  type City,
  type Project,
} from "@/data/projects";

/**
 * Editable, persisted data store for ARS cities + projects.
 *
 * Reads `seedCities` / `seedProjects` from `src/data/projects.ts` as the
 * default seed. On the client, localStorage may override the data. The admin
 * panel writes back here. The map / detail / list views all read from this.
 *
 * Persisted under key `ars-data-v1`. Reset wipes the override.
 */

const STORAGE_KEY = "ars-data-v1";

type StoreShape = {
  cities: City[];
  projects: Project[];
};

type Ctx = StoreShape & {
  setCities: (next: City[]) => void;
  setProjects: (next: Project[]) => void;
  upsertCity: (city: City) => void;
  removeCity: (id: string) => void;
  upsertProject: (project: Project) => void;
  removeProject: (id: string) => void;
  exportJSON: () => string;
  importJSON: (raw: string) => { ok: boolean; error?: string };
  reset: () => void;
  /** True once we've read localStorage, false on first SSR render. */
  hydrated: boolean;
  /** Convenience helpers — same API as the static seed. */
  getCityById: (id: string) => City | undefined;
  getProjectById: (id: string) => Project | undefined;
  projectsByCity: (cityId: string) => Project[];
  totalCamerasByCity: (cityId: string) => number;
};

const seed: StoreShape = {
  cities: seedCities,
  projects: seedProjects,
};

const DataStoreContext = createContext<Ctx | null>(null);

function readLocalStorage(): StoreShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoreShape;
    if (!Array.isArray(parsed.cities) || !Array.isArray(parsed.projects)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalStorage(data: StoreShape) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreShape>(seed);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    const stored = readLocalStorage();
    if (stored) setData(stored);
    setHydrated(true);
  }, []);

  // Persist whenever data changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    writeLocalStorage(data);
  }, [data, hydrated]);

  const setCities = useCallback((next: City[]) => {
    setData((d) => ({ ...d, cities: next }));
  }, []);
  const setProjects = useCallback((next: Project[]) => {
    setData((d) => ({ ...d, projects: next }));
  }, []);
  const upsertCity = useCallback((city: City) => {
    setData((d) => {
      const idx = d.cities.findIndex((c) => c.id === city.id);
      if (idx === -1) return { ...d, cities: [...d.cities, city] };
      const next = d.cities.slice();
      next[idx] = city;
      return { ...d, cities: next };
    });
  }, []);
  const removeCity = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      cities: d.cities.filter((c) => c.id !== id),
      projects: d.projects.filter((p) => p.cityId !== id),
    }));
  }, []);
  const upsertProject = useCallback((project: Project) => {
    setData((d) => {
      const idx = d.projects.findIndex((p) => p.id === project.id);
      if (idx === -1) return { ...d, projects: [...d.projects, project] };
      const next = d.projects.slice();
      next[idx] = project;
      return { ...d, projects: next };
    });
  }, []);
  const removeProject = useCallback((id: string) => {
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
  }, []);
  const exportJSON = useCallback(() => JSON.stringify(data, null, 2), [data]);
  const importJSON = useCallback((raw: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.cities) || !Array.isArray(parsed.projects)) {
        return { ok: false, error: "JSON must have shape { cities: [], projects: [] }" };
      }
      setData(parsed);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, []);
  const reset = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    setData(seed);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...data,
      setCities,
      setProjects,
      upsertCity,
      removeCity,
      upsertProject,
      removeProject,
      exportJSON,
      importJSON,
      reset,
      hydrated,
      getCityById: (id) => data.cities.find((c) => c.id === id),
      getProjectById: (id) => data.projects.find((p) => p.id === id),
      projectsByCity: (cityId) => data.projects.filter((p) => p.cityId === cityId),
      totalCamerasByCity: (cityId) =>
        data.projects
          .filter((p) => p.cityId === cityId)
          .reduce((acc, p) => acc + (p.stats?.cameras ?? 0), 0),
    }),
    [data, setCities, setProjects, upsertCity, removeCity, upsertProject, removeProject, exportJSON, importJSON, reset, hydrated]
  );

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used inside <DataStoreProvider>");
  return ctx;
}
