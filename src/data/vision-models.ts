/**
 * Catálogo de modelos de visión disponibles en el playground.
 *
 * Cada modelo tiene:
 *   - id estable que matches con backend
 *   - nombre + descripción + qué demuestra
 *   - badges: free/local/external/key
 *   - lista de event types que puede generar
 *   - sources que soporta (image, video, webcam)
 *   - sensitive flag (para mostrar warning en rostros/placas)
 *   - provider sugerido (Roboflow, YOLO, EasyOCR, etc.)
 */

export type ModelBadge = "free" | "local" | "external" | "requires-key";
export type SourceType = "image" | "video" | "webcam" | "rtsp";
export type EventType =
  | "person_detected"
  | "vehicle_detected"
  | "ppe_violation"
  | "plate_read"
  | "face_matched"
  | "face_unmatched"
  | "fall_detected"
  | "roi_intrusion"
  | "line_crossing"
  | "loitering"
  | "abandoned_object"
  | "pose_anomaly"
  | "ocr_text"
  | "scene_described";

export type VisionModel = {
  id: string;
  name: string;
  shortDescription: string;
  whatItDemonstrates: string;
  badges: ModelBadge[];
  sources: SourceType[];
  events: EventType[];
  /** Privacy / legal warnings shown in UI when selected. */
  sensitive: boolean;
  warning?: string;
  provider: string;
  envKeyName?: string;
  category: "people" | "vehicle" | "industrial" | "perimeter" | "ocr" | "experimental";
};

export const visionModels: VisionModel[] = [
  {
    id: "people_detection",
    name: "Detección de personas",
    shortDescription: "Identifica personas y dibuja bounding boxes en cada frame.",
    whatItDemonstrates:
      "Cómo ARS detecta personas en escenas reales, asigna track IDs y mide confidence frame por frame. Base de modelos como conteo, comportamiento e intrusión.",
    badges: ["free", "local"],
    sources: ["image", "video", "webcam"],
    events: ["person_detected", "roi_intrusion", "line_crossing"],
    sensitive: false,
    provider: "Ultralytics YOLO (local) · Roboflow Universe",
    envKeyName: "ROBOFLOW_API_KEY",
    category: "people",
  },
  {
    id: "vehicle_detection",
    name: "Detección de vehículos",
    shortDescription: "Identifica carros, motos, buses y camiones en escena.",
    whatItDemonstrates:
      "Detección y clasificación vehicular como base para LPR, control de acceso y conteo de tráfico.",
    badges: ["free", "local"],
    sources: ["image", "video", "webcam"],
    events: ["vehicle_detected", "roi_intrusion", "line_crossing"],
    sensitive: false,
    provider: "Ultralytics YOLO (local)",
    category: "vehicle",
  },
  {
    id: "ppe_detection",
    name: "EPP · Detección de protección",
    shortDescription: "Verifica casco, chaleco, guantes, botas y gafas.",
    whatItDemonstrates:
      "Cómo ARS valida cumplimiento de seguridad industrial. Detecta personas y verifica si llevan los EPPs requeridos.",
    badges: ["external", "requires-key"],
    sources: ["image", "video", "webcam"],
    events: ["ppe_violation"],
    sensitive: false,
    provider: "Roboflow Universe · construction-ppe",
    envKeyName: "ROBOFLOW_API_KEY",
    category: "industrial",
  },
  {
    id: "plate_detection",
    name: "Detección de placas",
    shortDescription: "Localiza placas vehiculares en la imagen.",
    whatItDemonstrates:
      "Primer paso del LPR — encuentra dónde están las placas. Suele combinarse con OCR.",
    badges: ["external", "requires-key"],
    sources: ["image", "video", "webcam"],
    events: ["plate_read"],
    sensitive: true,
    warning: "El reconocimiento de placas requiere autorización del responsable de datos.",
    provider: "Roboflow · license-plate-recognition",
    envKeyName: "ROBOFLOW_API_KEY",
    category: "vehicle",
  },
  {
    id: "plate_ocr",
    name: "OCR de placas",
    shortDescription: "Lee el texto de las placas detectadas.",
    whatItDemonstrates:
      "Cómo ARS extrae el texto de la matrícula y lo normaliza para comparar contra listas.",
    badges: ["free", "local"],
    sources: ["image", "video", "webcam"],
    events: ["plate_read", "ocr_text"],
    sensitive: true,
    warning: "El OCR de placas requiere autorización del responsable de datos.",
    provider: "EasyOCR / PaddleOCR (local)",
    category: "ocr",
  },
  {
    id: "face_detection",
    name: "Detección facial",
    shortDescription: "Localiza rostros sin identificarlos.",
    whatItDemonstrates:
      "Encuentra rostros en escena. Sólo localización, no identificación. Útil para conteo y blur en publicaciones.",
    badges: ["free", "local"],
    sources: ["image", "video", "webcam"],
    events: ["person_detected"],
    sensitive: true,
    warning:
      "El uso de detección facial debe cumplir con las leyes de protección de datos del país (ej. Habeas Data en Colombia, Ley 29733 en Perú).",
    provider: "InsightFace (local) · MediaPipe Face",
    category: "people",
  },
  {
    id: "face_recognition_demo",
    name: "Reconocimiento facial · Demo",
    shortDescription: "Compara rostros contra una lista demo blanca/negra.",
    whatItDemonstrates:
      "Cómo ARS valida acceso por rostro contra una lista. SOLO en modo demo, en entorno controlado.",
    badges: ["external", "requires-key"],
    sources: ["image", "webcam"],
    events: ["face_matched", "face_unmatched"],
    sensitive: true,
    warning:
      "El reconocimiento facial requiere consentimiento explícito de las personas y cumplimiento normativo. Usar sólo en entornos demo controlados.",
    provider: "InsightFace local · AWS Rekognition (opcional)",
    envKeyName: "AWS_ACCESS_KEY_ID",
    category: "people",
  },
  {
    id: "pose_detection",
    name: "Detección de pose",
    shortDescription: "Estima 17 landmarks corporales por persona.",
    whatItDemonstrates:
      "Base para detección de caídas, posturas anómalas y análisis de comportamiento. Procesamiento local en navegador.",
    badges: ["free", "local"],
    sources: ["image", "video", "webcam"],
    events: ["pose_anomaly"],
    sensitive: false,
    provider: "MediaPipe Pose (local · navegador)",
    category: "people",
  },
  {
    id: "fall_detection_demo",
    name: "Detección de caídas · Demo",
    shortDescription: "Estima caídas analizando pose + tiempo en posición horizontal.",
    whatItDemonstrates:
      "Combina pose detection con un timer: si una persona queda horizontal por > N segundos, dispara alerta crítica.",
    badges: ["free", "local"],
    sources: ["video", "webcam"],
    events: ["fall_detected", "pose_anomaly"],
    sensitive: false,
    provider: "MediaPipe Pose + lógica ARS (local)",
    category: "people",
  },
  {
    id: "roi_intrusion",
    name: "Intrusión en ROI",
    shortDescription: "Persona/vehículo entra en zona poligonal definida.",
    whatItDemonstrates:
      "Regla de negocio aplicada sobre detecciones. Dibujá el polígono y movete dentro/fuera para ver eventos.",
    badges: ["free", "local"],
    sources: ["image", "video", "webcam"],
    events: ["roi_intrusion"],
    sensitive: false,
    provider: "Lógica ARS (local · sobre detecciones)",
    category: "perimeter",
  },
  {
    id: "line_crossing",
    name: "Cruce de línea",
    shortDescription: "Track cruza una línea virtual con dirección detectada.",
    whatItDemonstrates:
      "Conteo de entrada/salida y detección de paso. Definí la línea con 2 clicks y movete a través de ella.",
    badges: ["free", "local"],
    sources: ["video", "webcam"],
    events: ["line_crossing"],
    sensitive: false,
    provider: "Lógica ARS (local · tracking + intersección)",
    category: "perimeter",
  },
  {
    id: "loitering",
    name: "Merodeo / Permanencia",
    shortDescription: "Track permanece en zona más de N segundos.",
    whatItDemonstrates:
      "Timer sobre tracks dentro de un ROI. Útil para detectar comportamiento sospechoso o filas largas.",
    badges: ["free", "local"],
    sources: ["video", "webcam"],
    events: ["loitering"],
    sensitive: false,
    provider: "Lógica ARS (local)",
    category: "perimeter",
  },
  {
    id: "abandoned_object",
    name: "Objeto abandonado",
    shortDescription: "Detecta objetos estáticos sin persona en proximidad.",
    whatItDemonstrates:
      "Mochilas, paquetes o equipajes que quedan solos por > N segundos. Crítico en aeropuertos y plazas.",
    badges: ["external", "requires-key"],
    sources: ["video", "webcam"],
    events: ["abandoned_object"],
    sensitive: false,
    provider: "Roboflow + lógica ARS",
    envKeyName: "ROBOFLOW_API_KEY",
    category: "perimeter",
  },
  {
    id: "scene_description_vlm",
    name: "Descripción de escena · VLM",
    shortDescription: "Modelo multimodal describe la escena en lenguaje natural.",
    whatItDemonstrates:
      "Experimental. Un VLM (Vision-Language Model) describe lo que está pasando en la escena. Útil para auditoría y reportes.",
    badges: ["external", "requires-key"],
    sources: ["image"],
    events: ["scene_described"],
    sensitive: false,
    warning: "Modo experimental. Latencia alta y costo por inferencia. Sólo para evaluación.",
    provider: "Hugging Face / Google Vision / GPT-4V",
    envKeyName: "HF_TOKEN",
    category: "experimental",
  },
];

export const modelCategories: Record<VisionModel["category"], string> = {
  people: "Personas",
  vehicle: "Vehículos",
  industrial: "Industrial",
  perimeter: "Perímetro y reglas",
  ocr: "OCR",
  experimental: "Experimental",
};

export const badgeMeta: Record<ModelBadge, { label: string; color: string; description: string }> = {
  free: {
    label: "Gratis",
    color: "rgb(34, 197, 94)",
    description: "Sin costo asociado al uso del modelo.",
  },
  local: {
    label: "Local",
    color: "rgb(59, 130, 246)",
    description: "Corre en el servidor / dispositivo, sin enviar datos a terceros.",
  },
  external: {
    label: "API externa",
    color: "rgb(168, 85, 247)",
    description: "Llama a un servicio externo (Roboflow, AWS, GCP, etc.).",
  },
  "requires-key": {
    label: "Requiere key",
    color: "rgb(234, 179, 8)",
    description: "Necesita una variable de entorno configurada para funcionar.",
  },
};
