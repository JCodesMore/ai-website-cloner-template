"use client";

import { useEffect, useRef, useState } from "react";
import { DemoOverlay } from "./DemoOverlay";
import type { DemoType } from "@/data/ai-capabilities";

/**
 * Video upload + playback + AI overlay.
 *
 * The user picks a local video file (MP4 / WebM / MOV). It's loaded into a
 * blob URL and played in-browser. Synthetic AI overlay runs on top.
 *
 * Nothing is uploaded to a server — everything happens client-side.
 */

type Props = {
  demoType: DemoType;
};

const ACCEPTED = "video/mp4,video/webm,video/quicktime,video/x-matroska,video/*";
const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

export function VideoUpload({ demoType }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  function loadFile(file: File) {
    if (!file.type.startsWith("video/")) {
      setError("El archivo no parece ser un video.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Archivo muy grande (máx 500 MB para demo en navegador).");
      return;
    }
    setError(null);
    setFileName(file.name);
    if (src) URL.revokeObjectURL(src);
    setSrc(URL.createObjectURL(file));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  function reset() {
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
    setFileName(null);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  // Track playback progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress(v.currentTime);
    const onLoaded = () => setDuration(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [src]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }

  function fmtTime(s: number) {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative aspect-video w-full overflow-hidden border bg-deep transition-colors ${
          dragOver ? "border-accent bg-accent/10" : "border-border/60"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {!src ? (
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.4em] text-foreground/55">
                Demo · Cargar video
              </div>
              <div className="mt-3 font-heading text-2xl font-black uppercase tracking-tight text-foreground/85">
                Arrastrá un archivo aquí
              </div>
              <div className="mx-auto mt-3 max-w-md font-mono text-[11px] text-foreground/55">
                MP4 · WebM · MOV · MKV · máx 500 MB
                <br />
                Todo el procesamiento ocurre en tu navegador. No se sube a ningún servidor.
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bevel-btn mt-6 inline-flex items-center gap-3 border border-accent bg-accent/15 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-accent/25"
              >
                <span className="text-accent">▤</span>
                O seleccioná un archivo
              </button>
              {error && (
                <div className="mx-auto mt-4 max-w-md border border-red-400/40 bg-red-400/10 p-2 font-mono text-[11px] text-red-300">
                  ⚠ {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={src}
              playsInline
              loop
              autoPlay
              muted
              className="size-full object-contain"
            />
            <DemoOverlay demoType={demoType} active={playing} />

            {/* HUD */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/85">
              <div className="flex items-center gap-2 border border-accent/50 bg-deep/70 px-3 py-1.5 backdrop-blur">
                <span className="text-accent">▶</span>
                <span>{fileName?.slice(0, 32)}</span>
              </div>
              <div className="flex items-center gap-2 border border-border/40 bg-deep/70 px-3 py-1.5 backdrop-blur">
                <span className="text-accent">◉</span>
                <span>ARS · {demoType.toUpperCase()}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-deep to-transparent p-3">
              <button
                type="button"
                onClick={togglePlay}
                className="grid size-9 place-items-center border border-border/50 bg-deep/70 text-foreground/85 backdrop-blur transition-colors hover:bg-deep/90"
              >
                {playing ? "❚❚" : "▶"}
              </button>
              <div className="flex-1">
                <div className="relative h-1 bg-foreground/15">
                  <div
                    className="absolute inset-y-0 left-0 bg-accent"
                    style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/50">
                  <span>{fmtTime(progress)}</span>
                  <span>{fmtTime(duration)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="border border-border/50 bg-deep/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70 backdrop-blur transition-colors hover:border-red-400 hover:text-red-400"
              >
                ✕ Cambiar
              </button>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
