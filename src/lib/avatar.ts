// Deterministic institution avatar colors — no DB changes needed.
// Hash institution name → consistent bg/text color pair.

const PALETTE: [string, string][] = [
  ["bg-amber-100", "text-amber-700"],
  ["bg-blue-100", "text-blue-700"],
  ["bg-cyan-100", "text-cyan-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-fuchsia-100", "text-fuchsia-700"],
  ["bg-green-100", "text-green-700"],
  ["bg-indigo-100", "text-indigo-700"],
  ["bg-lime-100", "text-lime-700"],
  ["bg-orange-100", "text-orange-700"],
  ["bg-pink-100", "text-pink-700"],
  ["bg-purple-100", "text-purple-700"],
  ["bg-red-100", "text-red-700"],
  ["bg-rose-100", "text-rose-700"],
  ["bg-sky-100", "text-sky-700"],
  ["bg-teal-100", "text-teal-700"],
  ["bg-violet-100", "text-violet-700"],
  ["bg-yellow-100", "text-yellow-700"],
  ["bg-slate-200", "text-slate-700"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getAvatarColor(name: string): { bg: string; text: string } {
  const [bg, text] = PALETTE[hash(name) % PALETTE.length];
  return { bg, text };
}

export function getAvatarInitial(name: string): string {
  return (name || "?").charAt(0);
}
