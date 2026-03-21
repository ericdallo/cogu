/**
 * Prepend the Astro base URL to a path.
 * Works in both dev (base="/") and production (base="/cogu").
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
