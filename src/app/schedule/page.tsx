import type { Metadata } from "next";
import ScheduleExplorer from "@/components/schedule/ScheduleExplorer";

export const metadata: Metadata = {
  title: "Jadwal Pelajaran | SMAN 1 Kraksaan",
  description: "Jadwal pelajaran semua kelas SMAN 1 Kraksaan, lengkap dengan jam dan guru pengajar.",
};

export default function SchedulePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Jadwal pelajaran</h1>
      <p className="mt-2 max-w-prose text-slate-600">
        Pilih kelasmu untuk lihat pelajaran, jam, dan gurunya. Guru bisa cek jadwal mengajarnya lewat Per guru.
      </p>
      <div className="mt-8">
        <ScheduleExplorer />
      </div>
    </main>
  );
}