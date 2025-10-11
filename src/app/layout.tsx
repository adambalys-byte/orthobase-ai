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
      <body className="text-slate-100 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
  {children}
</body>
    </html>
  );
}
