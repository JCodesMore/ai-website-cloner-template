"use client";

import { useScene } from "@/context/SceneContext";
import { content } from "@/data/content";

const NAV_ITEMS = [
  { room: "gallery" as const, label: "Career" },
  { room: "studio" as const, label: "AI Tools" },
  { room: "about" as const, label: "About" },
  { room: "contact" as const, label: "Contact" },
];

export function HUD() {
  const { activeRoom, enterRoom, exitRoom } = useScene();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6">
      <div className="pointer-events-auto rounded-full border border-neutral-800 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-800 backdrop-blur">
        {content.profile.name}
      </div>
      <nav aria-label="Room navigation" className="pointer-events-auto flex gap-2 rounded-full border border-neutral-800 bg-white/80 p-1 backdrop-blur">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.room}
            onClick={() => enterRoom(item.room)}
            aria-current={activeRoom === item.room ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              activeRoom === item.room ? "bg-neutral-800 text-white" : "text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {item.label}
          </button>
        ))}
        {activeRoom !== null && (
          <button
            onClick={exitRoom}
            className="rounded-full px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-200"
          >
            Exit
          </button>
        )}
      </nav>
    </div>
  );
}
