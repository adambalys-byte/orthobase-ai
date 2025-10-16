// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware dokłada HSTS (wymagane do preload) do każdej odpowiedzi
 * oraz wykonuje przekierowanie z apexu orthobase.pl -> www.orthobase.pl
 * z nagłówkiem HSTS obecnym już na odpowiedzi 308.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // Nagłówki bezpieczeństwa, które MUSZĄ być na apexie dla HSTS preload
  const security = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  };

  // 1) Redirect apex -> www z dołączonym HSTS
  if (host === "orthobase.pl") {
    url.hostname = "www.orthobase.pl";
    const res = NextResponse.redirect(url, { status: 308 });
    Object.entries(security).forEach(([k, v]) => res.headers.set(k, v));
    return res;
  }

  // 2) Dla pozostałych żądań (w tym www) dokładamy HSTS do odpowiedzi
  const res = NextResponse.next();
  Object.entries(security).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

// Middleware działa na wszystkich ścieżkach
export const config = {
  matcher: "/:path*",
};
