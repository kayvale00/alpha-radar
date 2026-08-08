import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alpha Radar — Il Radar per le tue Opportunità",
  description:
    "Piattaforma AI con skill specializzate per Creator, E-commerce, Trader, Startup e Consulenti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased cyber-grid min-h-screen">{children}</body>
    </html>
  );
}
