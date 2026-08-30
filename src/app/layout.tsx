import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AiFloatingButton from "@/components/ai/ai-floating-button";

// NOTE: Plus Jakarta Sans is loaded via next/font/google. This requires
// network access to fonts.googleapis.com at build time (works normally
// in any environment with internet access, e.g. Vercel or local dev).
// If your build environment has no internet access, replace this with
// next/font/local and a self-hosted font file instead.
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SMAN 1 Kraksaan — School Digital Hub",
    template: "%s | SMAN 1 Kraksaan",
  },
  description:
    "Satu sekolah, satu ekosistem digital. Jelajahi prestasi, alumni, mitra industri, dan peluang karier SMAN 1 Kraksaan.",
  openGraph: {
    title: "SMAN 1 Kraksaan — School Digital Hub",
    description:
      "Satu sekolah, satu ekosistem digital. Jelajahi prestasi, alumni, mitra industri, dan peluang karier SMAN 1 Kraksaan.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} antialiased`} suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <AiFloatingButton />
      </body>
    </html>
  );
}
