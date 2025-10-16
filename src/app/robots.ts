// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://orthobase.pl/sitemap.xml",
    host: "https://orthobase.pl",
  };
}
