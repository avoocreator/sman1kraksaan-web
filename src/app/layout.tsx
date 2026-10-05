import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AiFloatingButton from "@/components/ai/ai-floating-button";
import { VisitTracker } from "@/components/visit-tracker";
import { getTotalVisits } from "@/lib/visits";

import localFont from "next/font/local";

const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable-latin.woff2",
  variable: "--font-plus-jakarta",
  weight: "200 800",
  display: "swap",
});

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-Variable-latin.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SMAN 1 Kraksaan — School Digital Hub",
    template: "%s | SMAN 1 Kraksaan",
  },
  description:
    "Satu sekolah, satu ekosistem digital. Jelajahi prestasi, dan alumni, SMAN 1 Kraksaan.",
  openGraph: {
    title: "SMAN 1 Kraksaan — School Digital Hub",
    description:
      "Satu sekolah, satu ekosistem digital. Jelajahi prestasi, dan alumni, SMAN 1 Kraksaan.",
    type: "website",
    locale: "id_ID",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const totalVisits = await getTotalVisits();

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${bricolage.variable} antialiased`} suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer totalVisits={totalVisits} />
        <VisitTracker />
        <AiFloatingButton />
      </body>
    </html>
  );
}
