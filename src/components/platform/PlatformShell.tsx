"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { CommandPalette } from "./CommandPalette";
import { NewProjectModal, NewAgentModal } from "./Modals";
import { I18nProvider } from "@/context/i18n";

/* ─── Global UI Context ──────────────────────────────────────────── */
export interface Project { name: string; color: string; }

interface ShellCtx {
  openCommandPalette: () => void;
  openNewProject: () => void;
  openNewAgent: () => void;
  projects: Project[];
  addProject: (p: Project) => void;
  activeProject: string | null;
  setActiveProject: (name: string | null) => void;
}

const ShellContext = createContext<ShellCtx>({
  openCommandPalette: () => {},
  openNewProject: () => {},
  openNewAgent: () => {},
  projects: [],
  addProject: () => {},
  activeProject: null,
  setActiveProject: () => {},
});

export const useShell = () => useContext(ShellContext);

const DEFAULT_PROJECTS: Project[] = [
  { name: "Backend Infra", color: "#6366f1" },
  { name: "Mobile App", color: "#f59e0b" },
  { name: "Marketing Site", color: "#10b981" },
];

const SESSION_KEY = "activeProject";

function readSessionProject(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSessionProject(name: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (name === null) {
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, name);
    }
  } catch {
    // ignore
  }
}

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newAgentOpen, setNewAgentOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [activeProject, setActiveProjectState] = useState<string | null>(null);

  // Restore activeProject from sessionStorage on mount
  useEffect(() => {
    const stored = readSessionProject();
    if (stored !== null) {
      setActiveProjectState(stored);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const setActiveProject = useCallback((name: string | null) => {
    setActiveProjectState(name);
    writeSessionProject(name);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("project-changed", { detail: name })
      );
    }
  }, []);

  const addProject = useCallback((p: Project) => {
    setProjects((prev) => [...prev, p]);
  }, []);

  return (
    <I18nProvider>
      <ShellContext.Provider
        value={{
          openCommandPalette: () => setCmdOpen(true),
          openNewProject: () => setNewProjectOpen(true),
          openNewAgent: () => setNewAgentOpen(true),
          projects,
          addProject,
          activeProject,
          setActiveProject,
        }}
      >
        {children}

        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

        <NewProjectModal
          open={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
          onSubmit={(p) => addProject({ name: p.name, color: p.color })}
        />

        <NewAgentModal
          open={newAgentOpen}
          onClose={() => setNewAgentOpen(false)}
          onSubmit={() => {}}
        />
      </ShellContext.Provider>
    </I18nProvider>
  );
}
