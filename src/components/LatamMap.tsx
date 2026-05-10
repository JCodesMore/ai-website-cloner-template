"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath, type GeoProjection } from "d3-geo";
import countries110m from "world-atlas/countries-110m.json";
import { useDataStore } from "@/lib/data-store";
import type { City } from "@/data/projects";
import { colombiaDepartments, peruRegions, type Subdivision } from "@/data/subdivisions";
import { cityDetails } from "@/data/city-districts";
import colombiaDeptsGeo from "@/data/geo/colombia-departments.geo.json";
import peruDeptsGeo from "@/data/geo/peru-departments.geo.json";
import bogotaLocalidadesGeo from "@/data/geo/bogota-localidades.geo.json";
import limaDistritosGeo from "@/data/geo/lima-distritos.geo.json";

const VB_W = 720;
const VB_H = 1000;
const CITY_FOCUS_SCALE = 40;       // initial zoom when picking a city
const COUNTRY_FOCUS_SCALE = 2.6;
const DEPT_FOCUS_SCALE = 6;
const MAX_MANUAL_SCALE = 200;      // street-level free zoom

const LATAM_NAMES = new Set([
  "Argentina","Chile","Uruguay","Brazil","Bolivia","Peru","Colombia","Venezuela",
  "Guyana","Suriname","Ecuador","Paraguay","Panama","Costa Rica",
]);
const HIGHLIGHTED = new Set(["Colombia", "Peru"]);
const NAME_TO_ISO: Record<string, "CO" | "PE"> = { Colombia: "CO", Peru: "PE" };

type CountryFeature = GeoJSON.Feature<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  { name: string }
>;
type NamedFeature = GeoJSON.Feature<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  { name: string }
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = countries110m as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const allCountries = feature(topo, topo.objects.countries) as any as GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon | GeoJSON.Polygon,
  { name: string }
>;
const latamFeatures: CountryFeature[] = allCountries.features.filter(
  (f) => LATAM_NAMES.has(f.properties.name)
);
const latamFC: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: latamFeatures };

function buildProjection(): GeoProjection {
  return geoMercator().fitExtent([[40, 40], [VB_W - 40, VB_H - 40]], latamFC);
}

const baseProjection = buildProjection();
const basePath = geoPath(baseProjection);

const countryPaths = latamFeatures.map((f) => {
  const [[x0, y0], [x1, y1]] = basePath.bounds(f);
  return {
    name: f.properties.name,
    iso: NAME_TO_ISO[f.properties.name] ?? null,
    d: basePath(f) || "",
    isHi: HIGHLIGHTED.has(f.properties.name),
    cx: (x0 + x1) / 2,
    cy: (y0 + y1) / 2,
    bbox: { x0, y0, x1, y1 },
  };
});

const countryLabels = latamFeatures.map((f) => {
  const [lx, ly] = basePath.centroid(f);
  return { name: f.properties.name, x: lx, y: ly, isHi: HIGHLIGHTED.has(f.properties.name) };
});

const subdivisionMarkers = [...colombiaDepartments, ...peruRegions].map((s) => {
  const proj = baseProjection([s.lng, s.lat]);
  return { ...s, x: proj ? proj[0] : 0, y: proj ? proj[1] : 0 };
});

// Pre-compute subdivision polygon paths (real cartographic data)
type SubPath = {
  name: string;
  country: "CO" | "PE";
  d: string;
  cx: number;
  cy: number;
};

function buildSubPaths(
  fc: GeoJSON.FeatureCollection,
  country: "CO" | "PE"
): SubPath[] {
  return (fc.features as NamedFeature[])
    .map((f) => {
      const d = basePath(f) || "";
      const [[x0, y0], [x1, y1]] = basePath.bounds(f);
      return {
        name: f.properties.name,
        country,
        d,
        cx: (x0 + x1) / 2,
        cy: (y0 + y1) / 2,
      };
    })
    .filter((p) => p.d);
}

const colombiaDeptPaths = buildSubPaths(colombiaDeptsGeo as GeoJSON.FeatureCollection, "CO");
const peruDeptPaths = buildSubPaths(peruDeptsGeo as GeoJSON.FeatureCollection, "PE");
const allDeptPaths = [...colombiaDeptPaths, ...peruDeptPaths];

// Lima districts and Bogotá localidades — for city-level zoom
type CityDistrictPath = {
  name: string;
  cityIds: string[]; // which city these belong to
  d: string;
  cx: number;
  cy: number;
};

function buildCityDistrictPaths(
  fc: GeoJSON.FeatureCollection,
  cityIds: string[]
): CityDistrictPath[] {
  return (fc.features as NamedFeature[])
    .map((f) => {
      const d = basePath(f) || "";
      const [[x0, y0], [x1, y1]] = basePath.bounds(f);
      return {
        name: f.properties.name,
        cityIds,
        d,
        cx: (x0 + x1) / 2,
        cy: (y0 + y1) / 2,
      };
    })
    .filter((p) => p.d);
}

const bogotaLocPaths = buildCityDistrictPaths(
  bogotaLocalidadesGeo as GeoJSON.FeatureCollection,
  ["co-bogota"]
);
const limaDistPaths = buildCityDistrictPaths(
  limaDistritosGeo as GeoJSON.FeatureCollection,
  ["pe-lima"]
);

const countryBounds: Record<"CO" | "PE", { cx: number; cy: number }> = {
  CO: (() => {
    const co = countryPaths.find((c) => c.iso === "CO")!;
    return { cx: co.cx, cy: co.cy };
  })(),
  PE: (() => {
    const pe = countryPaths.find((c) => c.iso === "PE")!;
    return { cx: pe.cx, cy: pe.cy };
  })(),
};

function clampPan(tx: number, ty: number, scale: number, W: number, H: number) {
  if (scale <= 1) return [0, 0] as const;
  const maxTx = (W * (scale - 1)) / 2;
  const maxTy = (H * (scale - 1)) / 2;
  return [
    Math.max(-maxTx, Math.min(maxTx, tx)),
    Math.max(-maxTy, Math.min(maxTy, ty)),
  ] as const;
}

type Props = {
  focusCityId?: string | null;
  focusCountry?: "CO" | "PE" | null;
  focusDepartmentName?: string | null;
  onCitySelect?: (cityId: string | null) => void;
  onCountrySelect?: (country: "CO" | "PE" | null) => void;
  onDepartmentSelect?: (name: string | null) => void;
  onProjectSelect?: (projectId: string) => void;
};

export function LatamMap({
  focusCityId = null,
  focusCountry = null,
  focusDepartmentName = null,
  onCitySelect,
  onCountrySelect,
  onDepartmentSelect,
  onProjectSelect,
}: Props) {
  const { cities, projects, projectsByCity } = useDataStore();

  const cityMarkers = useMemo(
    () =>
      cities.map((c) => {
        const proj = baseProjection([c.lng, c.lat]);
        return { ...c, x: proj ? proj[0] : 0, y: proj ? proj[1] : 0 };
      }),
    [cities]
  );
  const projectMarkers = useMemo(
    () =>
      projects.map((p) => {
        const proj = baseProjection([p.lng, p.lat]);
        return { ...p, x: proj ? proj[0] : 0, y: proj ? proj[1] : 0 };
      }),
    [projects]
  );

  const cityDetailProjected = useMemo(
    () =>
      cityDetails
        .map((cd) => {
          const city = cities.find((c) => c.id === cd.cityId);
          if (!city) return null;
          const center = baseProjection([city.lng, city.lat]);
          if (!center) return null;
          const edge = baseProjection([city.lng + cd.metroRadiusDeg, city.lat]);
          const radiusX = edge ? Math.abs(edge[0] - center[0]) : 4;
          const edgeV = baseProjection([city.lng, city.lat - cd.metroRadiusDeg]);
          const radiusY = edgeV ? Math.abs(edgeV[1] - center[1]) : radiusX;
          const districts = cd.districts.map((d) => {
            const p = baseProjection([d.lng, d.lat]);
            return { name: d.name, x: p ? p[0] : 0, y: p ? p[1] : 0 };
          });
          return { cityId: cd.cityId, cx: center[0], cy: center[1], rx: radiusX, ry: radiusY, districts };
        })
        .filter(Boolean) as Array<{
        cityId: string;
        cx: number;
        cy: number;
        rx: number;
        ry: number;
        districts: Array<{ name: string; x: number; y: number }>;
      }>,
    [cities]
  );

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const focusedDeptPath = useMemo(() => {
    if (!focusDepartmentName) return null;
    return allDeptPaths.find((p) => p.name === focusDepartmentName) ?? null;
  }, [focusDepartmentName]);

  const focusedDeptCenter = useMemo<Subdivision | null>(() => {
    if (!focusDepartmentName) return null;
    return (
      [...colombiaDepartments, ...peruRegions].find(
        (s) => s.name === focusDepartmentName
      ) ?? null
    );
  }, [focusDepartmentName]);

  const isFocusing = !!focusCityId || !!focusCountry || !!focusDepartmentName;

  // When focus changes, sync view to the focus' computed position.
  // After that, the user can wheel-zoom + drag freely from there — the
  // focus only sets the *initial* center & scale.
  const focusKey = `${focusCityId ?? ""}|${focusCountry ?? ""}|${focusDepartmentName ?? ""}`;
  const lastFocusKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastFocusKeyRef.current === focusKey) return;
    lastFocusKeyRef.current = focusKey;

    if (focusCityId) {
      const c = cityMarkers.find((m) => m.id === focusCityId);
      if (c) {
        const S = CITY_FOCUS_SCALE;
        setView({ x: (VB_W / 2 - c.x) * S, y: (VB_H / 2 - c.y) * S, scale: S });
        return;
      }
    }
    if (focusedDeptPath) {
      const S = DEPT_FOCUS_SCALE;
      setView({
        x: (VB_W / 2 - focusedDeptPath.cx) * S,
        y: (VB_H / 2 - focusedDeptPath.cy) * S,
        scale: S,
      });
      return;
    }
    if (focusCountry) {
      const b = countryBounds[focusCountry];
      const S = COUNTRY_FOCUS_SCALE;
      setView({ x: (VB_W / 2 - b.cx) * S, y: (VB_H / 2 - b.cy) * S, scale: S });
      return;
    }
    // No focus → reset to home
    setView({ x: 0, y: 0, scale: 1 });
  }, [focusKey, focusCityId, focusCountry, focusedDeptPath, cityMarkers]);

  const effectiveView = view;

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStateRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: view.x,
      origY: view.y,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const ds = dragStateRef.current;
    if (!ds.dragging) return;
    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;
    setView((v) => {
      const [cx, cy] = clampPan(
        ds.origX + dx,
        ds.origY + dy,
        v.scale,
        containerSize.w || 1,
        containerSize.h || 1
      );
      return { ...v, x: cx, y: cy };
    });
  };
  const onPointerUp = () => {
    dragStateRef.current.dragging = false;
  };
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ox = e.clientX - rect.left - rect.width / 2;
    const oy = e.clientY - rect.top - rect.height / 2;
    setView((v) => {
      const factor = e.deltaY < 0 ? 1.18 : 0.85;
      const next = Math.min(MAX_MANUAL_SCALE, Math.max(1, v.scale * factor));
      if (next === v.scale) return v;
      const ratio = next / v.scale;
      const newX = v.x * ratio + ox * (1 - ratio);
      const newY = v.y * ratio + oy * (1 - ratio);
      const [cx, cy] = clampPan(newX, newY, next, rect.width, rect.height);
      return { x: cx, y: cy, scale: next };
    });
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (focusCityId) onCitySelect?.(null);
      else if (focusDepartmentName) onDepartmentSelect?.(null);
      else if (focusCountry) onCountrySelect?.(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusCityId, focusCountry, focusDepartmentName, onCitySelect, onCountrySelect, onDepartmentSelect]);

  const connections = useMemo(() => {
    const primary = cityMarkers.filter((m) => m.tier === "primary");
    const lines: Array<{ from: typeof primary[0]; to: typeof primary[0] }> = [];
    for (let i = 0; i < primary.length; i++) {
      for (let j = i + 1; j < primary.length; j++) {
        lines.push({ from: primary[i], to: primary[j] });
      }
    }
    return lines;
  }, [cityMarkers]);

  const focusedCity: (City & { x: number; y: number }) | undefined = focusCityId
    ? cityMarkers.find((c) => c.id === focusCityId)
    : undefined;
  const focusedProjects = focusCityId
    ? projectMarkers.filter((p) => p.cityId === focusCityId)
    : [];
  const focusedCityDetail = focusCityId
    ? cityDetailProjected.find((cd) => cd.cityId === focusCityId)
    : null;

  // City district paths to render (Bogotá or Lima)
  const cityDistrictPaths = useMemo(() => {
    if (!focusCityId) return [];
    if (focusCityId === "co-bogota") return bogotaLocPaths;
    if (focusCityId === "pe-lima") return limaDistPaths;
    return [];
  }, [focusCityId]);

  const citiesInDept = focusedDeptCenter
    ? cityMarkers.filter(
        (c) => c.country === focusedDeptCenter.country && c.region === focusedDeptCenter.name
      )
    : [];
  const citiesInDeptIds = new Set(citiesInDept.map((c) => c.id));

  const visibleScale = effectiveView.scale;

  // Department polygons fade in based on zoom or active focus
  const deptPolyOpacity = focusCityId
    ? 0
    : focusDepartmentName || focusCountry
    ? 1
    : Math.max(0, Math.min(1, (visibleScale - 1.4) / 0.6));

  const subdivisionLabelOpacity = focusCityId ? 0 : deptPolyOpacity;

  const countryLabelOpacity = focusCityId
    ? 0
    : focusDepartmentName
    ? 0.15
    : focusCountry
    ? 0.35
    : Math.max(0.15, 1 - Math.max(0, visibleScale - 1.6));

  const invScale = 1 / visibleScale;

  return (
    <div
      ref={wrapRef}
      className="relative size-full select-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        cursor: isFocusing ? "default" : dragStateRef.current.dragging ? "grabbing" : "grab",
      }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="absolute inset-0 size-full"
        style={{
          transform: `translate(${effectiveView.x}px, ${effectiveView.y}px) scale(${effectiveView.scale})`,
          transformOrigin: "center",
          transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <defs>
          <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(213,224,255,0.95)" />
            <stop offset="40%" stopColor="rgba(35,72,212,0.6)" />
            <stop offset="100%" stopColor="rgba(35,72,212,0)" />
          </radialGradient>
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(213,224,255,0.04)" strokeWidth="1" />
          </pattern>
          <filter id="countryShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#mapGrid)" />

        {/* Countries (backdrop) */}
        <g>
          {countryPaths.map((c) => {
            const isHov = hoveredCountry === c.name && c.isHi;
            const isFoc = focusCountry && c.iso === focusCountry;
            return (
              <path
                key={c.name}
                d={c.d}
                fill={
                  c.isHi
                    ? isFoc
                      ? "rgba(20, 38, 100, 0.25)"
                      : isHov
                      ? "rgba(20, 38, 100, 0.7)"
                      : "rgba(20, 38, 100, 0.55)"
                    : "rgba(213, 224, 255, 0.045)"
                }
                stroke={c.isHi ? "rgba(35, 72, 212, 0.85)" : "rgba(213, 224, 255, 0.18)"}
                strokeWidth={c.isHi ? 1.4 : 0.6}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ cursor: c.isHi ? "pointer" : "default", transition: "fill 0.2s" }}
                onMouseEnter={() => c.isHi && setHoveredCountry(c.name)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={(e) => {
                  if (!c.isHi || !c.iso) return;
                  e.stopPropagation();
                  onCountrySelect?.(focusCountry === c.iso ? null : c.iso);
                }}
              />
            );
          })}
        </g>

        {/* Department / region polygons (real cartographic data) */}
        <g style={{ opacity: deptPolyOpacity, transition: "opacity 0.5s" }}>
          {allDeptPaths.map((d, i) => {
            const isFoc = focusDepartmentName === d.name;
            const isHov = hoveredDept === d.name;
            return (
              <path
                key={`${d.country}-${d.name}-${i}`}
                d={d.d}
                fill={
                  isFoc
                    ? "rgba(35, 72, 212, 0.45)"
                    : isHov
                    ? "rgba(35, 72, 212, 0.22)"
                    : "rgba(35, 72, 212, 0.08)"
                }
                stroke={
                  isFoc
                    ? "rgba(213, 224, 255, 1)"
                    : "rgba(213, 224, 255, 0.4)"
                }
                strokeWidth={isFoc ? 1.4 : 0.5}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ cursor: "pointer", transition: "fill 0.25s, stroke 0.25s, stroke-width 0.25s" }}
                onMouseEnter={() => setHoveredDept(d.name)}
                onMouseLeave={() => setHoveredDept(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onDepartmentSelect?.(isFoc ? null : d.name);
                }}
              />
            );
          })}
        </g>

        {/* Country glow */}
        <g style={{ pointerEvents: "none" }}>
          {countryPaths
            .filter((c) => c.isHi)
            .map((c) => (
              <path
                key={c.name + "-glow"}
                d={c.d}
                fill="none"
                stroke="rgba(35, 72, 212, 0.4)"
                strokeWidth="3"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                filter="url(#countryShadow)"
              />
            ))}
        </g>

        {/* Country labels — zoom-invariant size (visual ~13/9 px) */}
        {countryLabels.map((c) => (
          <text
            key={c.name + "-label"}
            x={c.x}
            y={c.y}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={(c.isHi ? 13 : 9) * invScale}
            fontWeight={c.isHi ? 700 : 400}
            letterSpacing="0.12em"
            fill={c.isHi ? "rgba(213,224,255,0.92)" : "rgba(213,224,255,0.28)"}
            style={{
              textTransform: "uppercase",
              pointerEvents: "none",
              opacity: countryLabelOpacity,
              transition: "opacity 0.5s",
            }}
          >
            {c.name.toUpperCase()}
          </text>
        ))}

        {/* Subdivision labels (capital city names overlay) */}
        <g style={{ opacity: subdivisionLabelOpacity, transition: "opacity 0.5s", pointerEvents: "none" }}>
          {subdivisionMarkers
            .filter((s) => !focusCountry || s.country === focusCountry)
            .map((s) => {
              const isFoc = focusDepartmentName === s.name;
              return (
                <g key={`sub-${s.country}-${s.name}`}>
                  <text
                    x={s.x}
                    y={s.y}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={(isFoc ? 12 : 10) * invScale}
                    fontWeight={700}
                    letterSpacing="0.1em"
                    fill={isFoc ? "rgba(213, 224, 255, 1)" : "rgba(213, 224, 255, 0.85)"}
                    style={{ textTransform: "uppercase" }}
                  >
                    {s.name}
                  </text>
                </g>
              );
            })}
        </g>

        {/* Connection lines */}
        <g style={{ opacity: focusCityId ? 0 : focusDepartmentName ? 0.2 : focusCountry ? 0.4 : 1, transition: "opacity 0.5s" }}>
          {connections.map((line, i) => {
            const dx = line.to.x - line.from.x;
            const dy = line.to.y - line.from.y;
            const cx = (line.from.x + line.to.x) / 2 - dy * 0.12;
            const cy = (line.from.y + line.to.y) / 2 + dx * 0.12;
            return (
              <path
                key={`conn-${i}`}
                d={`M ${line.from.x} ${line.from.y} Q ${cx} ${cy} ${line.to.x} ${line.to.y}`}
                fill="none"
                stroke="rgba(35, 72, 212, 0.4)"
                strokeWidth="0.9"
                strokeDasharray="3 5"
                vectorEffect="non-scaling-stroke"
                style={{ animation: "dash-flow 4s linear infinite" }}
              />
            );
          })}
        </g>

        {/* City district polygons (Bogotá localidades / Lima distritos) */}
        {focusedCity && cityDistrictPaths.length > 0 && (
          <g>
            {cityDistrictPaths.map((d, i) => (
              <path
                key={`${d.name}-${i}`}
                d={d.d}
                fill="rgba(35, 72, 212, 0.06)"
                stroke="rgba(213, 224, 255, 0.55)"
                strokeWidth="0.4"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* District names — zoom-invariant size */}
            {cityDistrictPaths.map((d, i) => (
              <text
                key={`${d.name}-label-${i}`}
                x={d.cx}
                y={d.cy}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={11 * invScale}
                fontWeight="600"
                letterSpacing="0.15em"
                fill="rgba(213, 224, 255, 0.7)"
                stroke="rgba(2, 10, 24, 0.75)"
                strokeWidth={2 * invScale}
                paintOrder="stroke fill"
                style={{ textTransform: "uppercase", pointerEvents: "none" }}
              >
                {d.name}
              </text>
            ))}
          </g>
        )}

        {/* Metro outline + crosshair (city focus, fallback when no district paths) */}
        {focusedCityDetail && cityDistrictPaths.length === 0 && (
          <g>
            <ellipse
              cx={focusedCityDetail.cx}
              cy={focusedCityDetail.cy}
              rx={focusedCityDetail.rx}
              ry={focusedCityDetail.ry}
              fill="rgba(35, 72, 212, 0.05)"
              stroke="rgba(35, 72, 212, 0.6)"
              strokeWidth="0.4"
              strokeDasharray="0.8 0.6"
              vectorEffect="non-scaling-stroke"
              style={{ animation: "ellipse-pulse 3s ease-in-out infinite" }}
            />
            {focusedCityDetail.districts.map((d) => (
              <g key={d.name}>
                <circle cx={d.x} cy={d.y} r={3 * invScale} fill="rgba(213, 224, 255, 0.7)" />
                <text
                  x={d.x + 6 * invScale}
                  y={d.y + 2 * invScale}
                  fontFamily="var(--font-mono)"
                  fontSize={11 * invScale}
                  fontWeight={600}
                  letterSpacing="0.18em"
                  fill="rgba(213, 224, 255, 0.85)"
                  stroke="rgba(2, 10, 24, 0.75)"
                  strokeWidth={2 * invScale}
                  paintOrder="stroke fill"
                  style={{ textTransform: "uppercase", pointerEvents: "none" }}
                >
                  {d.name}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* City markers */}
        {cityMarkers.map((m) => {
          const isHover = hoveredCity === m.id;
          const isFocused = focusCityId === m.id;
          // Hide the focused city marker entirely — the camera is centered on it,
          // showing a giant pulsing ball over the localidades adds nothing.
          if (isFocused) return null;
          const isFaded = focusCityId && !isFocused;
          const isDeptHi = focusDepartmentName && citiesInDeptIds.has(m.id);
          const isDeptDim = focusDepartmentName && !isDeptHi;
          const r = m.tier === "primary" ? 5 : 3.5;
          // Marker visuals scale inversely with zoom so they stay visually
          // consistent regardless of focus level. Clamped so they're never
          // larger than their natural size.
          const visualScale = Math.min(1, invScale * 2);
          return (
            <g
              key={m.id}
              transform={`translate(${m.x},${m.y})`}
              style={{
                cursor: "pointer",
                opacity: isFaded ? 0 : isDeptDim ? 0.25 : 1,
                pointerEvents: isFaded ? "none" : "auto",
                transition: "opacity 0.4s",
              }}
              onMouseEnter={() => setHoveredCity(m.id)}
              onMouseLeave={() => setHoveredCity(null)}
              onClick={(e) => {
                e.stopPropagation();
                onCitySelect?.(isFocused ? null : m.id);
              }}
            >
              <g transform={`scale(${visualScale})`}>
                <circle
                  r={r * 5}
                  fill="url(#markerGlow)"
                  opacity={isFocused || isHover || isDeptHi ? 0.95 : 0.55}
                  style={{
                    animation: `marker-pulse ${1.6 + (Math.abs(m.x) % 7) / 10}s ease-in-out infinite`,
                  }}
                />
                <circle
                  r={r * 1.6}
                  fill="none"
                  stroke={isDeptHi ? "rgba(35,72,212,1)" : "rgba(213,224,255,0.55)"}
                  strokeWidth={isDeptHi ? 1.4 : 0.8}
                  vectorEffect="non-scaling-stroke"
                />
                <circle r={r} fill="rgba(213,224,255,0.95)" />
              </g>

              {(isHover || isFocused || isDeptHi) && !isFaded && (
                <g style={{ transform: `translate(${r * 2 + 4}px, -4px) scale(${invScale})`, transformOrigin: "0 0" }}>
                  <rect x="0" y="-12" rx="2" width={m.name.length * 7 + 22} height="20" fill="rgba(2,10,24,0.92)" stroke="rgba(35,72,212,0.6)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                  <text x="11" y="2" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700" fill="rgba(213,224,255,0.95)" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {m.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Project sub-markers */}
        {focusedCity &&
          focusedProjects.map((p) => {
            const isHover = hoveredProject === p.id;
            return (
              <g
                key={p.id}
                transform={`translate(${p.x},${p.y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredProject(p.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onProjectSelect?.(p.id);
                }}
              >
                <circle r={0.6} fill="rgba(35, 72, 212, 0.5)" style={{ animation: "marker-pulse 1.8s ease-in-out infinite" }} />
                <circle r={0.25} fill="rgba(255,255,255,0.95)" />
                <line x1={focusedCity.x - p.x} y1={focusedCity.y - p.y} x2={0} y2={0} stroke="rgba(35, 72, 212, 0.45)" strokeWidth="0.04" strokeDasharray="0.15 0.15" vectorEffect="non-scaling-stroke" />
                {isHover && (
                  <g style={{ transform: `translate(0.7px, -0.7px) scale(${invScale})`, transformOrigin: "0 0" }}>
                    <rect x="0" y="-12" rx="2" width={p.name.length * 6.5 + 20} height="20" fill="rgba(2,10,24,0.95)" stroke="rgba(35,72,212,0.7)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                    <text x="10" y="2" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill="rgba(213,224,255,0.95)" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {p.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
      </svg>

      {/* HUD */}
      {(focusedCity || focusCountry || focusDepartmentName) && (
        <div className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-3 border border-border/60 bg-background/85 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/80 backdrop-blur">
            <span className="text-accent">▣</span>
            {focusedCity ? (
              <>
                <span className="font-bold text-foreground">{focusedCity.name}</span>
                <span className="text-foreground/40">/</span>
                <span>
                  {projectsByCity(focusedCity.id).length} proyecto
                  {projectsByCity(focusedCity.id).length === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => onCitySelect?.(null)}
                  className="ml-2 border border-border/60 bg-foreground/5 px-3 py-1 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
                >
                  ESC ✕
                </button>
              </>
            ) : focusDepartmentName ? (
              <>
                <span className="font-bold text-foreground">{focusDepartmentName}</span>
                <span className="text-foreground/40">/</span>
                <span>
                  {focusedDeptCenter?.country === "CO" ? "Colombia" : "Perú"} · {citiesInDept.length} ciudad
                  {citiesInDept.length === 1 ? "" : "es"}
                </span>
              </>
            ) : focusCountry ? (
              <>
                <span className="font-bold text-foreground">
                  {focusCountry === "CO" ? "Colombia" : "Perú"}
                </span>
                <span className="text-foreground/40">/</span>
                <span>
                  {focusCountry === "CO"
                    ? `${colombiaDepartments.length} departamentos`
                    : `${peruRegions.length} regiones`}
                </span>
                <button
                  type="button"
                  onClick={() => onCountrySelect?.(null)}
                  className="ml-2 border border-border/60 bg-foreground/5 px-3 py-1 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
                >
                  ESC ✕
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Zoom controls — work in any focus mode now */}
      <div className="absolute bottom-24 right-6 z-10 hidden flex-col gap-1 md:right-10 md:flex">
        <button
          type="button"
          onClick={() => {
            setView((v) => {
              const next = Math.min(MAX_MANUAL_SCALE, v.scale * 1.3);
              const [cx, cy] = clampPan(v.x, v.y, next, containerSize.w || 1, containerSize.h || 1);
              return { x: cx, y: cy, scale: next };
            });
          }}
          aria-label="Zoom in"
          className="grid size-9 place-items-center border border-border/60 bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:bg-background/90 hover:text-foreground"
        >
          ＋
        </button>
        <button
          type="button"
          onClick={() => {
            setView((v) => {
              const next = Math.max(1, v.scale * 0.75);
              const [cx, cy] = clampPan(v.x, v.y, next, containerSize.w || 1, containerSize.h || 1);
              return { x: cx, y: cy, scale: next };
            });
          }}
          aria-label="Zoom out"
          className="grid size-9 place-items-center border border-border/60 bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:bg-background/90 hover:text-foreground"
        >
          －
        </button>
        <button
          type="button"
          onClick={() => {
            // Reset clears any focus too
            onCitySelect?.(null);
            onCountrySelect?.(null);
            onDepartmentSelect?.(null);
            setView({ x: 0, y: 0, scale: 1 });
          }}
          aria-label="Reset zoom"
          className="grid size-9 place-items-center border border-border/60 bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:bg-background/90 hover:text-foreground"
        >
          ⌖
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-24 left-6 z-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 md:block">
        ZOOM {visibleScale.toFixed(2)}×
      </div>

      <style jsx>{`
        @keyframes marker-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.4); opacity: 0.95; }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -16; }
        }
        @keyframes ellipse-pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
