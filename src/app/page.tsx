"use client";

import dynamic from "next/dynamic";
import { SceneProvider } from "@/context/SceneContext";
import { HUD } from "@/components/dom/HUD";

const Experience = dynamic(() => import("@/components/canvas/Experience").then((m) => m.Experience), {
  ssr: false,
});

export default function Home() {
  return (
    <SceneProvider>
      <main className="relative h-screen w-full overflow-hidden bg-neutral-100">
        <Experience />
        <HUD />
      </main>
    </SceneProvider>
  );
}
