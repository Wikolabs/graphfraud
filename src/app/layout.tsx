import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "GraphFraud — Détectez les réseaux frauduleux invisibles",
  description: "Analyse de graphes transactionnels GNN — détection de communautés frauduleuses et d'anneaux de fraude organisée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-body)", background: "#fff1f2" }}>{children}</body>
    </html>
  );
}
