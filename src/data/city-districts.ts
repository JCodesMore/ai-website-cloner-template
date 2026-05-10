/**
 * Approximate metropolitan area + neighborhoods (zonas / distritos) for the
 * cities where ARS operates. Used to render city-level detail when the user
 * zooms onto a city.
 *
 * `metroRadiusDeg` is the approximate radius of the urban area in degrees of
 * longitude — converted to SVG units via the same Mercator projection used
 * by the map. The shape is rendered as a soft elliptical outline.
 *
 * Districts are major neighborhoods / zones used for orientation labels.
 */

export type District = {
  name: string;
  lat: number;
  lng: number;
};

export type CityDetail = {
  cityId: string;
  metroRadiusDeg: number; // approx. half-width of urban area
  districts: District[];
};

export const cityDetails: CityDetail[] = [
  {
    cityId: "co-bogota",
    metroRadiusDeg: 0.18,
    districts: [
      { name: "Usaquén",  lat: 4.706, lng: -74.030 },
      { name: "Chapinero",lat: 4.652, lng: -74.062 },
      { name: "Centro",   lat: 4.598, lng: -74.076 },
      { name: "Suba",     lat: 4.745, lng: -74.083 },
      { name: "Engativá", lat: 4.708, lng: -74.117 },
      { name: "Kennedy",  lat: 4.628, lng: -74.140 },
      { name: "Fontibón", lat: 4.673, lng: -74.143 },
      { name: "Teusaquillo",lat: 4.638, lng: -74.094 },
    ],
  },
  {
    cityId: "co-medellin",
    metroRadiusDeg: 0.10,
    districts: [
      { name: "El Poblado",  lat: 6.207, lng: -75.567 },
      { name: "Laureles",    lat: 6.244, lng: -75.594 },
      { name: "Centro",      lat: 6.247, lng: -75.575 },
      { name: "Belén",       lat: 6.226, lng: -75.605 },
      { name: "Itagüí",      lat: 6.184, lng: -75.611 },
      { name: "Envigado",    lat: 6.171, lng: -75.585 },
      { name: "Bello",       lat: 6.337, lng: -75.555 },
    ],
  },
  {
    cityId: "co-cali",
    metroRadiusDeg: 0.10,
    districts: [
      { name: "San Antonio", lat: 3.450, lng: -76.541 },
      { name: "Ciudad Jardín",lat: 3.391, lng: -76.530 },
      { name: "Granada",     lat: 3.466, lng: -76.534 },
      { name: "Aguablanca",  lat: 3.421, lng: -76.479 },
      { name: "Yumbo",       lat: 3.583, lng: -76.495 },
      { name: "Pance",       lat: 3.336, lng: -76.547 },
    ],
  },
  {
    cityId: "co-barranquilla",
    metroRadiusDeg: 0.10,
    districts: [
      { name: "El Prado",    lat: 11.005, lng: -74.808 },
      { name: "Norte",       lat: 11.017, lng: -74.822 },
      { name: "Centro",      lat: 10.971, lng: -74.787 },
      { name: "Soledad",     lat: 10.918, lng: -74.766 },
      { name: "Puerto",      lat: 11.003, lng: -74.846 },
    ],
  },
  {
    cityId: "co-cartagena",
    metroRadiusDeg: 0.08,
    districts: [
      { name: "Centro Histórico",lat: 10.423, lng: -75.549 },
      { name: "Bocagrande",  lat: 10.397, lng: -75.553 },
      { name: "Manga",       lat: 10.398, lng: -75.527 },
      { name: "Getsemaní",   lat: 10.421, lng: -75.541 },
      { name: "La Boquilla", lat: 10.469, lng: -75.512 },
    ],
  },
  {
    cityId: "co-bucaramanga",
    metroRadiusDeg: 0.07,
    districts: [
      { name: "Cabecera",    lat: 7.108, lng: -73.108 },
      { name: "Centro",      lat: 7.119, lng: -73.123 },
      { name: "Floridablanca",lat: 7.063, lng: -73.099 },
      { name: "Girón",       lat: 7.073, lng: -73.173 },
      { name: "Piedecuesta", lat: 6.998, lng: -73.052 },
    ],
  },
  {
    cityId: "co-pereira",
    metroRadiusDeg: 0.06,
    districts: [
      { name: "Centro",      lat: 4.812, lng: -75.694 },
      { name: "Pinares",     lat: 4.809, lng: -75.706 },
      { name: "Cuba",        lat: 4.795, lng: -75.717 },
      { name: "Dosquebradas",lat: 4.831, lng: -75.677 },
    ],
  },
  {
    cityId: "co-cucuta",
    metroRadiusDeg: 0.05,
    districts: [
      { name: "Centro",      lat: 7.893, lng: -72.507 },
      { name: "Atalaya",     lat: 7.870, lng: -72.524 },
      { name: "Caobos",      lat: 7.901, lng: -72.500 },
      { name: "Quinta Vélez",lat: 7.899, lng: -72.515 },
    ],
  },
  {
    cityId: "pe-lima",
    metroRadiusDeg: 0.18,
    districts: [
      { name: "Miraflores",  lat: -12.121, lng: -77.030 },
      { name: "San Isidro",  lat: -12.097, lng: -77.036 },
      { name: "Surco",       lat: -12.150, lng: -76.998 },
      { name: "La Molina",   lat: -12.087, lng: -76.946 },
      { name: "Barranco",    lat: -12.144, lng: -77.022 },
      { name: "San Borja",   lat: -12.105, lng: -77.000 },
      { name: "Centro Lima", lat: -12.046, lng: -77.043 },
      { name: "Callao",      lat: -12.058, lng: -77.118 },
      { name: "San Miguel",  lat: -12.077, lng: -77.083 },
      { name: "Chorrillos",  lat: -12.171, lng: -77.018 },
    ],
  },
];

export function getCityDetail(cityId: string): CityDetail | undefined {
  return cityDetails.find((c) => c.cityId === cityId);
}
