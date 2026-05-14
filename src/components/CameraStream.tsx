"use client";

import { useEffect, useRef, useState } from "react";
import { DemoOverlay } from "./DemoOverlay";
import type { DemoType } from "@/data/ai-capabilities";

/**
 * Live webcam capture with the synthetic AI overlay on top.
 *
 * Asks for camera permission with `getUserMedia`. The user picks which
 * analytic to run (the demo type). Stops the stream when unmounted or
 * when the user clicks "Apagar".
 */

type Props = {
  demoType: DemoType;
};

export function CameraStream({ demoType }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.name === "NotAllowedError"
            ? "Permiso denegado. Activá la cámara desde la configuración del navegador."
            : e.name === "NotFoundError"
            ? "No se encontró cámara conectada."
            : e.message
          : "No se pudo acceder a la cámara.";
      setError(msg);
      setStreaming(false);
    }
  }

  function stop() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-border/60 bg-deep">
      {/* Background scan lines when off */}
      {!streaming && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-foreground/55">
              {error ? "⚠ Error" : "Cámara · Apagada"}
            </div>
            <div className="mt-3 font-heading text-2xl font-black uppercase tracking-tight text-foreground/85">
              {error ? "No se pudo iniciar" : "Listo para activar"}
            </div>
            {error && (
              <div className="mx-auto mt-3 max-w-md font-mono text-[11px] text-foreground/55">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={start}
              className="bevel-btn mt-6 inline-flex items-center gap-3 border border-accent bg-accent/15 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-accent/25"
            >
              <span className="text-accent">●</span>
              {error ? "Reintentar" : "Activar cámara"}
            </button>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
              El navegador te pedirá permiso. La imagen no sale de tu computadora.
            </div>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        playsInline
        muted
        className={`size-full object-cover ${streaming ? "opacity-100" : "opacity-0"}`}
      />

      {/* AI overlay */}
      {streaming && <DemoOverlay demoType={demoType} active />}

      {/* HUD */}
      {streaming && (
        <>
          {/* Top status bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/85">
            <div className="flex items-center gap-2 border border-accent/50 bg-deep/70 px-3 py-1.5 backdrop-blur">
              <span className="size-1.5 animate-pulse bg-red-500" />
              <span>REC · LIVE</span>
            </div>
            <div className="flex items-center gap-2 border border-border/40 bg-deep/70 px-3 py-1.5 backdrop-blur">
              <span className="text-accent">◉</span>
              <span>ARS · {demoType.toUpperCase()}</span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/50">
              Local · 1280×720 · 30 fps · Procesado en navegador
            </div>
            <button
              type="button"
              onClick={stop}
              className="border border-border/50 bg-deep/70 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/70 backdrop-blur transition-colors hover:border-red-400 hover:text-red-400"
            >
              ✕ Apagar cámara
            </button>
          </div>
        </>
      )}
    </div>
  );
}
