import type { Metadata } from "next";
import { ScheduleExplorer } from "@/components/fasilitas/schedule-explorer";
import { getBookings, toPublicBooking } from "@/lib/api/fasilitas";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Jadwal Pemesanan Fasilitas",
  description:
    "Lihat fasilitas SMAN 1 Kraksaan yang sudah dibooking — siapa pemesannya, kapan, dan untuk keperluan apa.",
};

export default async function JadwalFasilitasPage() {
  const bookings = (await getBookings()).map(toPublicBooking);

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
        <ScheduleExplorer bookings={bookings} />
      </div>
    </div>
  );
}
