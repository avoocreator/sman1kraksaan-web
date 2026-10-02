import type { Metadata } from "next";
import { Suspense } from "react";
import { ScheduleExplorer } from "@/components/fasilitas/schedule-explorer";

export const metadata: Metadata = {
  title: "Jadwal Pemesanan Fasilitas",
  description:
    "Lihat fasilitas SMAN 1 Kraksaan yang sudah dibooking — siapa pemesannya, kapan, dan untuk keperluan apa.",
};

export default function JadwalFasilitasPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">
          Pemesanan Fasilitas
        </p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Jadwal Pemesanan</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Pantau fasilitas apa saja yang sudah dibooking — siapa pemesannya, kapan tanggal dan
          jam pemakaiannya, serta untuk keperluan apa. Pilih tanggal pada kalender untuk melihat
          daftar fasilitas yang terbooking beserta detail pemesanannya.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl border border-border bg-surface" />}>
          <ScheduleExplorer />
        </Suspense>
      </div>
    </div>
  );
}
