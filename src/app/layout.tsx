import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { InstallBanner } from "@/components/InstallBanner";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forma — Intelligente Ernährung",
  description: "Kalorientracker mit KI-Coach, proteinreiche Rezepte und personaliserter Ernährungsplan.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Forma",
    startupImage: "/icon-512.png",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <InstallBanner />
      </body>
    </html>
  );
}
