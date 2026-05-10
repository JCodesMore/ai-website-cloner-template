/**
 * Admin-1 (department / region) centroids for Colombia and Peru.
 *
 * Used as labels that fade in when the map is zoomed past the country level.
 * Coordinates are approximate centroids of each subdivision in WGS84.
 *
 * Peru regions updated to use proper region centroids (not capital city
 * coords). Callao merged into Lima at this zoom level — they overlap
 * visually and are practically a single metropolitan area.
 */

export type Subdivision = {
  name: string;
  capital?: string;
  country: "CO" | "PE";
  lat: number;
  lng: number;
};

export const colombiaDepartments: Subdivision[] = [
  { country: "CO", name: "Cundinamarca",        capital: "Bogotá",        lat: 4.8,   lng: -74.1 },
  { country: "CO", name: "Antioquia",           capital: "Medellín",      lat: 6.55,  lng: -75.5 },
  { country: "CO", name: "Valle del Cauca",     capital: "Cali",          lat: 3.85,  lng: -76.5 },
  { country: "CO", name: "Atlántico",           capital: "Barranquilla",  lat: 10.65, lng: -74.95 },
  { country: "CO", name: "Bolívar",             capital: "Cartagena",     lat: 8.6,   lng: -74.5 },
  { country: "CO", name: "Santander",           capital: "Bucaramanga",   lat: 6.7,   lng: -73.05 },
  { country: "CO", name: "Norte de Santander",  capital: "Cúcuta",        lat: 8.0,   lng: -72.7 },
  { country: "CO", name: "Risaralda",           capital: "Pereira",       lat: 5.1,   lng: -76.0 },
  { country: "CO", name: "Caldas",              capital: "Manizales",     lat: 5.3,   lng: -75.4 },
  { country: "CO", name: "Quindío",             capital: "Armenia",       lat: 4.55,  lng: -75.7 },
  { country: "CO", name: "Tolima",              capital: "Ibagué",        lat: 4.0,   lng: -75.2 },
  { country: "CO", name: "Huila",               capital: "Neiva",         lat: 2.6,   lng: -75.55 },
  { country: "CO", name: "Cauca",               capital: "Popayán",       lat: 2.4,   lng: -76.6 },
  { country: "CO", name: "Nariño",              capital: "Pasto",         lat: 1.5,   lng: -77.4 },
  { country: "CO", name: "Boyacá",              capital: "Tunja",         lat: 5.55,  lng: -73.0 },
  { country: "CO", name: "Cesar",               capital: "Valledupar",    lat: 9.5,   lng: -73.6 },
  { country: "CO", name: "Magdalena",           capital: "Santa Marta",   lat: 10.4,  lng: -74.4 },
  { country: "CO", name: "La Guajira",          capital: "Riohacha",      lat: 11.55, lng: -72.0 },
  { country: "CO", name: "Sucre",               capital: "Sincelejo",     lat: 9.0,   lng: -75.0 },
  { country: "CO", name: "Córdoba",             capital: "Montería",      lat: 8.4,   lng: -75.85 },
  { country: "CO", name: "Chocó",               capital: "Quibdó",        lat: 6.0,   lng: -77.0 },
  { country: "CO", name: "Meta",                capital: "Villavicencio", lat: 3.5,   lng: -73.0 },
  { country: "CO", name: "Casanare",            capital: "Yopal",         lat: 5.5,   lng: -71.7 },
  { country: "CO", name: "Arauca",              capital: "Arauca",        lat: 6.55,  lng: -71.0 },
  { country: "CO", name: "Vichada",             capital: "Pto Carreño",   lat: 4.7,   lng: -69.5 },
  { country: "CO", name: "Caquetá",             capital: "Florencia",     lat: 1.0,   lng: -74.8 },
  { country: "CO", name: "Putumayo",            capital: "Mocoa",         lat: 0.5,   lng: -76.6 },
  { country: "CO", name: "Amazonas",            capital: "Leticia",       lat: -1.6,  lng: -70.8 },
  { country: "CO", name: "Vaupés",              capital: "Mitú",          lat: 0.85,  lng: -70.2 },
  { country: "CO", name: "Guaviare",            capital: "San José",      lat: 1.7,   lng: -72.5 },
  { country: "CO", name: "Guainía",             capital: "Inírida",       lat: 2.6,   lng: -68.5 },
];

// Peru — 24 regions + Callao Constitutional Province.
// Coordinates are region centroids (not capital cities) where they differ
// significantly. Source: approximate centroids derived from each region's
// territorial extent.
export const peruRegions: Subdivision[] = [
  { country: "PE", name: "Tumbes",        capital: "Tumbes",         lat: -3.9,   lng: -80.55 },
  { country: "PE", name: "Piura",         capital: "Piura",          lat: -5.4,   lng: -80.0  },
  { country: "PE", name: "Lambayeque",    capital: "Chiclayo",       lat: -6.5,   lng: -79.7  },
  { country: "PE", name: "La Libertad",   capital: "Trujillo",       lat: -8.0,   lng: -78.4  },
  { country: "PE", name: "Cajamarca",     capital: "Cajamarca",      lat: -6.2,   lng: -78.5  },
  { country: "PE", name: "Amazonas",      capital: "Chachapoyas",    lat: -4.3,   lng: -78.0  },
  { country: "PE", name: "San Martín",    capital: "Moyobamba",      lat: -7.2,   lng: -76.8  },
  { country: "PE", name: "Loreto",        capital: "Iquitos",        lat: -4.6,   lng: -74.5  },
  { country: "PE", name: "Áncash",        capital: "Huaraz",         lat: -9.4,   lng: -77.6  },
  { country: "PE", name: "Huánuco",       capital: "Huánuco",        lat: -9.3,   lng: -75.9  },
  { country: "PE", name: "Ucayali",       capital: "Pucallpa",       lat: -9.5,   lng: -73.5  },
  { country: "PE", name: "Pasco",         capital: "Cerro de Pasco", lat: -10.4,  lng: -75.4  },
  { country: "PE", name: "Junín",         capital: "Huancayo",       lat: -11.6,  lng: -75.0  },
  { country: "PE", name: "Lima",          capital: "Lima",           lat: -11.7,  lng: -76.7  },
  { country: "PE", name: "Huancavelica",  capital: "Huancavelica",   lat: -12.85, lng: -75.0  },
  { country: "PE", name: "Ica",           capital: "Ica",            lat: -14.3,  lng: -75.6  },
  { country: "PE", name: "Ayacucho",      capital: "Ayacucho",       lat: -13.7,  lng: -74.0  },
  { country: "PE", name: "Apurímac",      capital: "Abancay",        lat: -13.8,  lng: -73.0  },
  { country: "PE", name: "Cusco",         capital: "Cusco",          lat: -13.0,  lng: -72.0  },
  { country: "PE", name: "Madre de Dios", capital: "Pto Maldonado",  lat: -11.8,  lng: -70.8  },
  { country: "PE", name: "Puno",          capital: "Puno",           lat: -15.0,  lng: -70.2  },
  { country: "PE", name: "Arequipa",      capital: "Arequipa",       lat: -15.7,  lng: -72.5  },
  { country: "PE", name: "Moquegua",      capital: "Moquegua",       lat: -16.8,  lng: -70.9  },
  { country: "PE", name: "Tacna",         capital: "Tacna",          lat: -17.6,  lng: -70.0  },
];

export const allSubdivisions: Subdivision[] = [
  ...colombiaDepartments,
  ...peruRegions,
];
