import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forma — Intelligente Ernährung",
  description: "Kalorientracker mit KI-Coach, proteinreiche Rezepte und personaliserter Ernährungsplan.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
