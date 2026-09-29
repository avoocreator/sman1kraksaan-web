import type { Metadata } from "next";
import ScheduleExplorer from "@/components/schedule/ScheduleExplorer";

export const metadata: Metadata = {
  title: "Jadwal Pelajaran | SMAN 1 Kraksaan",
  description: "Jadwal pelajaran semua kelas SMAN 1 Kraksaan, lengkap dengan jam dan guru pengajar.",
};

export default function SchedulePage() {
  return (
    <main className="container-page py-10 sm:py-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">Jadwal pelajaran</h1>
        <p className="mt-3 text-lg text-ink-soft">
          Cari jadwal kelasmu, atau cek guru mana yang sedang mengajar di kelas mana.
        </p>
      </header>
      <ScheduleExplorer />
    </main>
  );
}