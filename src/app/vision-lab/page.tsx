"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { VisionCanvas } from "@/components/vision-lab/VisionCanvas";
import {
  EventsPanel,
  JSONViewer,
  ModelInfoCard,
  ModelSelector,
  RulesPanel,
  SourceSelector,
} from "@/components/vision-lab/Panels";
import { visionModels, type SourceType } from "@/data/vision-models";
import {
  defaultRules,
  mockPredict,
  type Event,
  type PredictResponse,
  type Rules,
} from "@/lib/vision-mock";

/**
 * /vision-lab — Playground técnico para modelos de visión.
 *
 * Fase 1: UI completa + mock predictions corriendo en tick local.
 * Fase 2-4: backend FastAPI documentado en docs/vision-demo-api.md
 *
 * Cuando el backend esté disponible, reemplazá `mockPredict()` por una
 * llamada fetch a /api/vision-demo/predict/frame con el frame en base64.
 */
export default function VisionLabPage() {
  // State
  const [selectedId, setSelectedId] = useState(visionModels[0].id);
  const [source, setSource] = useState<SourceType>("image");
  const [rules, setRules] = useState<Rules>(defaultRules);
  const [mode, setMode] = useState<"view" | "roi" | "line">("view");

  const [imgUrl, setImgUrl] = useState<string | null>("/images/features/02-central-monitoreo.png");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [webcamOn, setWebcamOn] = useState(false);

  const [result, setResult] = useState<PredictResponse | null>(null);
  const [eventsHistory, setEventsHistory] = useState<Event[]>([]);

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  const selected = useMemo(
    () => visionModels.find((m) => m.id === selectedId) ?? visionModels[0],
    [selectedId]
  );

  // When model changes, switch to a source it supports
  useEffect(() => {
    if (!selected.sources.includes(source)) {
      setSource(selected.sources[0]);
    }
  }, [selected, source]);

  // Webcam start/stop
  useEffect(() => {
    if (source !== "webcam" || !webcamOn) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((t) => t.stop());
        webcamStreamRef.current = null;
      }
      if (videoRef.current && source === "webcam") {
        videoRef.current.srcObject = null;
      }
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        webcamStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        console.error("Webcam error", e);
        setWebcamOn(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, webcamOn]);

  // Mock prediction tick — runs every 600ms while there's a source
  const tickRef = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const r = mockPredict(
        selected,
        source,
        rect.width || 1280,
        rect.height || 720,
        tickRef.current,
        rules
      );
      setResult(r);
      // Append new events to history (cap at 50)
      if (r.events.length > 0) {
        setEventsHistory((prev) => [...r.events, ...prev].slice(0, 50));
      }
    }, 600);
    return () => clearInterval(id);
  }, [selected, source, rules]);

  function handleFile(f: File) {
    const url = URL.createObjectURL(f);
    if (source === "image") {
      setImgUrl(url);
      setVideoUrl(null);
    } else {
      setVideoUrl(url);
      setImgUrl(null);
    }
  }

  function handleSnapshot() {
    const stage = stageRef.current;
    if (!stage) return;
    // Compose source + canvas overlay into one image
    const canvas = document.createElement("canvas");
    const rect = stage.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Source frame
    if (source === "image" && imgRef.current) {
      try {
        ctx.drawImage(imgRef.current, 0, 0, rect.width, rect.height);
      } catch {}
    } else if ((source === "video" || source === "webcam") && videoRef.current) {
      try {
        ctx.drawImage(videoRef.current, 0, 0, rect.width, rect.height);
      } catch {}
    }
    // Overlay (find the canvas inside stage)
    const overlay = stage.querySelector("canvas");
    if (overlay) {
      try {
        ctx.drawImage(overlay as HTMLCanvasElement, 0, 0, rect.width, rect.height);
      } catch {}
    }
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ars-snapshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function handleCreateAlert(e: Event) {
    // In production this would POST to the alerts service
    console.log("Demo alert created:", e);
    alert(
      `Alerta demo creada\n\nTipo: ${e.type}\nSeveridad: ${e.severity}\nMensaje: ${e.message}\n\nEn producción, esto se enviaría a la central de monitoreo.`
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-25" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-6 py-3 md:px-10">
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
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 lg:inline">
              <span className="mr-2 text-accent">◎</span>
              Vision Lab · Playground técnico
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              href="/plataforma"
              className="bevel-btn group hidden items-center gap-2 border border-accent/60 bg-accent/15 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-accent/25 sm:flex"
            >
              <span className="text-accent">◇</span> Plataforma
            </Link>
            <Link
              href="/laboratorio"
              className="bevel-btn group hidden items-center gap-2 border border-border bg-background/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-background/70 md:flex"
            >
              Laboratorio
            </Link>
            <Link
              href="/"
              className="bevel-btn group flex items-center gap-2 border border-border bg-background/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-background/70"
            >
              <span className="text-accent">◀</span> Inicio
            </Link>
          </nav>
        </div>
      </header>

      <main className="grid gap-3 p-3 md:grid-cols-[280px_1fr_320px] md:p-4 lg:p-6">
        {/* LEFT — Model selector */}
        <aside className="border border-border/50 bg-background/40 p-4 backdrop-blur">
          <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-tight">
            Modelos
          </h2>
          <ModelSelector selectedId={selectedId} onSelect={setSelectedId} />
        </aside>

        {/* CENTER — Stage */}
        <section className="space-y-3">
          {/* Source selector + actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 border border-border/50 bg-background/40 p-3 backdrop-blur">
            <SourceSelector
              available={selected.sources}
              selected={source}
              onSelect={(s) => {
                setSource(s);
                if (s !== "webcam") setWebcamOn(false);
              }}
              onFile={handleFile}
              onWebcamToggle={() => setWebcamOn(!webcamOn)}
              webcamOn={webcamOn}
            />
          </div>

          {/* Stage */}
          <div
            ref={stageRef}
            className="relative aspect-video w-full overflow-hidden border border-border/60 bg-deep"
          >
            {/* Source media */}
            {source === "image" && imgUrl && (
              <img
                ref={imgRef}
                src={imgUrl}
                alt="Frame"
                className="size-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            {source === "video" && videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="size-full object-cover"
              />
            )}
            {source === "webcam" && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="size-full object-cover"
              />
            )}
            {(source === "image" && !imgUrl) ||
            (source === "video" && !videoUrl) ||
            (source === "webcam" && !webcamOn) ? (
              <div className="absolute inset-0 grid place-items-center text-center">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/45">
                  {source === "webcam"
                    ? "Activá la cámara para empezar"
                    : `Subí ${source === "image" ? "una imagen" : "un video"} para procesar`}
                </div>
              </div>
            ) : null}

            {/* HUD */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/85">
              <div className="border border-accent/50 bg-deep/70 px-3 py-1.5 backdrop-blur">
                <span className="text-accent">●</span> {selected.id} · {source}
              </div>
              <div className="border border-border/40 bg-deep/70 px-3 py-1.5 backdrop-blur">
                {result?.predictions.length ?? 0} pred · {result?.events.length ?? 0} ev
              </div>
            </div>

            {/* Mode banner */}
            {mode !== "view" && (
              <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center">
                <div className="border border-accent bg-deep/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/85 backdrop-blur">
                  Modo edición:{" "}
                  <span className="text-accent">
                    {mode === "roi" ? "ROI · click para añadir, doble click para cerrar" : "LÍNEA · 2 clicks"}
                  </span>
                </div>
              </div>
            )}

            {/* Vision canvas overlay */}
            <VisionCanvas
              mediaRef={(source === "image" ? imgRef : videoRef) as React.RefObject<HTMLVideoElement | HTMLImageElement | null>}
              result={result}
              rules={rules}
              onRulesChange={setRules}
              mode={mode}
              onModeChange={setMode}
            />
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border border-border/50 bg-background/40 p-3 backdrop-blur">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSnapshot}
                className="border border-accent/50 bg-accent/15 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-accent/25"
              >
                ▤ Exportar snapshot
              </button>
              <button
                type="button"
                onClick={() => {
                  if (result?.events.length) handleCreateAlert(result.events[0]);
                  else alert("No hay eventos en este frame para crear alerta");
                }}
                className="border border-border/50 bg-background/40 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-foreground/85 transition-colors hover:bg-secondary"
              >
                ▸ Crear alerta demo
              </button>
              <button
                type="button"
                onClick={() => setEventsHistory([])}
                disabled={eventsHistory.length === 0}
                className="border border-border/40 bg-background/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55 transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-30"
              >
                ✕ Limpiar eventos
              </button>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40">
              {selected.events.length} tipos de evento posibles
            </span>
          </div>

          {/* Model info card */}
          <ModelInfoCard model={selected} />

          {/* JSON viewer */}
          <JSONViewer data={result} />
        </section>

        {/* RIGHT — Rules + Events */}
        <aside className="space-y-3">
          <div className="border border-border/50 bg-background/40 p-4 backdrop-blur">
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-tight">
              Reglas
            </h2>
            <RulesPanel
              rules={rules}
              onChange={setRules}
              onEditRoi={() => {
                setRules({ ...rules, roi: [] });
                setMode("roi");
              }}
              onEditLine={() => {
                setRules({ ...rules, line: undefined });
                setMode("line");
              }}
              onClearRoi={() => setRules({ ...rules, roi: undefined })}
              onClearLine={() => setRules({ ...rules, line: undefined })}
            />
          </div>

          <div className="border border-border/50 bg-background/40 p-4 backdrop-blur">
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-tight">
              Eventos
            </h2>
            <EventsPanel
              events={eventsHistory}
              onCreateAlert={handleCreateAlert}
              onExportSnapshot={handleSnapshot}
            />
          </div>
        </aside>
      </main>

      <footer className="border-t border-border/40 bg-background py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45 md:px-10">
          <span>
            Vision Lab · Fase 1 (mock predictions) · Backend spec:{" "}
            <code className="text-foreground/70">docs/vision-demo-api.md</code>
          </span>
          <span>© {new Date().getFullYear()} ARS Intelligence</span>
        </div>
      </footer>
    </div>
  );
}
