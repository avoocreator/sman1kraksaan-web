import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AiFloatingButton from "@/components/ai/ai-floating-button";
import { VisitTracker } from "@/components/visit-tracker";
import { getTotalVisits } from "@/lib/visits";

// Font di-host sendiri (src/app/fonts) lewat next/font/local — TIDAK lagi
// mengunduh dari fonts.googleapis.com saat build/dev. Dulu pakai next/font/google
// dan bikin build gagal di jaringan yang tidak bisa menjangkau Google
// ("Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'").
// File .woff2 variabel (satu file untuk semua ketebalan) subset latin.
import localFont from "next/font/local";

const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable-latin.woff2",
  variable: "--font-plus-jakarta",
  weight: "200 800",
  display: "swap",
});

// Font display untuk judul (h1-h6) — karakternya lebih berkarakter daripada
// font body, dipakai lewat utilitas `font-display` di Tailwind.
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
  // Total kunjungan untuk footer (cache 5 menit; null = CT/token belum siap → widget tampil 0).
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
