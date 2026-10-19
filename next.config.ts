// next.config.ts
import type { NextConfig } from "next";

/**
 * CSP dostosowane do Next.js (App Router) i hostingu Vercel:
 * - zachowuje dotychczasową politykę egzekwowaną podczas obserwacji ostrzejszej wersji
 * - inline pozostaje potrzebne dla statycznej inicjalizacji Next.js; eval nie jest
 *   wymagane przez domyślny produkcyjny runtime i jest kandydatem do usunięcia
 * - obrazy i fonty z self + data: (+ https: dla obrazów zewnętrznych, jeśli kiedyś dodasz)
 * - connect-src self + status konta Orthobase + vercel-insights (jeśli kiedyś włączysz Analytics Vercela)
 * Uwaga: jeśli dodasz zewnętrzne skrypty/CDN (np. analytics), rozszerzymy odpowiednie dyrektywy.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // Dotychczasowa polityka; usunięcie eval/blob najpierw obserwujemy poniżej.
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

// Etap obserwacji: ta polityka zgłasza naruszenia, ale ich NIE blokuje.
// Zachowujemy statyczny rendering i wymagane przez Next.js skrypty inline.
// Nie dodajemy report-uri/report-to: obserwacja odbywa się w przeglądarce
// i w teście lokalnym, bez wysyłania adresów stron lub próbek kodu użytkowników.
// Po sprawdzeniu rzeczywistych przebiegów można osobno zatwierdzić egzekwowanie.
const scriptObservationPolicy = [
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy-Report-Only", value: scriptObservationPolicy }]
    : []),
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
