// next.config.ts
import type { NextConfig } from "next";

/**
 * CSP dostosowane do Next.js (App Router) i hostingu Vercel:
 * - pozwala na inicjalizację/rehydratację skryptów (inline/eval wymagane przez część runtime'u)
 * - obrazy i fonty z self + data: (+ https: dla obrazów zewnętrznych, jeśli kiedyś dodasz)
 * - connect-src self + status konta Orthobase + vercel-insights (jeśli kiedyś włączysz Analytics Vercela)
 * Uwaga: jeśli dodasz zewnętrzne skrypty/CDN (np. analytics), rozszerzymy odpowiednie dyrektywy.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // Skrypty: zezwól na inline/eval + blob dla runtime Next.js
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  // Style: lokalne + inline (Tailwind/inline krytyczne)
  "style-src 'self' 'unsafe-inline'",
  // Obrazy: lokalne, data: i https:
  "img-src 'self' data: https:",
  // Czcionki: lokalne + data:
  "font-src 'self' data:",
  // Połączenia: status wspólnego konta oraz istniejący zakres Vercel Insights.
  "connect-src 'self' https://dyzury.orthobase.pl https://vitals.vercel-insights.com",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=()" },
];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
