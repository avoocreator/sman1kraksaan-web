import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, ClipboardList, SearchCheck, ArrowRight, CalendarDays } from "lucide-react";
import { getFacilities } from "@/lib/api/fasilitas";
import { LinkButton } from "@/components/ui/button";
import { FacilityExplorer } from "@/components/fasilitas/facility-explorer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pesan Fasilitas",
  description: "Pesan fasilitas sekolah SMAN 1 Kraksaan — aula, laboratorium, lapangan, dan ruang pertemuan.",
};

const steps = [
  {
    icon: CalendarPlus,
    title: "1. Pilih Fasilitas",
    description: "Telusuri katalog fasilitas, cek kapasitas, lokasi, dan jadwal yang sudah terbooking.",
  },
  {
    icon: ClipboardList,
    title: "2. Atur Tanggal & Jam Bebas",
    description: "Isi data pemesan lalu atur tanggal, jam mulai, dan jam selesai sesuai kebutuhan kegiatan Anda.",
  },
  {
    icon: SearchCheck,
    title: "3. Tunggu Verifikasi",
    description: "Admin sarana prasarana memverifikasi pengajuan. Pantau lewat halaman cek status.",
  },
];

export default async function FasilitasPage() {
  const facilities = await getFacilities();

  return (
    <div className="container-page py-14 md:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Fasilitas Sekolah</p>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Pemesanan Fasilitas</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Aula, laboratorium, lapangan, hingga ruang pertemuan kini bisa dipesan secara online.
            Atur tanggal dan jam mulai–selesai secara bebas sesuai kebutuhan, lalu pantau jadwal
            terisinya secara transparan — semuanya dalam satu alur.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <LinkButton href="/fasilitas/pesan">
            Ajukan Pemesanan <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/fasilitas/jadwal" variant="outline">
            <CalendarDays className="h-4 w-4 text-orange" /> Lihat Jadwal
          </LinkButton>
          <LinkButton href="/fasilitas/status" variant="outline">
            Cek Status
          </LinkButton>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="flex gap-3.5 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-xs text-ink-soft">
        Butuh bantuan? Hubungi Tata Usaha jam kerja sekolah atau lihat{" "}
        <Link href="/about" className="font-medium text-orange hover:underline">
          halaman kontak sekolah
        </Link>
        .
      </p>

      <div className="mt-6">
        <FacilityExplorer facilities={facilities} />
      </div>
    </div>
  );
}
