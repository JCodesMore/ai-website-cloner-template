"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type RoomId = "gallery" | "studio" | "about" | "contact";

interface SceneState {
  activeRoom: RoomId | null;
  isInRoom: boolean;
  enterRoom: (room: RoomId) => void;
  exitRoom: () => void;
}

const SceneContext = createContext<SceneState | null>(null);

export function SceneProvider({ children }: { children: ReactNode }) {
  const [activeRoom, setActiveRoom] = useState<RoomId | null>(null);

  const enterRoom = useCallback((room: RoomId) => setActiveRoom(room), []);
  const exitRoom = useCallback(() => setActiveRoom(null), []);

  const value = useMemo<SceneState>(
    () => ({ activeRoom, isInRoom: activeRoom !== null, enterRoom, exitRoom }),
    [activeRoom, enterRoom, exitRoom],
  );

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useScene(): SceneState {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used within a SceneProvider");
  return ctx;
}
