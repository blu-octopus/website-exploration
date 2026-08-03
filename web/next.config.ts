import type { NextConfig } from "next";

/**
 * Static-friendly config for GitHub Pages and other free static hosts.
 *
 * NEXT_PUBLIC_BASE_PATH examples:
 * - "" (default) for Vercel / Netlify / username.github.io root
 * - "/website-exploration" for project Pages at username.github.io/website-exploration
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
