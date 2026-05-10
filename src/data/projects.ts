/**
 * ARS Intelligence — operations across Latin America.
 *
 * Two-level data model:
 *   - City: a marker on the LATAM map (Bogotá, Lima, Medellín…).
 *   - Project: an individual installation inside a city, with precise
 *     coordinates, gallery, stats and integrations.
 *
 * Coordinates are WGS84 (lat/lng). The map projects them with d3-geo
 * (Mercator) — see `src/components/LatamMap.tsx`.
 *
 * Verticals, addresses, camera counts and stats are placeholder data based
 * on typical ARS operations. Replace with real values when available.
 */

export type Country = "CO" | "PE";

export type IntegrationTag =
  | "facial"
  | "lpr"
  | "epp"
  | "intrusion"
  | "behavior"
  | "people-count"
  | "thermal"
  | "guard"
  | "access"
  | "perimeter"
  | "alarm"
  | "iot";

export type Project = {
  id: string;
  cityId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  vertical: string;
  tagline: string;
  description: string;
  hero: string;
  gallery: string[];
  videoEmbed?: string;
  integrations: IntegrationTag[];
  stats: {
    cameras: number;
    aiModels: number;
    eventsPerDay: number;
    uptimePct: number;
    avgResponseSec: number;
    physicalGuards: number;
    /** Alertas críticas / día (opcional) */
    alertsPerDay?: number;
    /** Cobertura aproximada en m² (opcional) */
    coverageM2?: number;
    /** Retención de video en días (opcional) */
    recordingDays?: number;
    /** NVRs / servidores instalados (opcional) */
    nvrCount?: number;
    /** Ancho de banda dedicado en Mbps (opcional) */
    networkMbps?: number;
  };
};

export type City = {
  id: string;
  name: string;
  region: string;
  country: Country;
  lat: number;
  lng: number;
  tier: "primary" | "secondary";
};

export const cities: City[] = [
  { id: "co-bogota", name: "Bogotá D.C.", region: "Cundinamarca", country: "CO", lat: 4.711, lng: -74.072, tier: "primary" },
  { id: "co-medellin", name: "Medellín", region: "Antioquia", country: "CO", lat: 6.244, lng: -75.582, tier: "primary" },
  { id: "co-cali", name: "Cali", region: "Valle del Cauca", country: "CO", lat: 3.452, lng: -76.532, tier: "primary" },
  { id: "co-barranquilla", name: "Barranquilla", region: "Atlántico", country: "CO", lat: 10.963, lng: -74.796, tier: "primary" },
  { id: "co-cartagena", name: "Cartagena", region: "Bolívar", country: "CO", lat: 10.391, lng: -75.514, tier: "secondary" },
  { id: "co-bucaramanga", name: "Bucaramanga", region: "Santander", country: "CO", lat: 7.119, lng: -73.123, tier: "secondary" },
  { id: "co-pereira", name: "Pereira", region: "Risaralda", country: "CO", lat: 4.812, lng: -75.694, tier: "secondary" },
  { id: "co-cucuta", name: "Cúcuta", region: "Norte de Santander", country: "CO", lat: 7.893, lng: -72.507, tier: "secondary" },
  { id: "pe-lima", name: "Lima", region: "Lima Metropolitana", country: "PE", lat: -12.046, lng: -77.043, tier: "primary" },
];

// Helper to compose galleries from ARS feature illustrations
const F = (n: string) => `/images/features/${n}.png`;
const HERO_PALETTE = [
  F("01-intro"),
  F("02-central-monitoreo"),
  F("03-camaras-nvr"),
  F("04-ia-por-camara"),
  F("05-deteccion-personas"),
  F("06-reconocimiento-facial"),
  F("07-lpr"),
  F("08-intrusion-roi"),
  F("09-epp"),
  F("10-alertas-evidencia"),
];

function gallery(seed: number, count = 5) {
  return Array.from({ length: count }, (_, i) => HERO_PALETTE[(seed + i) % HERO_PALETTE.length]);
}

export const projects: Project[] = [
  // ──────────────────────────── BOGOTÁ ────────────────────────────
  {
    id: "co-bog-aeropuerto-eldorado",
    cityId: "co-bogota",
    name: "Aeropuerto El Dorado · Terminal Internacional",
    address: "Av. El Dorado, Bogotá",
    lat: 4.7016,
    lng: -74.1469,
    vertical: "Aeroportuario · Movilidad",
    tagline: "Más de 30 millones de pasajeros bajo análisis continuo.",
    description:
      "Despliegue integral en el principal aeropuerto del país con reconocimiento facial en zonas restringidas, LPR en accesos vehiculares y conteo de personas en filas críticas. Integrado al centro de mando con guardias en sitio 24/7.",
    hero: F("06-reconocimiento-facial"),
    gallery: gallery(5, 6),
    integrations: ["facial", "lpr", "people-count", "intrusion", "guard", "access"],
    stats: { cameras: 420, aiModels: 7, eventsPerDay: 18500, uptimePct: 99.96, avgResponseSec: 4, physicalGuards: 86 },
  },
  {
    id: "co-bog-centro-comercial-andino",
    cityId: "co-bogota",
    name: "Centro Comercial Premium · Zona T",
    address: "Cra. 11 #82, Bogotá",
    lat: 4.6675,
    lng: -74.0533,
    vertical: "Retail · Hospitalidad",
    tagline: "Conteo de aforo + analítica de comportamiento en tiempo real.",
    description:
      "Cobertura full del centro comercial con conteo de aforo por planta, mapas de calor de circulación, detección de comportamiento anómalo y reconocimiento facial en accesos. Equipo de seguridad física conectado al tablero ARS.",
    hero: F("05-deteccion-personas"),
    gallery: gallery(2, 6),
    integrations: ["facial", "people-count", "behavior", "intrusion", "guard"],
    stats: { cameras: 215, aiModels: 5, eventsPerDay: 9200, uptimePct: 99.92, avgResponseSec: 6, physicalGuards: 24 },
  },
  {
    id: "co-bog-centro-logistico-norte",
    cityId: "co-bogota",
    name: "Centro Logístico Norte",
    address: "Autopista Norte km 21, Cundinamarca",
    lat: 4.795,
    lng: -74.045,
    vertical: "Logística · Industrial",
    tagline: "Trazabilidad completa de carga, vehículos y personal.",
    description:
      "Lectura automática de placas de tracto-camiones en accesos, control de zonas ROI en patios de maniobra, detección de EPP en zonas operativas y monitoreo perimetral con guardias virtuales.",
    hero: F("07-lpr"),
    gallery: gallery(6, 5),
    integrations: ["lpr", "epp", "perimeter", "intrusion", "iot", "guard"],
    stats: { cameras: 168, aiModels: 6, eventsPerDay: 11400, uptimePct: 99.88, avgResponseSec: 5, physicalGuards: 18 },
  },
  {
    id: "co-bog-edificio-corporativo",
    cityId: "co-bogota",
    name: "Torre Corporativa · Centro Internacional",
    address: "Cl. 26 #69, Bogotá",
    lat: 4.6485,
    lng: -74.0815,
    vertical: "Corporativo · Acceso",
    tagline: "Control de acceso facial a 32 pisos.",
    description:
      "Sistema integrado de control de acceso por reconocimiento facial, lectura de placas en parqueaderos y monitoreo continuo del perímetro y puntos críticos.",
    hero: F("06-reconocimiento-facial"),
    gallery: gallery(0, 5),
    integrations: ["facial", "access", "lpr", "intrusion", "alarm"],
    stats: { cameras: 96, aiModels: 4, eventsPerDay: 5400, uptimePct: 99.95, avgResponseSec: 3, physicalGuards: 12 },
  },

  // ──────────────────────────── MEDELLÍN ────────────────────────────
  {
    id: "co-med-planta-industrial",
    cityId: "co-medellin",
    name: "Planta Industrial · Itagüí",
    address: "Cra. 50A, Itagüí, Antioquia",
    lat: 6.184,
    lng: -75.611,
    vertical: "Industrial · EPP",
    tagline: "Cumplimiento de seguridad industrial verificado por IA.",
    description:
      "Detección automática de uso correcto de EPP (casco, chaleco, guantes), control de zonas peligrosas, perímetro vigilado y reportes de cumplimiento operacional para auditoría.",
    hero: F("09-epp"),
    gallery: gallery(8, 6),
    integrations: ["epp", "intrusion", "behavior", "guard", "perimeter", "iot"],
    stats: { cameras: 142, aiModels: 5, eventsPerDay: 7800, uptimePct: 99.91, avgResponseSec: 5, physicalGuards: 22 },
  },
  {
    id: "co-med-metro-estaciones",
    cityId: "co-medellin",
    name: "Sistema Metro · 6 estaciones",
    address: "Línea A, Medellín",
    lat: 6.247,
    lng: -75.575,
    vertical: "Movilidad · Transporte público",
    tagline: "Aforo, comportamiento y respuesta a incidentes.",
    description:
      "Cobertura de 6 estaciones del metro con conteo de aforo por anden, detección de caídas, comportamiento anómalo y conexión directa al CCO con guardias y operadores.",
    hero: F("05-deteccion-personas"),
    gallery: gallery(4, 5),
    integrations: ["people-count", "behavior", "facial", "intrusion", "guard", "alarm"],
    stats: { cameras: 188, aiModels: 6, eventsPerDay: 14200, uptimePct: 99.85, avgResponseSec: 7, physicalGuards: 36 },
  },
  {
    id: "co-med-zona-rosa",
    cityId: "co-medellin",
    name: "Zona Rosa · Hotelería",
    address: "El Poblado, Medellín",
    lat: 6.207,
    lng: -75.567,
    vertical: "Hospitalidad · Retail",
    tagline: "Vigilancia integrada en zona de alta afluencia turística.",
    description:
      "Operación coordinada con 14 hoteles y restaurantes: reconocimiento facial en lobbies, LPR en parqueaderos, detección de comportamiento sospechoso en exteriores.",
    hero: F("06-reconocimiento-facial"),
    gallery: gallery(1, 5),
    integrations: ["facial", "lpr", "behavior", "intrusion", "guard"],
    stats: { cameras: 124, aiModels: 4, eventsPerDay: 6300, uptimePct: 99.9, avgResponseSec: 5, physicalGuards: 28 },
  },

  // ──────────────────────────── CALI ────────────────────────────
  {
    id: "co-cli-universidad",
    cityId: "co-cali",
    name: "Campus Universitario",
    address: "Calle 5 #36, Cali",
    lat: 3.375,
    lng: -76.534,
    vertical: "Educación · Acceso",
    tagline: "Control facial de acceso para 38 mil estudiantes.",
    description:
      "Reconocimiento facial en accesos, conteo en aulas y bibliotecas, monitoreo perimetral del campus y guardias integrados al tablero unificado.",
    hero: F("06-reconocimiento-facial"),
    gallery: gallery(3, 5),
    integrations: ["facial", "access", "people-count", "perimeter", "guard"],
    stats: { cameras: 156, aiModels: 4, eventsPerDay: 8800, uptimePct: 99.93, avgResponseSec: 4, physicalGuards: 19 },
  },
  {
    id: "co-cli-centro-comercial",
    cityId: "co-cali",
    name: "Centro Comercial Sur",
    address: "Av. Pasoancho, Cali",
    lat: 3.396,
    lng: -76.541,
    vertical: "Retail",
    tagline: "Aforo + LPR + comportamiento en tienda.",
    description:
      "Sistema integral de retail: conteo por hora, mapas de calor, detección de hurto y LPR en parqueaderos. Equipo físico de seguridad recibe alertas priorizadas.",
    hero: F("05-deteccion-personas"),
    gallery: gallery(7, 5),
    integrations: ["people-count", "lpr", "behavior", "facial", "guard"],
    stats: { cameras: 98, aiModels: 5, eventsPerDay: 5100, uptimePct: 99.89, avgResponseSec: 5, physicalGuards: 14 },
  },
  {
    id: "co-cli-hospital",
    cityId: "co-cali",
    name: "Hospital Universitario",
    address: "Cra. 36, Cali",
    lat: 3.426,
    lng: -76.546,
    vertical: "Salud",
    tagline: "Vigilancia clínica con detección de caídas.",
    description:
      "Monitoreo de pasillos críticos, zonas de UCI, detección de caídas y comportamiento anómalo. Integración con personal de seguridad y enfermería.",
    hero: F("10-alertas-evidencia"),
    gallery: gallery(9, 4),
    integrations: ["behavior", "facial", "people-count", "alarm", "guard"],
    stats: { cameras: 78, aiModels: 4, eventsPerDay: 3200, uptimePct: 99.94, avgResponseSec: 3, physicalGuards: 16 },
  },

  // ──────────────────────────── BARRANQUILLA ────────────────────────────
  {
    id: "co-baq-puerto",
    cityId: "co-barranquilla",
    name: "Puerto · Terminal de contenedores",
    address: "Vía 40, Barranquilla",
    lat: 11.005,
    lng: -74.838,
    vertical: "Logística portuaria",
    tagline: "Trazabilidad de contenedores y vehículos en tiempo real.",
    description:
      "LPR en accesos vehiculares, OCR de contenedores, perímetro vigilado, control de zonas ROI en patios y monitoreo termal nocturno.",
    hero: F("07-lpr"),
    gallery: gallery(6, 6),
    integrations: ["lpr", "perimeter", "thermal", "intrusion", "iot", "guard"],
    stats: { cameras: 220, aiModels: 6, eventsPerDay: 16800, uptimePct: 99.87, avgResponseSec: 6, physicalGuards: 32 },
  },
  {
    id: "co-baq-malecon",
    cityId: "co-barranquilla",
    name: "Malecón Turístico",
    address: "Vía 40 con Cra 50, Barranquilla",
    lat: 10.997,
    lng: -74.797,
    vertical: "Espacios públicos",
    tagline: "Seguridad ciudadana con vigilancia distribuida.",
    description:
      "Cámaras LPR + detección de comportamiento en plazas y miradores. Coordinación directa con policía local y guardias de la zona.",
    hero: F("08-intrusion-roi"),
    gallery: gallery(2, 5),
    integrations: ["facial", "behavior", "lpr", "intrusion", "alarm", "guard"],
    stats: { cameras: 86, aiModels: 4, eventsPerDay: 4400, uptimePct: 99.86, avgResponseSec: 8, physicalGuards: 12 },
  },

  // ──────────────────────────── CARTAGENA ────────────────────────────
  {
    id: "co-ctg-hotel-resort",
    cityId: "co-cartagena",
    name: "Resort · Bocagrande",
    address: "Av. San Martín, Cartagena",
    lat: 10.395,
    lng: -75.555,
    vertical: "Hotelería",
    tagline: "Reconocimiento facial en lobby + perímetro de playa.",
    description:
      "Reconocimiento facial en lobby, LPR en parking, perímetro vigilado de playa y guardias virtuales en zonas comunes integrados al equipo físico.",
    hero: F("06-reconocimiento-facial"),
    gallery: gallery(1, 5),
    integrations: ["facial", "lpr", "perimeter", "intrusion", "guard"],
    stats: { cameras: 92, aiModels: 4, eventsPerDay: 3800, uptimePct: 99.92, avgResponseSec: 4, physicalGuards: 22 },
  },
  {
    id: "co-ctg-puerto",
    cityId: "co-cartagena",
    name: "Puerto · Sociedad Portuaria",
    address: "Manga, Cartagena",
    lat: 10.398,
    lng: -75.527,
    vertical: "Puerto · Carga",
    tagline: "Operación 24/7 con LPR + termal.",
    description:
      "LPR sobre tracto-camiones, monitoreo termal del perímetro, control de zonas críticas y soporte directo a guardias en patios.",
    hero: F("07-lpr"),
    gallery: gallery(8, 5),
    integrations: ["lpr", "thermal", "perimeter", "intrusion", "guard"],
    stats: { cameras: 140, aiModels: 5, eventsPerDay: 9100, uptimePct: 99.85, avgResponseSec: 6, physicalGuards: 26 },
  },

  // ──────────────────────────── BUCARAMANGA ────────────────────────────
  {
    id: "co-bga-zona-industrial",
    cityId: "co-bucaramanga",
    name: "Zona Industrial · Floridablanca",
    address: "Cl. 200, Bucaramanga",
    lat: 7.063,
    lng: -73.099,
    vertical: "Industrial",
    tagline: "EPP + perímetro + integración con turnos físicos.",
    description:
      "Verificación automática de EPP, control de zonas peligrosas, perímetro vigilado y soporte a guardias en cambios de turno.",
    hero: F("09-epp"),
    gallery: gallery(8, 4),
    integrations: ["epp", "intrusion", "perimeter", "behavior", "guard"],
    stats: { cameras: 78, aiModels: 4, eventsPerDay: 4100, uptimePct: 99.9, avgResponseSec: 5, physicalGuards: 14 },
  },

  // ──────────────────────────── PEREIRA ────────────────────────────
  {
    id: "co-per-centro-comercial",
    cityId: "co-pereira",
    name: "Centro Comercial Eje Cafetero",
    address: "Av. Circunvalar, Pereira",
    lat: 4.819,
    lng: -75.708,
    vertical: "Retail",
    tagline: "Conteo + LPR + integración con la operación de seguridad.",
    description:
      "Conteo por planta, LPR en parqueaderos, detección de comportamiento sospechoso e integración con vigilancia física tradicional.",
    hero: F("05-deteccion-personas"),
    gallery: gallery(3, 5),
    integrations: ["people-count", "lpr", "behavior", "facial", "guard"],
    stats: { cameras: 64, aiModels: 4, eventsPerDay: 3300, uptimePct: 99.88, avgResponseSec: 5, physicalGuards: 10 },
  },

  // ──────────────────────────── CÚCUTA ────────────────────────────
  {
    id: "co-cuc-frontera",
    cityId: "co-cucuta",
    name: "Centro Logístico de Frontera",
    address: "Vía a Venezuela, Cúcuta",
    lat: 7.872,
    lng: -72.509,
    vertical: "Frontera · Logística",
    tagline: "LPR + perímetro + apoyo a control fronterizo.",
    description:
      "LPR en flujo vehicular, monitoreo termal del perímetro, ROI en zonas restringidas y apoyo a guardias en puntos de control.",
    hero: F("07-lpr"),
    gallery: gallery(7, 5),
    integrations: ["lpr", "thermal", "perimeter", "intrusion", "guard"],
    stats: { cameras: 72, aiModels: 5, eventsPerDay: 5800, uptimePct: 99.83, avgResponseSec: 7, physicalGuards: 18 },
  },

  // ──────────────────────────── LIMA ────────────────────────────
  {
    id: "pe-lim-aeropuerto",
    cityId: "pe-lima",
    name: "Aeropuerto Internacional Jorge Chávez",
    address: "Av. Faucett, Callao",
    lat: -12.0218,
    lng: -77.1142,
    vertical: "Aeroportuario",
    tagline: "Reconocimiento facial + LPR + 26M pasajeros/año.",
    description:
      "Despliegue integral con reconocimiento facial en zonas restringidas, LPR en accesos, conteo en filas y monitoreo coordinado con la operación física del aeropuerto.",
    hero: F("06-reconocimiento-facial"),
    gallery: gallery(5, 6),
    integrations: ["facial", "lpr", "people-count", "intrusion", "guard", "access"],
    stats: { cameras: 380, aiModels: 7, eventsPerDay: 17600, uptimePct: 99.96, avgResponseSec: 4, physicalGuards: 78 },
  },
  {
    id: "pe-lim-centro-financiero",
    cityId: "pe-lima",
    name: "Distrito Financiero · San Isidro",
    address: "Av. Javier Prado, San Isidro",
    lat: -12.0931,
    lng: -77.0212,
    vertical: "Corporativo · Acceso",
    tagline: "Acceso facial coordinado entre 12 torres corporativas.",
    description:
      "Reconocimiento facial unificado entre 12 torres, LPR compartido en parqueaderos y soporte a equipos de seguridad física en cada edificio.",
    hero: F("06-reconocimiento-facial"),
    gallery: gallery(0, 5),
    integrations: ["facial", "access", "lpr", "intrusion"],
    stats: { cameras: 240, aiModels: 5, eventsPerDay: 9800, uptimePct: 99.95, avgResponseSec: 3, physicalGuards: 42 },
  },
  {
    id: "pe-lim-puerto-callao",
    cityId: "pe-lima",
    name: "Puerto del Callao · Terminal Norte",
    address: "Av. Argentina, Callao",
    lat: -12.0552,
    lng: -77.1395,
    vertical: "Puerto · Logística",
    tagline: "LPR + termal + perímetro 24/7.",
    description:
      "LPR de tracto-camiones, monitoreo termal del perímetro, ROI sobre patios de carga e integración con personal portuario.",
    hero: F("07-lpr"),
    gallery: gallery(6, 6),
    integrations: ["lpr", "thermal", "perimeter", "intrusion", "iot", "guard"],
    stats: { cameras: 198, aiModels: 6, eventsPerDay: 13400, uptimePct: 99.88, avgResponseSec: 5, physicalGuards: 30 },
  },
  {
    id: "pe-lim-centro-comercial-sur",
    cityId: "pe-lima",
    name: "Centro Comercial Surco",
    address: "Av. El Polo, Surco",
    lat: -12.1116,
    lng: -76.9826,
    vertical: "Retail",
    tagline: "Aforo + comportamiento + LPR.",
    description:
      "Conteo en tiempo real, mapas de calor por planta, LPR en parqueaderos y soporte a la operación física tradicional de seguridad.",
    hero: F("05-deteccion-personas"),
    gallery: gallery(4, 5),
    integrations: ["people-count", "lpr", "behavior", "facial", "guard"],
    stats: { cameras: 132, aiModels: 5, eventsPerDay: 6900, uptimePct: 99.91, avgResponseSec: 5, physicalGuards: 18 },
  },
];

// Convenience lookups
export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}
export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
export function projectsByCity(cityId: string): Project[] {
  return projects.filter((p) => p.cityId === cityId);
}
export function totalCamerasByCity(cityId: string): number {
  return projectsByCity(cityId).reduce((acc, p) => acc + p.stats.cameras, 0);
}

// Backwards-compat: legacy code referenced `projects` as a flat list of cities.
// The previous shape (city-only) is still produced for components that haven't
// migrated yet — same id format, so existing references keep working.
export type LegacyProjectShape = {
  id: string;
  city: string;
  region: string;
  country: Country;
  lat: number;
  lng: number;
  scale: number;
  tier: "primary" | "secondary";
  vertical: string;
};
