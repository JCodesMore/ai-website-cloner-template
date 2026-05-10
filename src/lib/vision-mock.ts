/**
 * Mock prediction generator para Fase 1.
 *
 * Cuando el backend de visión esté disponible, esta capa se reemplaza por
 * llamadas reales a /api/vision-demo/predict/* — el shape de la respuesta
 * coincide con la spec en `docs/vision-demo-api.md`.
 *
 * Mientras tanto, generamos predicciones plausibles a partir del modelo
 * seleccionado y el dimensionado del frame. Los track IDs son estables por
 * frame para que el demo se vea coherente.
 */

import type { EventType, VisionModel } from "@/data/vision-models";

export type BBox = { x: number; y: number; width: number; height: number };

export type Prediction = {
  label: string;
  confidence: number;
  bbox: BBox;
  trackId?: string;
  /** Modelos como pose_detection devuelven keypoints [x,y,visibility]. */
  keypoints?: Array<[number, number, number]>;
  /** Para placas, el OCR result. */
  text?: string;
  /** Para pose / fall, ángulo del torso. */
  angle?: number;
  /** Para PPE, qué item está faltando. */
  missing?: string[];
};

export type Event = {
  type: EventType;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  message: string;
  snapshotAvailable: boolean;
  timestamp: string;
  trackId?: string;
};

export type PredictResponse = {
  model: string;
  source: string;
  timestamp: string;
  frameWidth: number;
  frameHeight: number;
  predictions: Prediction[];
  events: Event[];
};

export type Rules = {
  confidenceThreshold: number;
  /** Polygon points in normalized [0..1] coords. */
  roi?: Array<{ x: number; y: number }>;
  /** Line segment in normalized [0..1] coords. */
  line?: { from: { x: number; y: number }; to: { x: number; y: number } };
  /** Loitering minimum time (seconds). */
  loiteringSec?: number;
  /** Whether to alert on PPE violations. */
  alertPpe?: boolean;
  /** Whether to alert on each detected person. */
  alertPerson?: boolean;
  /** Whether to alert on each detected object. */
  alertObject?: boolean;
};

// ─────────────────────────── Pseudo-random for stable mock data ───────────────────────────

function pseudoRand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

let trackCounter = 1000;
function newTrackId() {
  trackCounter += 1;
  return `T-${trackCounter}`;
}

// ─────────────────────────── Mock generators per model ───────────────────────────

export function mockPredict(
  model: VisionModel,
  source: string,
  frameWidth: number,
  frameHeight: number,
  tick: number,
  rules: Rules
): PredictResponse {
  const r = pseudoRand(tick + 1);
  const now = new Date().toISOString();
  const predictions: Prediction[] = [];

  switch (model.id) {
    case "people_detection": {
      const n = 2 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) {
        const x = 0.1 + i * 0.22 + r() * 0.05;
        predictions.push({
          label: "person",
          confidence: 0.78 + r() * 0.2,
          bbox: { x, y: 0.3 + r() * 0.1, width: 0.12, height: 0.45 },
          trackId: `T-${1000 + i}`,
        });
      }
      break;
    }
    case "vehicle_detection": {
      const types = ["car", "motorcycle", "truck", "bus"];
      const n = 1 + Math.floor(r() * 2);
      for (let i = 0; i < n; i++) {
        predictions.push({
          label: types[Math.floor(r() * types.length)],
          confidence: 0.82 + r() * 0.15,
          bbox: { x: 0.1 + i * 0.4 + r() * 0.05, y: 0.45 + r() * 0.1, width: 0.25, height: 0.22 },
          trackId: `V-${1000 + i}`,
        });
      }
      break;
    }
    case "ppe_detection": {
      const n = 2 + Math.floor(r() * 2);
      for (let i = 0; i < n; i++) {
        const compliant = r() > 0.4;
        predictions.push({
          label: compliant ? "person · compliant" : "person · ppe-missing",
          confidence: 0.85 + r() * 0.12,
          bbox: { x: 0.15 + i * 0.3, y: 0.25, width: 0.16, height: 0.55 },
          trackId: `P-${1000 + i}`,
          missing: compliant ? [] : pickRandom(["helmet", "vest", "gloves"], r),
        });
      }
      break;
    }
    case "plate_detection":
    case "plate_ocr": {
      const plates = ["ABC123", "FNK472", "JKL089", "MTR619"];
      const n = 1 + Math.floor(r() * 2);
      for (let i = 0; i < n; i++) {
        predictions.push({
          label: "plate",
          confidence: 0.91 + r() * 0.07,
          bbox: { x: 0.2 + i * 0.4, y: 0.65, width: 0.2, height: 0.07 },
          text: model.id === "plate_ocr" ? plates[Math.floor(r() * plates.length)] : undefined,
        });
      }
      break;
    }
    case "face_detection":
    case "face_recognition_demo": {
      const names = ["Empleado #4172", "Visitante", "Watchlist · ALERTA"];
      const n = 1 + Math.floor(r() * 2);
      for (let i = 0; i < n; i++) {
        predictions.push({
          label: model.id === "face_detection" ? "face" : names[Math.floor(r() * names.length)],
          confidence: 0.88 + r() * 0.1,
          bbox: { x: 0.2 + i * 0.3, y: 0.25, width: 0.13, height: 0.18 },
          trackId: `F-${1000 + i}`,
        });
      }
      break;
    }
    case "pose_detection":
    case "fall_detection_demo": {
      const fall = model.id === "fall_detection_demo" && r() > 0.6;
      const n = 1;
      for (let i = 0; i < n; i++) {
        const cx = 0.3 + r() * 0.4;
        const cy = fall ? 0.7 : 0.4;
        predictions.push({
          label: fall ? "person · fall" : "person",
          confidence: 0.86 + r() * 0.1,
          bbox: { x: cx - 0.08, y: cy - (fall ? 0.04 : 0.2), width: 0.16, height: fall ? 0.08 : 0.4 },
          trackId: `P-${1000 + i}`,
          angle: fall ? 85 + r() * 10 : -5 + r() * 10,
          keypoints: mockKeypoints(cx, cy, fall, r),
        });
      }
      break;
    }
    case "abandoned_object": {
      predictions.push({
        label: "backpack",
        confidence: 0.83 + r() * 0.12,
        bbox: { x: 0.55, y: 0.55, width: 0.1, height: 0.13 },
        trackId: "OBJ-1",
      });
      predictions.push({
        label: "person",
        confidence: 0.92,
        bbox: { x: 0.2, y: 0.3, width: 0.1, height: 0.5 },
        trackId: "T-1001",
      });
      break;
    }
    case "scene_description_vlm": {
      // VLMs no devuelven bboxes — devuelven texto descriptivo
      predictions.push({
        label: "scene_summary",
        confidence: 0.85,
        bbox: { x: 0, y: 0, width: 1, height: 1 },
        text:
          "Escena interior con buena iluminación. Se observan 2 personas caminando hacia el fondo. Una de ellas lleva una mochila azul. Sin actividad anómala detectada.",
      });
      break;
    }
    case "roi_intrusion":
    case "line_crossing":
    case "loitering": {
      // Estos no son detectores de objetos por sí mismos — operan sobre detecciones
      // de personas/vehículos. Para el demo, generamos personas y dejamos que las
      // reglas (ROI, line, loitering) se evalúen sobre ellas.
      const n = 2;
      for (let i = 0; i < n; i++) {
        predictions.push({
          label: "person",
          confidence: 0.86 + r() * 0.1,
          bbox: { x: 0.2 + i * 0.3 + (tick % 8) * 0.04, y: 0.4, width: 0.1, height: 0.4 },
          trackId: `T-${1001 + i}`,
        });
      }
      break;
    }
  }

  // ─────────── Filter by confidence threshold ───────────
  const filtered = predictions.filter((p) => p.confidence >= rules.confidenceThreshold);

  // ─────────── Evaluate rules → events ───────────
  const events: Event[] = evaluateRules(model, filtered, rules, source, now);

  return {
    model: model.id,
    source,
    timestamp: now,
    frameWidth,
    frameHeight,
    predictions: filtered,
    events,
  };
}

// ─────────────────────────── Rules engine ───────────────────────────

function evaluateRules(
  model: VisionModel,
  preds: Prediction[],
  rules: Rules,
  source: string,
  now: string
): Event[] {
  const events: Event[] = [];

  // ROI intrusion
  if (rules.roi && rules.roi.length >= 3) {
    for (const p of preds) {
      const cx = p.bbox.x + p.bbox.width / 2;
      const cy = p.bbox.y + p.bbox.height / 2;
      if (pointInPolygon(cx, cy, rules.roi)) {
        events.push({
          type: "roi_intrusion",
          severity: "high",
          confidence: p.confidence,
          message: `${p.label} detectado dentro de zona restringida`,
          snapshotAvailable: true,
          timestamp: now,
          trackId: p.trackId,
        });
      }
    }
  }

  // Line crossing — simplified: if any person bbox overlaps the line segment
  if (rules.line) {
    for (const p of preds) {
      if (bboxIntersectsLine(p.bbox, rules.line)) {
        events.push({
          type: "line_crossing",
          severity: "medium",
          confidence: p.confidence,
          message: `${p.label} cruzó la línea de conteo`,
          snapshotAvailable: true,
          timestamp: now,
          trackId: p.trackId,
        });
      }
    }
  }

  // Loitering — for demo we just flag the first person as loitering if loiteringSec > 0
  if (rules.loiteringSec && rules.loiteringSec > 0 && preds.length > 0) {
    const p = preds[0];
    events.push({
      type: "loitering",
      severity: "medium",
      confidence: p.confidence,
      message: `Permanencia detectada · ${rules.loiteringSec}s acumulados`,
      snapshotAvailable: true,
      timestamp: now,
      trackId: p.trackId,
    });
  }

  // PPE violation — if model is ppe_detection, emit event for each person with missing items
  if (model.id === "ppe_detection" && rules.alertPpe) {
    for (const p of preds) {
      if (p.missing && p.missing.length > 0) {
        events.push({
          type: "ppe_violation",
          severity: "high",
          confidence: p.confidence,
          message: `Persona sin EPP · falta ${p.missing.join(", ")}`,
          snapshotAvailable: true,
          timestamp: now,
          trackId: p.trackId,
        });
      }
    }
  }

  // Person/object alerts
  if (rules.alertPerson) {
    for (const p of preds.filter((x) => x.label.includes("person"))) {
      events.push({
        type: "person_detected",
        severity: "low",
        confidence: p.confidence,
        message: "Persona detectada",
        snapshotAvailable: true,
        timestamp: now,
        trackId: p.trackId,
      });
    }
  }

  // Model-specific events that always fire when match exists
  if (model.id === "fall_detection_demo") {
    for (const p of preds.filter((x) => x.label.includes("fall"))) {
      events.push({
        type: "fall_detected",
        severity: "critical",
        confidence: p.confidence,
        message: "Caída detectada · personal médico despachado",
        snapshotAvailable: true,
        timestamp: now,
        trackId: p.trackId,
      });
    }
  }
  if (model.id === "abandoned_object") {
    events.push({
      type: "abandoned_object",
      severity: "high",
      confidence: 0.87,
      message: "Objeto abandonado · 47s sin propietario",
      snapshotAvailable: true,
      timestamp: now,
      trackId: "OBJ-1",
    });
  }
  if (model.id === "plate_ocr") {
    for (const p of preds.filter((x) => x.text)) {
      events.push({
        type: "plate_read",
        severity: "low",
        confidence: p.confidence,
        message: `Placa leída · ${p.text}`,
        snapshotAvailable: true,
        timestamp: now,
      });
    }
  }
  if (model.id === "face_recognition_demo") {
    for (const p of preds) {
      const isWatchlist = p.label.includes("Watchlist");
      events.push({
        type: isWatchlist ? "face_unmatched" : "face_matched",
        severity: isWatchlist ? "high" : "low",
        confidence: p.confidence,
        message: isWatchlist
          ? "Rostro en watchlist · alerta"
          : `Rostro coincide con lista blanca · ${p.label}`,
        snapshotAvailable: true,
        timestamp: now,
        trackId: p.trackId,
      });
    }
  }

  return events;
}

// ─────────────────────────── Geometry helpers ───────────────────────────

export function pointInPolygon(
  px: number,
  py: number,
  poly: Array<{ x: number; y: number }>
): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function bboxIntersectsLine(
  b: BBox,
  line: { from: { x: number; y: number }; to: { x: number; y: number } }
): boolean {
  // Use bbox center and check distance to line
  const cx = b.x + b.width / 2;
  const cy = b.y + b.height / 2;
  const { from, to } = line;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-9) return false;
  const t = Math.max(0, Math.min(1, ((cx - from.x) * dx + (cy - from.y) * dy) / lenSq));
  const projX = from.x + t * dx;
  const projY = from.y + t * dy;
  const distSq = (cx - projX) ** 2 + (cy - projY) ** 2;
  return distSq < 0.005; // close enough to line in normalized space
}

function mockKeypoints(
  cx: number,
  cy: number,
  fall: boolean,
  r: () => number
): Array<[number, number, number]> {
  // 17 COCO keypoints (nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles)
  if (fall) {
    return Array.from({ length: 17 }).map((_, i) => [
      cx + (i % 5) * 0.02 - 0.04 + r() * 0.01,
      cy + (Math.floor(i / 5)) * 0.005 + r() * 0.01,
      0.85 + r() * 0.1,
    ]);
  }
  return Array.from({ length: 17 }).map((_, i) => [
    cx + (i % 3 - 1) * 0.04 + r() * 0.01,
    cy - 0.18 + i * 0.028 + r() * 0.005,
    0.85 + r() * 0.1,
  ]);
}

function pickRandom<T>(arr: T[], r: () => number, count = 1): T[] {
  const out: T[] = [];
  const n = Math.min(count + Math.floor(r() * 2), arr.length);
  for (let i = 0; i < n; i++) {
    out.push(arr[Math.floor(r() * arr.length)]);
  }
  return Array.from(new Set(out));
}

// ─────────────────────────── Default rules ───────────────────────────

export const defaultRules: Rules = {
  confidenceThreshold: 0.5,
  roi: undefined,
  line: undefined,
  loiteringSec: 0,
  alertPpe: true,
  alertPerson: false,
  alertObject: true,
};
