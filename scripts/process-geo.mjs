#!/usr/bin/env node
/**
 * Process raw GeoJSON / TopoJSON downloads into clean, simplified files
 * bundled with the app.
 *
 *  - Round coordinates to N decimals (default 4 ≈ 11m precision)
 *  - Drop strictly-duplicate consecutive coords (after rounding)
 *  - Filter Peru distritos to just Lima + Callao
 *  - Convert Bogota localidades TopoJSON → GeoJSON
 *  - Strip every property except `name` (we add it normalized)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feature as topoFeature } from "topojson-client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GEO_DIR = path.join(__dirname, "..", "src", "data", "geo");

const PRECISION = 4;
const ROUND = (n) => Math.round(n * 10 ** PRECISION) / 10 ** PRECISION;

function processCoords(coords) {
  if (!Array.isArray(coords)) return coords;
  if (typeof coords[0] === "number") {
    // single point [x, y, ...]
    return [ROUND(coords[0]), ROUND(coords[1])];
  }
  // dedupe consecutive identical points after rounding
  const out = [];
  for (const c of coords) {
    const next = processCoords(c);
    if (
      out.length > 0 &&
      typeof next[0] === "number" &&
      typeof out[out.length - 1][0] === "number" &&
      next[0] === out[out.length - 1][0] &&
      next[1] === out[out.length - 1][1]
    ) {
      continue;
    }
    out.push(next);
  }
  return out;
}

function simplifyFeature(f, nameKey, normalize = (s) => s) {
  if (!f.geometry || !f.geometry.coordinates) return null;
  return {
    type: "Feature",
    properties: { name: normalize(f.properties[nameKey] ?? "") },
    geometry: {
      type: f.geometry.type,
      coordinates: processCoords(f.geometry.coordinates),
    },
  };
}

function size(buf) {
  return (buf.length / 1024).toFixed(1) + " KB";
}

// Title-case helper for ALL-CAPS names
function titleCase(s) {
  return s
    .toLowerCase()
    .replace(/(^|\s)([a-záéíóúñ])/g, (_, b, c) => b + c.toUpperCase());
}

// ─────────────────────────── Colombia departments ───────────────────────────
{
  const raw = JSON.parse(
    fs.readFileSync(path.join(GEO_DIR, "colombia-deps-raw.json"), "utf8")
  );
  // Normalize department names — accents + title case + a few spec fixes
  const NORMALIZE_CO = {
    "ANTIOQUIA": "Antioquia",
    "ATLANTICO": "Atlántico",
    "SANTAFE DE BOGOTA D.C": "Cundinamarca", // Bogotá D.C. lives inside Cundinamarca for our hierarchy
    "BOLIVAR": "Bolívar",
    "BOYACA": "Boyacá",
    "CALDAS": "Caldas",
    "CAQUETA": "Caquetá",
    "CAUCA": "Cauca",
    "CESAR": "Cesar",
    "CORDOBA": "Córdoba",
    "CUNDINAMARCA": "Cundinamarca",
    "CHOCO": "Chocó",
    "HUILA": "Huila",
    "LA GUAJIRA": "La Guajira",
    "MAGDALENA": "Magdalena",
    "META": "Meta",
    "NARIÑO": "Nariño",
    "NORTE DE SANTANDER": "Norte de Santander",
    "QUINDIO": "Quindío",
    "RISARALDA": "Risaralda",
    "SANTANDER": "Santander",
    "SUCRE": "Sucre",
    "TOLIMA": "Tolima",
    "VALLE DEL CAUCA": "Valle del Cauca",
    "ARAUCA": "Arauca",
    "CASANARE": "Casanare",
    "PUTUMAYO": "Putumayo",
    "SAN ANDRES Y PROVIDENCIA": "San Andrés y Providencia",
    "AMAZONAS": "Amazonas",
    "GUAINIA": "Guainía",
    "GUAVIARE": "Guaviare",
    "VAUPES": "Vaupés",
    "VICHADA": "Vichada",
  };

  // Merge Bogotá D.C. into Cundinamarca (geometric union via separate features
  // is fine — we just label them all "Cundinamarca")
  const features = raw.features
    .map((f) => simplifyFeature(f, "NOMBRE_DPT", (n) => NORMALIZE_CO[n.trim()] ?? titleCase(n.trim())))
    .filter(Boolean);

  const out = JSON.stringify({ type: "FeatureCollection", features });
  fs.writeFileSync(path.join(GEO_DIR, "colombia-departments.geo.json"), out);
  console.log("Colombia departments:", features.length, "features ·", size(Buffer.from(out)));
}

// ─────────────────────────── Peru regions ───────────────────────────
{
  const raw = JSON.parse(
    fs.readFileSync(path.join(GEO_DIR, "peru-deps-raw.json"), "utf8")
  );
  const NORMALIZE_PE = {
    "AMAZONAS": "Amazonas",
    "ANCASH": "Áncash",
    "APURIMAC": "Apurímac",
    "AREQUIPA": "Arequipa",
    "AYACUCHO": "Ayacucho",
    "CAJAMARCA": "Cajamarca",
    "CALLAO": "Lima", // merge Callao into Lima at the country level
    "CUSCO": "Cusco",
    "HUANCAVELICA": "Huancavelica",
    "HUANUCO": "Huánuco",
    "ICA": "Ica",
    "JUNIN": "Junín",
    "LA LIBERTAD": "La Libertad",
    "LAMBAYEQUE": "Lambayeque",
    "LIMA": "Lima",
    "LORETO": "Loreto",
    "MADRE DE DIOS": "Madre de Dios",
    "MOQUEGUA": "Moquegua",
    "PASCO": "Pasco",
    "PIURA": "Piura",
    "PUNO": "Puno",
    "SAN MARTIN": "San Martín",
    "TACNA": "Tacna",
    "TUMBES": "Tumbes",
    "UCAYALI": "Ucayali",
  };
  const features = raw.features
    .map((f) => simplifyFeature(f, "NOMBDEP", (n) => NORMALIZE_PE[n.trim()] ?? titleCase(n.trim())))
    .filter(Boolean);
  const out = JSON.stringify({ type: "FeatureCollection", features });
  fs.writeFileSync(path.join(GEO_DIR, "peru-departments.geo.json"), out);
  console.log("Peru departments:", features.length, "features ·", size(Buffer.from(out)));
}

// ─────────────────────────── Lima Metropolitana + Callao distritos ───────────────────────────
// Filter to just Lima province (Lima Metropolitana) + Callao Constitutional
// Province. Excludes rural districts of Lima Region (Yauyos, Cañete,
// Huarochirí, Canta, Cajatambo, Oyón, Barranca, Huaral, Huaura).
{
  const rawFile = fs.existsSync(path.join(GEO_DIR, "lima-distritos-raw.json"))
    ? "lima-distritos-raw.json"
    : "lima-distritos-try.json";
  const raw = JSON.parse(fs.readFileSync(path.join(GEO_DIR, rawFile), "utf8"));
  const limaCallao = raw.features.filter(
    (f) =>
      f.properties.NOMBPROV === "LIMA" ||
      f.properties.NOMBDEP === "CALLAO"
  );
  const features = limaCallao
    .map((f) => simplifyFeature(f, "NOMBDIST", (n) => titleCase(n.trim())))
    .filter(Boolean);
  const out = JSON.stringify({ type: "FeatureCollection", features });
  fs.writeFileSync(path.join(GEO_DIR, "lima-distritos.geo.json"), out);
  console.log("Lima Metropolitana + Callao:", features.length, "features ·", size(Buffer.from(out)));
}

// ─────────────────────────── Bogota localidades ───────────────────────────
{
  const topo = JSON.parse(
    fs.readFileSync(path.join(GEO_DIR, "bogota-loc-raw.json"), "utf8")
  );
  const objKey = Object.keys(topo.objects)[0];
  const fc = topoFeature(topo, topo.objects[objKey]);
  // fc is GeoJSON FeatureCollection
  const features = fc.features
    .map((f) => simplifyFeature(f, "NOMBRE", (n) => titleCase(n.trim())))
    .filter(Boolean);
  const out = JSON.stringify({ type: "FeatureCollection", features });
  fs.writeFileSync(path.join(GEO_DIR, "bogota-localidades.geo.json"), out);
  console.log("Bogotá localidades:", features.length, "features ·", size(Buffer.from(out)));
}

console.log("\nDone. Outputs in", GEO_DIR);
