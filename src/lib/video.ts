const CDN_BASE = process.env.NEXT_PUBLIC_VIDEO_CDN_BASE_URL?.replace(/\/$/, "");

export function videoUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return CDN_BASE ? `${CDN_BASE}${normalizedPath}` : normalizedPath;
}
