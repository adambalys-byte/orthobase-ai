// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import SupportSection from "@/components/SupportSection";
import PageViewTracker from "@/components/PageViewTracker";
import "./globals.css";
import "./workshop.css";
import { Inter } from "next/font/google";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Orthobase — Dyżury i Szkoła",
  description: "Orthobase: propozycje dyżurowe, próbny grafik zespołu ortopedycznego oraz program i materiały Szkoły Kształcenia Rezydentów w Otwocku.",
  metadataBase: new URL("https://www.orthobase.pl"),
  openGraph: {
    title: "Orthobase — Dyżury i Szkoła",
    description: "Orthobase: propozycje dyżurowe, próbny grafik zespołu ortopedycznego oraz program i materiały Szkoły Kształcenia Rezydentów w Otwocku.",
    url: "https://www.orthobase.pl/",
    siteName: "Orthobase",
    locale: "pl_PL",
    images: [{ url: "/orthobase-og.png", width: 1200, height: 630, alt: "Orthobase — Dyżury i Szkoła rezydentów" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orthobase — Dyżury i Szkoła",
    description: "Orthobase: propozycje dyżurowe, próbny grafik zespołu ortopedycznego oraz program i materiały Szkoły Kształcenia Rezydentów w Otwocku.",
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
        "@id": "https://www.orthobase.pl/#organization",
        name: "Orthobase",
        url: "https://www.orthobase.pl/",
        logo: {
          "@type": "ImageObject",
          url: "https://www.orthobase.pl/orthobase-logo.png",
          width: 3172,
          height: 2395,
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
        "@id": "https://www.orthobase.pl/#website",
        url: "https://www.orthobase.pl/",
        name: "Orthobase",
        inLanguage: "pl-PL",
        publisher: { "@id": "https://www.orthobase.pl/#organization" },
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
        <PageViewTracker />
        <div className={styles.shell}>
          {children}
          <div className={styles.support}>
            <SupportSection href="https://buycoffee.to/orthobase" />
          </div>
          <footer className={styles.footer}>
            <span>© {new Date().getFullYear()} Orthobase</span>
            <nav aria-label="Kontakt i informacje" className={styles.footerLinks}>
              <a href="mailto:kontakt@orthobase.pl">kontakt@orthobase.pl</a>
              <a href="/privacy">Prywatność</a>
            </nav>
          </footer>
        </div>
        <Script id="orthobase-workshop-campaign" src="/workshop.js?v=20261008-1" strategy="afterInteractive" />
      </body>
    </html>
  );
}
