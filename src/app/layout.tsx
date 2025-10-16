// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "OrthoBase AI",
  description: "Inteligentny asystent ortopedii.",
  metadataBase: new URL("https://orthobase.pl"),
  openGraph: {
    title: "OrthoBase AI",
    description: "Inteligentny asystent ortopedii.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dane strukturalne JSON-LD dla SEO (Organization + WebSite)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://orthobase.pl/#organization",
        name: "OrthoBase AI",
        url: "https://orthobase.pl",
        logo: {
          "@type": "ImageObject",
          url: "https://orthobase.pl/orthobase-logo.png",
          width: 512,
          height: 512,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "kontakt@orthobase.pl",
            areaServed: "PL",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://orthobase.pl/#website",
        url: "https://orthobase.pl",
        name: "OrthoBase AI",
        publisher: { "@id": "https://orthobase.pl/#organization" },
      },
    ],
  };

  return (
    <html lang="pl">
      <head>
        {/* Dane strukturalne JSON-LD widoczne dla Google */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} antialiased text-slate-100
        bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800`}
      >
        {children}
      </body>
    </html>
  );
}
