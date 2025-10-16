// next.config.ts
import type { NextConfig } from "next";

const csp = [
  // domyślnie ładujemy tylko z własnej domeny
  "default-src 'self'",
  // skrypty tylko lokalne (brak zewnętrznych CDN); jeśli dodasz analytics/CDN, rozszerzymy to pole
  "script-src 'self'",
  // style lokalne; 'unsafe-inline' potrzebne m.in. dla krytycznych stylów/inline (np. font preload metadane)
  "style-src 'self' 'unsafe-inline'",
  // obrazy z własnej domeny, data: oraz https (na wypadek osadzonych grafik)
  "img-src 'self' data: https:",
  // czcionki lokalne i data:
  "font-src 'self' data:",
  // połączenia sieciowe tylko do własnej domeny (API, fetch)
  "connect-src 'self'",
  // zabrania osadzania strony w ramkach (clickjacking)
  "frame-ancestors 'none'",
  // ogranicza, skąd można brać bazowy URL dokumentu
  "base-uri 'self'",
  // wysyłanie formularzy tylko do własnej domeny
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  // Wymusza HTTPS w całej domenie + subdomenach (po wdrożeniu stabilnym) – przygotowane pod preload
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Podstawowa polityka treści – patrz wyżej
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  // Nie wysyłaj pełnego referera
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Blokuje sniffing typów MIME
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Zabezpiecza przed osadzaniem w ramkach
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Odbiera uprawnienia API przeglądarki (rozszerzymy, gdy coś będzie potrzebne)
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // wszystkie ścieżki
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // (opcjonalnie) surowszy tryb dla statycznych zasobów, jeśli kiedyś dodasz zewnętrzne CDN:
  // images: { remotePatterns: [] },
};

export default nextConfig;
