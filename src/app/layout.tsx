// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "OrthoBase AI",
  description: "Inteligentny asystent ortopedii: szybkie opisy wizyt, kody i checklisty.",
  metadataBase: new URL("https://orthobase.pl"),
  icons: {
    icon: "/favicon.ico", // jeśli masz apple-touch-icon, można dodać: apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: "OrthoBase AI",
    description: "Inteligentny asystent ortopedii: szybkie opisy wizyt, kody i checklisty.",
    url: "https://orthobase.pl",
    siteName: "OrthoBase AI",
    images: [{ url: "/orthobase-og.png", width: 1200, height: 630, alt: "OrthoBase AI" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrthoBase AI",
    description: "Inteligentny asystent ortopedii.",
    images: ["/orthobase-og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD: Organization + WebSite (z logo)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://orthobase.pl/#organization",
        "name": "OrthoBase AI",
        "url": "https://orthobase.pl",
        "logo": {
          "@type": "ImageObject",
          "url": "https://orthobase.pl/orthobase-logo.png",
          "width": 512,
          "height": 512
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "kontakt@orthobase.pl",
            "areaServed": "PL"
          }
        ],
        "sameAs": [
          // Dodasz tu w przyszłości linki do profili (LinkedIn, X, YouTube), np. "https://www.linkedin.com/company/orthobase"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://orthobase.pl/#website",
        "url": "https://orthobase.pl",
        "name": "OrthoBase AI",
        "publisher": { "@id": "https://orthobase.pl/#organization" }
      }
    ]
  };

  return (
    <html lang="pl">
      <head>
        {/* Dane strukturalne dla Google (logo + informacje o stronie/organizacji) */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* favicons/mety możesz rozszerzyć tutaj w przyszłości */}
      </head>
      <body className={`relative ${inter.className} text-slate-800`}>
        {/* stała warstwa tła – subtelny jasny gradient */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-sky-100 via-sky-50 to-white" />
        {children}
      </body>
    </html>
  );
}
