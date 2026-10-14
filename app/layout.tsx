import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const serif = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });

const base =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: "Denge Beslenme Atölyesi — Diyetisyen randevu sistemi demosu",
  description:
    "Kurgusal bir diyetisyen markası için hazırlanmış randevu sistemi demosu: görüşme türü, takvim, saat seçimi ve danışan/uzman panelleri. Gerçek randevu oluşturmaz.",
  openGraph: {
    title: "Denge Beslenme Atölyesi — randevu demosu",
    description: "Takvimden gün ve saat seçin, danışan ve uzman panellerini deneyin. Tamamen kurgusal demo.",
    type: "website",
    locale: "tr_TR",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#12372a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
