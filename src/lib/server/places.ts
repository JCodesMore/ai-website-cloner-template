import { tours } from "@/components/sites/showlanka/content/tours";
import { placeName } from "@/components/sites/showlanka/subpage-parts";

/** Every route stop used by the built-in tours, for the tour editor's place picker. */
export function knownPlaces() {
  const places: Record<string, [number, number]> = {};
  for (const t of tours) for (const [key, pos] of Object.entries(t.map)) places[placeName(key)] ??= pos;
  return Object.fromEntries(Object.entries(places).sort(([a], [b]) => a.localeCompare(b)));
}
