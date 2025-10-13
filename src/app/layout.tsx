import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "OrthoBase AI",
  description: "Inteligentny asystent ortopedii.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body
        className={`${inter.className} antialiased text-slate-100
        bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800`}
      >
        {children}
      </body>
    </html>
  );
}
