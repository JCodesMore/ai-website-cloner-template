/**
 * Catálogo de municipios oficiales de Colombia y Perú con sus coordenadas
 * aproximadas. Es una lista curada (~80 municipios principales por país)
 * organizada por departamento / región.
 *
 * Las coordenadas (lat/lng en WGS84) son datos geográficos factuales —
 * pueden ajustarse en el editor admin después de añadir la ciudad.
 *
 * Para añadir más municipios, agregá entradas al array correspondiente.
 */

import type { Country } from "./projects";

export type Municipality = {
  name: string;
  dept: string;
  country: Country;
  lat: number;
  lng: number;
  tier: "primary" | "secondary";
};

export const colombianMunicipalities: Municipality[] = [
  // Cundinamarca
  { name: "Bogotá D.C.",   dept: "Cundinamarca", country: "CO", lat: 4.711,  lng: -74.072, tier: "primary"   },
  { name: "Soacha",        dept: "Cundinamarca", country: "CO", lat: 4.579,  lng: -74.219, tier: "secondary" },
  { name: "Facatativá",    dept: "Cundinamarca", country: "CO", lat: 4.811,  lng: -74.353, tier: "secondary" },
  { name: "Zipaquirá",     dept: "Cundinamarca", country: "CO", lat: 5.022,  lng: -73.991, tier: "secondary" },
  { name: "Chía",          dept: "Cundinamarca", country: "CO", lat: 4.860,  lng: -74.060, tier: "secondary" },
  { name: "Mosquera",      dept: "Cundinamarca", country: "CO", lat: 4.706,  lng: -74.226, tier: "secondary" },
  { name: "Madrid",        dept: "Cundinamarca", country: "CO", lat: 4.733,  lng: -74.265, tier: "secondary" },
  { name: "Funza",         dept: "Cundinamarca", country: "CO", lat: 4.717,  lng: -74.211, tier: "secondary" },
  { name: "Cajicá",        dept: "Cundinamarca", country: "CO", lat: 4.918,  lng: -74.027, tier: "secondary" },
  { name: "Fusagasugá",    dept: "Cundinamarca", country: "CO", lat: 4.345,  lng: -74.366, tier: "secondary" },
  { name: "Girardot",      dept: "Cundinamarca", country: "CO", lat: 4.301,  lng: -74.806, tier: "secondary" },

  // Antioquia
  { name: "Medellín",      dept: "Antioquia", country: "CO", lat: 6.244,  lng: -75.582, tier: "primary"   },
  { name: "Bello",         dept: "Antioquia", country: "CO", lat: 6.337,  lng: -75.555, tier: "secondary" },
  { name: "Itagüí",        dept: "Antioquia", country: "CO", lat: 6.184,  lng: -75.611, tier: "secondary" },
  { name: "Envigado",      dept: "Antioquia", country: "CO", lat: 6.171,  lng: -75.585, tier: "secondary" },
  { name: "Apartadó",      dept: "Antioquia", country: "CO", lat: 7.883,  lng: -76.629, tier: "secondary" },
  { name: "Turbo",         dept: "Antioquia", country: "CO", lat: 8.094,  lng: -76.728, tier: "secondary" },
  { name: "Rionegro",      dept: "Antioquia", country: "CO", lat: 6.155,  lng: -75.374, tier: "secondary" },
  { name: "Sabaneta",      dept: "Antioquia", country: "CO", lat: 6.151,  lng: -75.616, tier: "secondary" },
  { name: "Caldas",        dept: "Antioquia", country: "CO", lat: 6.092,  lng: -75.635, tier: "secondary" },
  { name: "Copacabana",    dept: "Antioquia", country: "CO", lat: 6.348,  lng: -75.508, tier: "secondary" },

  // Valle del Cauca
  { name: "Cali",          dept: "Valle del Cauca", country: "CO", lat: 3.452,  lng: -76.532, tier: "primary"   },
  { name: "Buenaventura",  dept: "Valle del Cauca", country: "CO", lat: 3.881,  lng: -77.031, tier: "secondary" },
  { name: "Palmira",       dept: "Valle del Cauca", country: "CO", lat: 3.539,  lng: -76.299, tier: "secondary" },
  { name: "Tuluá",         dept: "Valle del Cauca", country: "CO", lat: 4.087,  lng: -76.197, tier: "secondary" },
  { name: "Cartago",       dept: "Valle del Cauca", country: "CO", lat: 4.747,  lng: -75.911, tier: "secondary" },
  { name: "Yumbo",         dept: "Valle del Cauca", country: "CO", lat: 3.583,  lng: -76.495, tier: "secondary" },
  { name: "Buga",          dept: "Valle del Cauca", country: "CO", lat: 3.901,  lng: -76.302, tier: "secondary" },
  { name: "Jamundí",       dept: "Valle del Cauca", country: "CO", lat: 3.260,  lng: -76.541, tier: "secondary" },

  // Atlántico
  { name: "Barranquilla",  dept: "Atlántico", country: "CO", lat: 10.963, lng: -74.796, tier: "primary"   },
  { name: "Soledad",       dept: "Atlántico", country: "CO", lat: 10.917, lng: -74.766, tier: "secondary" },
  { name: "Malambo",       dept: "Atlántico", country: "CO", lat: 10.860, lng: -74.776, tier: "secondary" },
  { name: "Sabanalarga",   dept: "Atlántico", country: "CO", lat: 10.629, lng: -74.921, tier: "secondary" },
  { name: "Puerto Colombia", dept: "Atlántico", country: "CO", lat: 10.987, lng: -74.954, tier: "secondary" },

  // Bolívar
  { name: "Cartagena",     dept: "Bolívar", country: "CO", lat: 10.391, lng: -75.514, tier: "primary"   },
  { name: "Magangué",      dept: "Bolívar", country: "CO", lat: 9.241,  lng: -74.751, tier: "secondary" },
  { name: "Turbaco",       dept: "Bolívar", country: "CO", lat: 10.331, lng: -75.413, tier: "secondary" },
  { name: "Arjona",        dept: "Bolívar", country: "CO", lat: 10.255, lng: -75.345, tier: "secondary" },

  // Santander
  { name: "Bucaramanga",   dept: "Santander", country: "CO", lat: 7.119,  lng: -73.123, tier: "primary"   },
  { name: "Floridablanca", dept: "Santander", country: "CO", lat: 7.063,  lng: -73.099, tier: "secondary" },
  { name: "Girón",         dept: "Santander", country: "CO", lat: 7.073,  lng: -73.173, tier: "secondary" },
  { name: "Piedecuesta",   dept: "Santander", country: "CO", lat: 6.998,  lng: -73.052, tier: "secondary" },
  { name: "Barrancabermeja",dept: "Santander", country: "CO", lat: 7.063, lng: -73.852, tier: "secondary" },
  { name: "San Gil",       dept: "Santander", country: "CO", lat: 6.555,  lng: -73.135, tier: "secondary" },

  // Norte de Santander
  { name: "Cúcuta",        dept: "Norte de Santander", country: "CO", lat: 7.893,  lng: -72.507, tier: "primary"   },
  { name: "Ocaña",         dept: "Norte de Santander", country: "CO", lat: 8.247,  lng: -73.357, tier: "secondary" },
  { name: "Pamplona",      dept: "Norte de Santander", country: "CO", lat: 7.378,  lng: -72.652, tier: "secondary" },
  { name: "Villa del Rosario", dept: "Norte de Santander", country: "CO", lat: 7.831, lng: -72.474, tier: "secondary" },
  { name: "Los Patios",    dept: "Norte de Santander", country: "CO", lat: 7.835,  lng: -72.508, tier: "secondary" },

  // Risaralda
  { name: "Pereira",       dept: "Risaralda", country: "CO", lat: 4.812,  lng: -75.694, tier: "primary"   },
  { name: "Dosquebradas",  dept: "Risaralda", country: "CO", lat: 4.832,  lng: -75.668, tier: "secondary" },
  { name: "Santa Rosa de Cabal", dept: "Risaralda", country: "CO", lat: 4.871, lng: -75.620, tier: "secondary" },
  { name: "La Virginia",   dept: "Risaralda", country: "CO", lat: 4.898,  lng: -75.886, tier: "secondary" },

  // Caldas
  { name: "Manizales",     dept: "Caldas", country: "CO", lat: 5.069,  lng: -75.521, tier: "primary"   },
  { name: "La Dorada",     dept: "Caldas", country: "CO", lat: 5.451,  lng: -74.672, tier: "secondary" },
  { name: "Villamaría",    dept: "Caldas", country: "CO", lat: 5.044,  lng: -75.515, tier: "secondary" },
  { name: "Chinchiná",     dept: "Caldas", country: "CO", lat: 4.984,  lng: -75.604, tier: "secondary" },

  // Quindío
  { name: "Armenia",       dept: "Quindío", country: "CO", lat: 4.535,  lng: -75.681, tier: "primary"   },
  { name: "Calarcá",       dept: "Quindío", country: "CO", lat: 4.525,  lng: -75.644, tier: "secondary" },
  { name: "La Tebaida",    dept: "Quindío", country: "CO", lat: 4.452,  lng: -75.788, tier: "secondary" },

  // Tolima
  { name: "Ibagué",        dept: "Tolima", country: "CO", lat: 4.439,  lng: -75.232, tier: "primary"   },
  { name: "Espinal",       dept: "Tolima", country: "CO", lat: 4.149,  lng: -74.884, tier: "secondary" },
  { name: "Honda",         dept: "Tolima", country: "CO", lat: 5.207,  lng: -74.738, tier: "secondary" },
  { name: "Melgar",        dept: "Tolima", country: "CO", lat: 4.205,  lng: -74.640, tier: "secondary" },

  // Huila
  { name: "Neiva",         dept: "Huila", country: "CO", lat: 2.937,  lng: -75.289, tier: "primary"   },
  { name: "Pitalito",      dept: "Huila", country: "CO", lat: 1.857,  lng: -76.046, tier: "secondary" },
  { name: "Garzón",        dept: "Huila", country: "CO", lat: 2.196,  lng: -75.628, tier: "secondary" },

  // Cauca
  { name: "Popayán",       dept: "Cauca", country: "CO", lat: 2.444,  lng: -76.616, tier: "primary"   },
  { name: "Santander de Quilichao", dept: "Cauca", country: "CO", lat: 3.011, lng: -76.486, tier: "secondary" },

  // Nariño
  { name: "Pasto",         dept: "Nariño", country: "CO", lat: 1.214,  lng: -77.281, tier: "primary"   },
  { name: "Tumaco",        dept: "Nariño", country: "CO", lat: 1.797,  lng: -78.793, tier: "secondary" },
  { name: "Ipiales",       dept: "Nariño", country: "CO", lat: 0.829,  lng: -77.643, tier: "secondary" },

  // Boyacá
  { name: "Tunja",         dept: "Boyacá", country: "CO", lat: 5.539,  lng: -73.367, tier: "primary"   },
  { name: "Sogamoso",      dept: "Boyacá", country: "CO", lat: 5.715,  lng: -72.929, tier: "secondary" },
  { name: "Duitama",       dept: "Boyacá", country: "CO", lat: 5.825,  lng: -73.034, tier: "secondary" },
  { name: "Chiquinquirá",  dept: "Boyacá", country: "CO", lat: 5.617,  lng: -73.823, tier: "secondary" },

  // Cesar
  { name: "Valledupar",    dept: "Cesar", country: "CO", lat: 10.464, lng: -73.253, tier: "primary"   },
  { name: "Aguachica",     dept: "Cesar", country: "CO", lat: 8.310,  lng: -73.617, tier: "secondary" },

  // Magdalena
  { name: "Santa Marta",   dept: "Magdalena", country: "CO", lat: 11.241, lng: -74.199, tier: "primary"   },
  { name: "Ciénaga",       dept: "Magdalena", country: "CO", lat: 11.005, lng: -74.247, tier: "secondary" },
  { name: "Fundación",     dept: "Magdalena", country: "CO", lat: 10.521, lng: -74.181, tier: "secondary" },

  // La Guajira
  { name: "Riohacha",      dept: "La Guajira", country: "CO", lat: 11.544, lng: -72.907, tier: "primary"   },
  { name: "Maicao",        dept: "La Guajira", country: "CO", lat: 11.379, lng: -72.244, tier: "secondary" },
  { name: "Uribia",        dept: "La Guajira", country: "CO", lat: 11.714, lng: -72.265, tier: "secondary" },
  { name: "Manaure",       dept: "La Guajira", country: "CO", lat: 11.781, lng: -72.443, tier: "secondary" },

  // Sucre
  { name: "Sincelejo",     dept: "Sucre", country: "CO", lat: 9.305,  lng: -75.395, tier: "primary"   },
  { name: "Corozal",       dept: "Sucre", country: "CO", lat: 9.318,  lng: -75.295, tier: "secondary" },

  // Córdoba
  { name: "Montería",      dept: "Córdoba", country: "CO", lat: 8.751,  lng: -75.882, tier: "primary"   },
  { name: "Lorica",        dept: "Córdoba", country: "CO", lat: 9.241,  lng: -75.815, tier: "secondary" },
  { name: "Cereté",        dept: "Córdoba", country: "CO", lat: 8.886,  lng: -75.792, tier: "secondary" },

  // Chocó
  { name: "Quibdó",        dept: "Chocó", country: "CO", lat: 5.692,  lng: -76.658, tier: "primary"   },

  // Meta
  { name: "Villavicencio", dept: "Meta", country: "CO", lat: 4.142,  lng: -73.626, tier: "primary"   },
  { name: "Acacías",       dept: "Meta", country: "CO", lat: 3.991,  lng: -73.758, tier: "secondary" },
  { name: "Granada",       dept: "Meta", country: "CO", lat: 3.547,  lng: -73.706, tier: "secondary" },

  // Casanare
  { name: "Yopal",         dept: "Casanare", country: "CO", lat: 5.339,  lng: -72.394, tier: "primary"   },
  { name: "Aguazul",       dept: "Casanare", country: "CO", lat: 5.173,  lng: -72.547, tier: "secondary" },

  // Arauca
  { name: "Arauca",        dept: "Arauca", country: "CO", lat: 7.084,  lng: -70.759, tier: "primary"   },
  { name: "Saravena",      dept: "Arauca", country: "CO", lat: 6.951,  lng: -71.876, tier: "secondary" },
  { name: "Tame",          dept: "Arauca", country: "CO", lat: 6.460,  lng: -71.737, tier: "secondary" },

  // Putumayo
  { name: "Mocoa",         dept: "Putumayo", country: "CO", lat: 1.144,  lng: -76.647, tier: "primary"   },
  { name: "Puerto Asís",   dept: "Putumayo", country: "CO", lat: 0.500,  lng: -76.495, tier: "secondary" },

  // Amazonas
  { name: "Leticia",       dept: "Amazonas", country: "CO", lat: -4.215, lng: -69.940, tier: "primary"   },

  // Caquetá
  { name: "Florencia",     dept: "Caquetá", country: "CO", lat: 1.614,  lng: -75.604, tier: "primary"   },

  // Vichada
  { name: "Puerto Carreño", dept: "Vichada", country: "CO", lat: 6.189, lng: -67.486, tier: "primary" },

  // Vaupés
  { name: "Mitú",          dept: "Vaupés", country: "CO", lat: 1.253,  lng: -70.234, tier: "primary"   },

  // Guainía
  { name: "Inírida",       dept: "Guainía", country: "CO", lat: 3.871,  lng: -67.926, tier: "primary"   },

  // Guaviare
  { name: "San José del Guaviare", dept: "Guaviare", country: "CO", lat: 2.572, lng: -72.642, tier: "primary" },
];

export const peruvianMunicipalities: Municipality[] = [
  // Lima
  { name: "Lima",          dept: "Lima", country: "PE", lat: -12.046, lng: -77.043, tier: "primary"   },
  { name: "Callao",        dept: "Lima", country: "PE", lat: -12.058, lng: -77.118, tier: "secondary" },
  { name: "Chosica",       dept: "Lima", country: "PE", lat: -11.929, lng: -76.700, tier: "secondary" },
  { name: "Cieneguilla",   dept: "Lima", country: "PE", lat: -12.119, lng: -76.825, tier: "secondary" },
  { name: "Huacho",        dept: "Lima", country: "PE", lat: -11.107, lng: -77.609, tier: "secondary" },

  // Arequipa
  { name: "Arequipa",      dept: "Arequipa", country: "PE", lat: -16.409, lng: -71.537, tier: "primary"   },
  { name: "Mollendo",      dept: "Arequipa", country: "PE", lat: -17.025, lng: -72.013, tier: "secondary" },
  { name: "Camaná",        dept: "Arequipa", country: "PE", lat: -16.624, lng: -72.711, tier: "secondary" },

  // La Libertad
  { name: "Trujillo",      dept: "La Libertad", country: "PE", lat: -8.112,  lng: -79.029, tier: "primary"   },
  { name: "Chepén",        dept: "La Libertad", country: "PE", lat: -7.224,  lng: -79.428, tier: "secondary" },
  { name: "Pacasmayo",     dept: "La Libertad", country: "PE", lat: -7.404,  lng: -79.570, tier: "secondary" },

  // Cusco
  { name: "Cusco",         dept: "Cusco", country: "PE", lat: -13.532, lng: -71.967, tier: "primary"   },
  { name: "Quillabamba",   dept: "Cusco", country: "PE", lat: -12.860, lng: -72.690, tier: "secondary" },
  { name: "Sicuani",       dept: "Cusco", country: "PE", lat: -14.272, lng: -71.226, tier: "secondary" },

  // Piura
  { name: "Piura",         dept: "Piura", country: "PE", lat: -5.195,  lng: -80.633, tier: "primary"   },
  { name: "Sullana",       dept: "Piura", country: "PE", lat: -4.901,  lng: -80.685, tier: "secondary" },
  { name: "Talara",        dept: "Piura", country: "PE", lat: -4.582,  lng: -81.272, tier: "secondary" },
  { name: "Paita",         dept: "Piura", country: "PE", lat: -5.085,  lng: -81.114, tier: "secondary" },

  // Lambayeque
  { name: "Chiclayo",      dept: "Lambayeque", country: "PE", lat: -6.771,  lng: -79.844, tier: "primary"   },
  { name: "Lambayeque",    dept: "Lambayeque", country: "PE", lat: -6.703,  lng: -79.906, tier: "secondary" },
  { name: "Ferreñafe",     dept: "Lambayeque", country: "PE", lat: -6.640,  lng: -79.788, tier: "secondary" },

  // Junín
  { name: "Huancayo",      dept: "Junín", country: "PE", lat: -12.066, lng: -75.205, tier: "primary"   },
  { name: "Tarma",         dept: "Junín", country: "PE", lat: -11.418, lng: -75.692, tier: "secondary" },
  { name: "Jauja",         dept: "Junín", country: "PE", lat: -11.776, lng: -75.500, tier: "secondary" },
  { name: "La Oroya",      dept: "Junín", country: "PE", lat: -11.521, lng: -75.901, tier: "secondary" },

  // Áncash
  { name: "Huaraz",        dept: "Áncash", country: "PE", lat: -9.527,  lng: -77.528, tier: "primary"   },
  { name: "Chimbote",      dept: "Áncash", country: "PE", lat: -9.075,  lng: -78.594, tier: "secondary" },
  { name: "Caraz",         dept: "Áncash", country: "PE", lat: -9.046,  lng: -77.811, tier: "secondary" },

  // Loreto
  { name: "Iquitos",       dept: "Loreto", country: "PE", lat: -3.749,  lng: -73.255, tier: "primary"   },
  { name: "Yurimaguas",    dept: "Loreto", country: "PE", lat: -5.901,  lng: -76.114, tier: "secondary" },

  // Puno
  { name: "Puno",          dept: "Puno", country: "PE", lat: -15.840, lng: -70.022, tier: "primary"   },
  { name: "Juliaca",       dept: "Puno", country: "PE", lat: -15.499, lng: -70.133, tier: "secondary" },

  // Tacna
  { name: "Tacna",         dept: "Tacna", country: "PE", lat: -18.013, lng: -70.252, tier: "primary"   },

  // Ica
  { name: "Ica",           dept: "Ica", country: "PE", lat: -14.067, lng: -75.728, tier: "primary"   },
  { name: "Chincha Alta",  dept: "Ica", country: "PE", lat: -13.418, lng: -76.131, tier: "secondary" },
  { name: "Pisco",         dept: "Ica", country: "PE", lat: -13.713, lng: -76.204, tier: "secondary" },
  { name: "Nazca",         dept: "Ica", country: "PE", lat: -14.829, lng: -74.937, tier: "secondary" },

  // Ucayali
  { name: "Pucallpa",      dept: "Ucayali", country: "PE", lat: -8.379,  lng: -74.553, tier: "primary"   },

  // Cajamarca
  { name: "Cajamarca",     dept: "Cajamarca", country: "PE", lat: -7.164,  lng: -78.512, tier: "primary"   },
  { name: "Jaén",          dept: "Cajamarca", country: "PE", lat: -5.708,  lng: -78.808, tier: "secondary" },
  { name: "Chota",         dept: "Cajamarca", country: "PE", lat: -6.555,  lng: -78.647, tier: "secondary" },

  // Apurímac
  { name: "Abancay",       dept: "Apurímac", country: "PE", lat: -13.636, lng: -72.881, tier: "primary"   },
  { name: "Andahuaylas",   dept: "Apurímac", country: "PE", lat: -13.658, lng: -73.392, tier: "secondary" },

  // Huánuco
  { name: "Huánuco",       dept: "Huánuco", country: "PE", lat: -9.930,  lng: -76.244, tier: "primary"   },
  { name: "Tingo María",   dept: "Huánuco", country: "PE", lat: -9.299,  lng: -75.997, tier: "secondary" },

  // Ayacucho
  { name: "Ayacucho",      dept: "Ayacucho", country: "PE", lat: -13.159, lng: -74.224, tier: "primary"   },
  { name: "Huanta",        dept: "Ayacucho", country: "PE", lat: -12.937, lng: -74.246, tier: "secondary" },

  // Madre de Dios
  { name: "Puerto Maldonado", dept: "Madre de Dios", country: "PE", lat: -12.595, lng: -69.181, tier: "primary" },

  // Pasco
  { name: "Cerro de Pasco", dept: "Pasco", country: "PE", lat: -10.687, lng: -76.255, tier: "primary"   },

  // Amazonas
  { name: "Chachapoyas",   dept: "Amazonas", country: "PE", lat: -6.232,  lng: -77.871, tier: "primary"   },
  { name: "Bagua",         dept: "Amazonas", country: "PE", lat: -5.640,  lng: -78.532, tier: "secondary" },

  // San Martín
  { name: "Tarapoto",      dept: "San Martín", country: "PE", lat: -6.483,  lng: -76.357, tier: "primary"   },
  { name: "Moyobamba",     dept: "San Martín", country: "PE", lat: -6.033,  lng: -76.973, tier: "secondary" },
  { name: "Juanjuí",       dept: "San Martín", country: "PE", lat: -7.181,  lng: -76.738, tier: "secondary" },

  // Tumbes
  { name: "Tumbes",        dept: "Tumbes", country: "PE", lat: -3.566,  lng: -80.451, tier: "primary"   },

  // Moquegua
  { name: "Moquegua",      dept: "Moquegua", country: "PE", lat: -17.194, lng: -70.935, tier: "primary"   },
  { name: "Ilo",           dept: "Moquegua", country: "PE", lat: -17.642, lng: -71.339, tier: "secondary" },

  // Huancavelica
  { name: "Huancavelica",  dept: "Huancavelica", country: "PE", lat: -12.787, lng: -74.972, tier: "primary"   },
];

export const allMunicipalities: Municipality[] = [
  ...colombianMunicipalities,
  ...peruvianMunicipalities,
];

export function municipalitiesByDept(country: Country, dept: string): Municipality[] {
  return allMunicipalities.filter((m) => m.country === country && m.dept === dept);
}
