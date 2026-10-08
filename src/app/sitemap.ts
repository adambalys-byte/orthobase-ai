// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.orthobase.pl";

  return [
    { url: `${base}/`, lastModified: "2026-10-08" },
    { url: `${base}/privacy`, lastModified: "2026-10-08" },
  ];
}
