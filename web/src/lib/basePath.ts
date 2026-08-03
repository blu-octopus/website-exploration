/**
 * Prefix a root-relative path with the deploy base path.
 * Set NEXT_PUBLIC_BASE_PATH=/repo-name for GitHub project Pages.
 * Leave empty for user.github.io, Vercel, Netlify custom domains, etc.
 */
export function withBasePath(path: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  if (!path.startsWith("/")) return path;
  if (!base) return path;
  return `${base}${path}`;
}
