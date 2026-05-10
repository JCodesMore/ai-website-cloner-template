# Vision Demo API · Spec

Backend técnico para `/vision-lab`. Fase 1 corre con `mockPredict()` en
`src/lib/vision-mock.ts`. Cuando este servicio esté disponible, se reemplaza
la llamada por `fetch('/api/vision-demo/predict/frame', …)` y la UI
sigue funcionando sin cambios.

## Stack sugerido

- **Runtime**: Python 3.11 + FastAPI + Uvicorn
- **Modelos locales**: Ultralytics YOLO, MediaPipe, EasyOCR, InsightFace
- **API externas**: Roboflow Universe, Google Vision, AWS Rekognition,
  Azure Vision, Hugging Face Inference API
- **Inferencia**: CPU-first; GPU opcional (CUDA o Apple Metal)
- **Despliegue**: Docker container detrás de Next.js (proxy `/api/vision-demo/*`)

## Endpoints

### `GET /api/vision-demo/models`

Devuelve el catálogo de modelos disponibles según la configuración del
backend (qué API keys están presentes, qué modelos locales están bajados).

**Response** `200 OK`

```json
{
  "models": [
    {
      "id": "people_detection",
      "name": "Detección de personas",
      "available": true,
      "provider": "ultralytics-yolo",
      "version": "yolov8n.pt"
    },
    {
      "id": "ppe_detection",
      "name": "EPP",
      "available": false,
      "reason": "ROBOFLOW_API_KEY no configurada"
    }
  ]
}
```

### `POST /api/vision-demo/predict/image`

Predicción sobre una imagen (multipart o base64).

**Request**

```http
POST /api/vision-demo/predict/image
Content-Type: multipart/form-data

file=<binary>
modelType=people_detection
config={"confidenceThreshold": 0.5}
```

O JSON con base64:

```json
{
  "imageBase64": "data:image/jpeg;base64,…",
  "modelType": "people_detection",
  "config": { "confidenceThreshold": 0.5 }
}
```

**Response** — formato unificado (matches `PredictResponse` en
`src/lib/vision-mock.ts`):

```json
{
  "model": "people_detection",
  "source": "image",
  "timestamp": "2026-05-10T03:42:11.241Z",
  "frameWidth": 1280,
  "frameHeight": 720,
  "predictions": [
    {
      "label": "person",
      "confidence": 0.91,
      "bbox": { "x": 0.12, "y": 0.31, "width": 0.18, "height": 0.55 },
      "trackId": "T-1001"
    }
  ],
  "events": []
}
```

> Las coordenadas del `bbox` están **normalizadas a [0..1]** sobre las
> dimensiones del frame. Esto evita problemas de resize en cliente.

### `POST /api/vision-demo/predict/frame`

Predicción sobre un frame individual (base64). Usado por la UI cuando
está en modo webcam (manda 1-2 fps de muestreo).

```json
{
  "frameBase64": "…",
  "modelType": "people_detection",
  "config": { "confidenceThreshold": 0.5, "trackingEnabled": true },
  "sessionId": "abc-123"
}
```

`sessionId` permite mantener tracking entre frames (asignar mismo `trackId`
si el bbox es similar al frame anterior).

### `POST /api/vision-demo/predict/video`

Procesa un video corto (< 30s). Devuelve **eventos resumidos**, no todos
los frames. Para evitar timeouts, devolver `202 Accepted` con un `jobId` y
exponer:

- `GET /api/vision-demo/predict/video/:jobId` → estado + resultado parcial
- WebSocket `/api/vision-demo/predict/video/:jobId/stream` → progress en vivo

### `POST /api/vision-demo/rules/evaluate`

Evalúa reglas de negocio sobre detecciones existentes (sin re-correr el
modelo). Útil para que el cliente cambie ROI/línea sin re-procesar.

**Request**

```json
{
  "predictions": [/* array de Prediction */],
  "rules": {
    "confidenceThreshold": 0.5,
    "roi": [{"x":0.1,"y":0.1},{"x":0.5,"y":0.1},{"x":0.5,"y":0.5},{"x":0.1,"y":0.5}],
    "line": { "from": {"x":0,"y":0.5}, "to": {"x":1,"y":0.5} },
    "loiteringSec": 30,
    "alertPpe": true,
    "alertPerson": false,
    "alertObject": true
  }
}
```

**Response** — array de eventos:

```json
{
  "events": [
    {
      "type": "roi_intrusion",
      "severity": "high",
      "confidence": 0.91,
      "message": "Person detected inside restricted zone",
      "snapshotAvailable": true,
      "timestamp": "2026-05-10T03:42:11.241Z",
      "trackId": "T-1001"
    }
  ]
}
```

## Catálogo de modelos · implementación sugerida

| ID | Provider sugerido | Local? | Key requerida |
|---|---|---|---|
| `people_detection`        | Ultralytics YOLOv8n          | ✅ | — |
| `vehicle_detection`       | Ultralytics YOLOv8n (COCO clases 2,3,5,7) | ✅ | — |
| `ppe_detection`           | Roboflow `construction-ppe`  | ❌ | `ROBOFLOW_API_KEY` |
| `plate_detection`         | Roboflow `license-plate-recognition` | ❌ | `ROBOFLOW_API_KEY` |
| `plate_ocr`               | EasyOCR / PaddleOCR          | ✅ | — |
| `face_detection`          | InsightFace SCRFD            | ✅ | — |
| `face_recognition_demo`   | InsightFace ArcFace + lista local | ✅ | — |
| `pose_detection`          | MediaPipe Pose               | ✅ | — |
| `fall_detection_demo`     | MediaPipe Pose + lógica ARS  | ✅ | — |
| `roi_intrusion`           | Sin modelo · regla pura       | ✅ | — |
| `line_crossing`           | Sin modelo · regla + tracking | ✅ | — |
| `loitering`               | Sin modelo · regla + timer    | ✅ | — |
| `abandoned_object`        | YOLO + lógica temporal       | ✅ | — |
| `scene_description_vlm`   | HF `Salesforce/blip2-opt-2.7b` o GPT-4V | ❌ | `HF_TOKEN` |

## Reglas de evaluación

### ROI intrusion
```python
def in_polygon(point, polygon):
    # Ray casting algorithm — same as src/lib/vision-mock.ts:pointInPolygon
    ...

for pred in predictions:
    cx = pred.bbox.x + pred.bbox.width / 2
    cy = pred.bbox.y + pred.bbox.height / 2
    if in_polygon((cx, cy), rules.roi):
        events.append(Event(type="roi_intrusion", ...))
```

### Line crossing
Necesita tracking entre frames. Comparar la posición del centro del bbox
en frame anterior vs frame actual:

```python
def crossed_line(prev_pos, curr_pos, line):
    # Segment intersection between (prev → curr) and the rule's line
    return segments_intersect(prev_pos, curr_pos, line.from, line.to)
```

Mantener un dict `{trackId: last_position}` por sessionId.

### Loitering
```python
# Por cada track dentro del ROI, acumular tiempo
if in_polygon(center, rules.roi):
    track_state[trackId].time_in_roi += dt
    if track_state[trackId].time_in_roi > rules.loiteringSec:
        events.append(Event(type="loitering", ...))
else:
    track_state[trackId].time_in_roi = 0
```

### PPE violation
```python
# Después de detectar persona + items EPP por separado
for person in person_detections:
    person_box = person.bbox
    detected_items = [i for i in ppe_items if iou(person_box, i.bbox) > 0.3]
    missing = REQUIRED_PPE - {i.label for i in detected_items}
    if missing:
        events.append(Event(type="ppe_violation", missing=list(missing), ...))
```

### Fall detection
```python
# Pose landmarks → ángulo del torso (hombros vs caderas)
shoulder = (kp[5] + kp[6]) / 2
hip = (kp[11] + kp[12]) / 2
torso_angle = atan2(hip.y - shoulder.y, hip.x - shoulder.x)

if abs(torso_angle - 90deg) < threshold and is_inactive_for(N_seconds):
    events.append(Event(type="fall_detected", severity="critical", ...))
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar las que necesitás:

```bash
# Roboflow Universe (free tier disponible)
ROBOFLOW_API_KEY=          # https://universe.roboflow.com → Settings → API
ROBOFLOW_API_URL=https://detect.roboflow.com

# Google Cloud (Vision API + Video Intelligence)
GOOGLE_CLOUD_PROJECT=
GOOGLE_APPLICATION_CREDENTIALS=  # path al JSON de service account

# AWS Rekognition
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Azure AI Vision / Face API
AZURE_VISION_ENDPOINT=
AZURE_VISION_KEY=

# Hugging Face Inference (VLMs)
HF_TOKEN=

# Modo de operación
USE_LOCAL_MODELS=true  # si false, intenta APIs externas primero
```

**Reglas de seguridad:**

- Nunca commits las keys reales. Solo `.env.example` va al repo.
- En el frontend, las keys NO deben aparecer (`process.env.NEXT_PUBLIC_*`
  está prohibido para keys sensibles).
- Las llamadas a APIs externas se hacen **siempre** desde el backend, no
  desde el navegador.
- Si una key no está configurada, el backend devuelve `available: false`
  para ese modelo en `/api/vision-demo/models` y la UI lo muestra
  deshabilitado en lugar de fallar.

## Cuotas y costo aproximado

| Provider | Free tier | Costo después |
|---|---|---|
| Roboflow Universe | 1,000 inferencias/mes | $0.001 / inferencia |
| Google Vision | 1,000 unidades/mes gratis | $1.50 / 1K |
| AWS Rekognition | 5,000 imágenes/mes (12 meses) | $1.00 / 1K |
| Azure AI Vision | 5,000 transacciones/mes | $1.00 / 1K |
| Hugging Face | Limitado por modelo | Variable |

## Estructura sugerida del repo backend

```
vision-demo-api/
├── app/
│   ├── main.py                  # FastAPI app + routing
│   ├── models/
│   │   ├── people.py            # YOLO people detection
│   │   ├── vehicle.py
│   │   ├── ppe_roboflow.py      # Cliente Roboflow
│   │   ├── plate_easyocr.py
│   │   ├── face_insight.py
│   │   ├── pose_mediapipe.py
│   │   └── vlm_hf.py
│   ├── rules/
│   │   ├── roi.py
│   │   ├── line_crossing.py
│   │   ├── loitering.py
│   │   ├── ppe.py
│   │   └── fall.py
│   ├── tracking/
│   │   └── byte_track.py        # Para track IDs estables
│   ├── schemas.py               # Pydantic models matching frontend
│   └── config.py
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Cliente desde Next.js

Reemplazar `mockPredict()` en `src/lib/vision-mock.ts` por:

```ts
export async function predictFrame(
  frameBase64: string,
  modelId: string,
  rules: Rules
): Promise<PredictResponse> {
  const res = await fetch("/api/vision-demo/predict/frame", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      frameBase64,
      modelType: modelId,
      config: rules,
    }),
  });
  if (!res.ok) throw new Error(`Vision API error: ${res.status}`);
  return res.json();
}
```

Y en `next.config.ts` añadir un rewrite si el backend corre separado:

```ts
async rewrites() {
  return [
    {
      source: "/api/vision-demo/:path*",
      destination: process.env.VISION_API_URL
        ? `${process.env.VISION_API_URL}/api/vision-demo/:path*`
        : "/api/vision-demo/:path*",
    },
  ];
}
```

## Roadmap

| Fase | Status | Entregable |
|---|---|---|
| **1. UI + mock** | ✅ Done | `/vision-lab` con mock predictions |
| **2. Backend local** | ⏳ Pending | FastAPI + YOLO + EasyOCR + MediaPipe |
| **3. Reglas + eventos** | ⏳ Pending | ROI / line / loitering / fall en backend |
| **4. Cloud opcional** | ⏳ Pending | Roboflow / GCP / AWS / Azure / HF |

---

**Importante:** No modificar módulos productivos de visión sin aprobación.
Este servicio es **demo-only** y debe correr en un namespace/puerto
separado (`vision-demo-api`) del pipeline productivo.
