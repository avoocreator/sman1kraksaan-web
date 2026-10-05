import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusChecker } from "@/components/fasilitas/status-checker";

export const metadata: Metadata = {
  title: "Cek Status Pemesanan",
  description: "Pantau status verifikasi pemesanan fasilitas SMAN 1 Kraksaan.",
};

export default function StatusFasilitasPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Pemesanan Fasilitas</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Cek Status Pemesanan</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Masukkan kode pemesanan Anda untuk melihat posisi pengajuan — mulai dari pengiriman,
          verifikasi admin, hingga keputusan persetujuan.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl border border-border bg-surface" />}>
          <StatusChecker />
        </Suspense>
      </div>
    </div>
  );
}
