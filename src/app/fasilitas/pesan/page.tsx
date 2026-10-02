import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/fasilitas/booking-form";

export const metadata: Metadata = {
  title: "Ajukan Pemesanan Fasilitas",
  description: "Formulir pengajuan pemesanan fasilitas SMAN 1 Kraksaan.",
};

export default function PesanFasilitasPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Pemesanan Fasilitas</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Ajukan Pemesanan</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Lengkapi formulir di bawah. Setelah pengajuan terkirim, Anda akan menerima kode pemesanan
          yang dapat digunakan untuk memantau status verifikasi oleh admin sarana prasarana.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl border border-border bg-surface" />}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
