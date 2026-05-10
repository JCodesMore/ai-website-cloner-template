/**
 * Catálogo de capacidades de IA / analíticas que ofrece ARS Intelligence.
 *
 * Cada capacidad tiene:
 *   - id estable
 *   - nombre + descripción + tagline corta
 *   - tipo de overlay sintético para la demo (decide qué dibuja DemoOverlay)
 *   - lista de casos de uso típicos
 *   - imagen ilustración del producto (asset del usuario)
 *
 * Las "muestras" no usan video real — se compone una escena sintética con
 * la ilustración como fondo + bounding boxes animados encima. Eso permite
 * que el cliente entienda el patrón de detección sin necesidad de subir
 * footage real.
 */

export type DemoType =
  | "face"
  | "lpr"
  | "ppe"
  | "intrusion"
  | "behavior"
  | "people-count"
  | "thermal"
  | "vehicle"
  | "object"
  | "fall"
  | "fire"
  | "crowd";

export type AICapability = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  demoType: DemoType;
  hero: string;
  useCases: string[];
  // For the AI models grid card
  metric: { label: string; value: string };
  category: "people" | "vehicle" | "industrial" | "perimeter" | "ops";
};

const F = (n: string) => `/images/features/${n}.png`;

export const aiCapabilities: AICapability[] = [
  {
    id: "facial",
    name: "Reconocimiento facial",
    tagline: "Listas de interés + búsqueda histórica por rostro",
    description:
      "Identifica personas en tiempo real contra listas de empleados, visitantes o personas de interés. Búsqueda histórica por rostro en grabaciones, alertas instantáneas en accesos restringidos y trazabilidad de paso por zonas.",
    demoType: "face",
    hero: F("06-reconocimiento-facial"),
    useCases: [
      "Control de acceso a zonas restringidas",
      "Detección de personas en watchlist",
      "Búsqueda histórica por rostro",
      "Conteo de visitantes únicos",
    ],
    metric: { label: "Precisión", value: "98.7%" },
    category: "people",
  },
  {
    id: "lpr",
    name: "Lectura de placas (LPR)",
    tagline: "OCR de matrículas vehiculares en tiempo real",
    description:
      "Lectura automática de placas de carros, motos y tracto-camiones en accesos vehiculares. Cruza contra listas blancas/negras, registra hora de entrada/salida, y genera reportes para auditoría y control de acceso.",
    demoType: "lpr",
    hero: F("07-lpr"),
    useCases: [
      "Acceso vehicular automatizado",
      "Auditoría de tránsito en patios",
      "Control de tracto-camiones en puertos",
      "Gestión de parqueaderos",
    ],
    metric: { label: "Lectura", value: "99.2%" },
    category: "vehicle",
  },
  {
    id: "ppe",
    name: "EPP · Equipos de protección",
    tagline: "Verificación automática de cumplimiento de seguridad industrial",
    description:
      "Detecta uso correcto de casco, chaleco reflectivo, guantes, gafas y otros elementos de protección personal en zonas operativas. Genera evidencia para auditoría y alerta a supervisores en cumplimiento.",
    demoType: "ppe",
    hero: F("09-epp"),
    useCases: [
      "Cumplimiento en plantas industriales",
      "Acceso a zonas peligrosas",
      "Auditoría de SST",
      "Reporte de no-conformidades",
    ],
    metric: { label: "Coverage", value: "5 EPPs" },
    category: "industrial",
  },
  {
    id: "intrusion",
    name: "Intrusión y cruce de línea",
    tagline: "Reglas perimetrales con áreas de interés (ROI)",
    description:
      "Detección de intrusión en perímetros y cruce de líneas virtuales. Define ROIs específicos por cámara con horarios, tipos de objeto permitidos y nivel de severidad. Alertas inmediatas al CCO.",
    demoType: "intrusion",
    hero: F("08-intrusion-roi"),
    useCases: [
      "Perímetros de plantas industriales",
      "Zonas peligrosas restringidas",
      "Detección nocturna",
      "Control de acceso vehicular",
    ],
    metric: { label: "Latencia", value: "< 1s" },
    category: "perimeter",
  },
  {
    id: "behavior",
    name: "Análisis de comportamiento",
    tagline: "Detecta patrones anómalos: peleas, merodeo, aglomeración",
    description:
      "Modelos de comportamiento que identifican peleas, merodeo, abandono de objetos, aglomeración inusual y patrones que se desvían del flujo normal. Alerta priorizada con clip de evidencia.",
    demoType: "behavior",
    hero: F("05-deteccion-personas"),
    useCases: [
      "Detección de hurto en retail",
      "Peleas en espacios públicos",
      "Merodeo en perímetros",
      "Aglomeración en filas",
    ],
    metric: { label: "Patrones", value: "8+" },
    category: "people",
  },
  {
    id: "people-count",
    name: "Conteo de personas",
    tagline: "Aforo, mapas de calor y línea de tiempo de circulación",
    description:
      "Conteo en tiempo real de personas que entran/salen por una zona. Mapas de calor de circulación, picos de afluencia, tiempos promedio de permanencia y reportes históricos por hora/día/mes.",
    demoType: "people-count",
    hero: F("05-deteccion-personas"),
    useCases: [
      "Aforo en centros comerciales",
      "Filas en aeropuertos",
      "Ocupación de oficinas",
      "Mapas de calor en retail",
    ],
    metric: { label: "Precisión", value: "96.5%" },
    category: "people",
  },
  {
    id: "thermal",
    name: "Visión térmica",
    tagline: "Monitoreo nocturno y detección de calor",
    description:
      "Imagen térmica para perímetros nocturnos, detección de personas/vehículos en oscuridad total, identificación de focos de calor anómalos en plantas industriales y monitoreo de equipos críticos.",
    demoType: "thermal",
    hero: F("08-intrusion-roi"),
    useCases: [
      "Perímetros nocturnos",
      "Detección en oscuridad total",
      "Equipos sobrecalentándose",
      "Monitoreo de subestaciones",
    ],
    metric: { label: "Rango", value: "350m" },
    category: "perimeter",
  },
  {
    id: "vehicle",
    name: "Clasificación vehicular",
    tagline: "Identifica tipo, marca, color y dirección del vehículo",
    description:
      "Más allá de la placa: clasifica el vehículo por tipo (carro, moto, bus, camión), marca aproximada, color y dirección de marcha. Útil para flujos de tráfico, accesos y forensia.",
    demoType: "vehicle",
    hero: F("07-lpr"),
    useCases: [
      "Control de acceso por tipo",
      "Conteo de tráfico vehicular",
      "Búsqueda forense por color/tipo",
      "Detección de vehículos sospechosos",
    ],
    metric: { label: "Clases", value: "12+" },
    category: "vehicle",
  },
  {
    id: "object",
    name: "Detección y abandono de objetos",
    tagline: "Mochilas, paquetes, equipajes — alerta de objeto abandonado",
    description:
      "Detecta objetos abandonados en zonas críticas (aeropuertos, terminales, plazas). Discrimina entre objetos en posesión y abandonados con un timer configurable. Útil para anti-terrorismo y operación.",
    demoType: "object",
    hero: F("10-alertas-evidencia"),
    useCases: [
      "Aeropuertos y terminales",
      "Plazas y espacios públicos",
      "Estaciones de metro",
      "Auditorios y eventos",
    ],
    metric: { label: "Tiempo trigger", value: "30s" },
    category: "ops",
  },
  {
    id: "fall",
    name: "Detección de caídas",
    tagline: "Caídas de personas, accidentes industriales y emergencias",
    description:
      "Identifica caídas de personas en pasillos, escaleras y zonas de riesgo. Alerta inmediata al equipo médico/seguridad con clip de evidencia. Crítico en hospitales, geriátricos y plantas.",
    demoType: "fall",
    hero: F("10-alertas-evidencia"),
    useCases: [
      "Hospitales y geriátricos",
      "Plantas industriales",
      "Estaciones de metro",
      "Espacios públicos con escaleras",
    ],
    metric: { label: "Respuesta", value: "< 3s" },
    category: "people",
  },
  {
    id: "fire",
    name: "Detección de fuego y humo",
    tagline: "Identifica humo y llamas mucho antes que un sensor tradicional",
    description:
      "Modelo visual que reconoce humo y llamas en imagen, complementando los detectores físicos. Útil donde un sensor de humo tradicional no llega: bodegas grandes, exteriores, túneles, espacios abiertos.",
    demoType: "fire",
    hero: F("10-alertas-evidencia"),
    useCases: [
      "Bodegas y plantas",
      "Bosques y exteriores",
      "Túneles y subterráneos",
      "Centros logísticos",
    ],
    metric: { label: "Detección", value: "< 15s" },
    category: "ops",
  },
  {
    id: "crowd",
    name: "Aglomeración y densidad",
    tagline: "Estima multitudes, detecta saturación y congestión",
    description:
      "Estimación de densidad de personas en escenas con multitudes. Detecta cuando una zona pasa de su límite seguro y alerta al operador para tomar acción. Esencial en estaciones, eventos, centros comerciales.",
    demoType: "crowd",
    hero: F("05-deteccion-personas"),
    useCases: [
      "Estaciones de metro",
      "Eventos masivos",
      "Centros comerciales en temporada",
      "Estadios y conciertos",
    ],
    metric: { label: "Personas", value: "1000+" },
    category: "people",
  },
];

export const categoryLabels: Record<AICapability["category"], string> = {
  people: "Personas",
  vehicle: "Vehículos",
  industrial: "Industrial",
  perimeter: "Perímetro",
  ops: "Operación",
};
