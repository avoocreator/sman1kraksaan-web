import Link from "next/link";
import { ArrowRight, BookOpen, Cpu, Languages, Leaf, Sigma } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Program = {
  title: string;
  level: string;
  desc: string;
  icon: LucideIcon;
};

// Diambil dari jadwal KBM 9 Juli 2026. Cek ke sekolah, lalu ganti dengan
// nama dan deskripsi resmi program unggulan.
const programs: Program[] = [
  {
    title: "Koding dan Kecerdasan Artifisial",
    level: "Kelas X",
    desc: "Dasar pemrograman dan AI sebagai pelajaran tetap di kelas X.",
    icon: Cpu,
  },
  {
    title: "Mata pelajaran Tingkat Lanjut",
    level: "Kelas XI dan XII",
    desc: "Matematika, Bahasa Inggris, dan Sejarah dengan materi yang lebih dalam.",
    icon: Sigma,
  },
  {
    title: "Bahasa Jepang",
    level: "Kelas XI dan XII",
    desc: "Bahasa asing pilihan untuk siswa yang ingin belajar di luar bahasa Inggris.",
    icon: Languages,
  },
  {
    title: "Tahfidz",
    level: "Kelas X A",
    desc: "Hafalan Al-Qur'an terjadwal Senin sampai Jumat, di awal hari sekolah.",
    icon: BookOpen,
  },
  {
    title: "Pembiasaan dan Adiwiyata",
    level: "Semua kelas",
    desc: "Kegiatan pembiasaan dan kepedulian lingkungan rutin setiap Jumat.",
    icon: Leaf,
  },
];

export function ProgramsPreview() {
  return (
    <section aria-labelledby="program-beranda" className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Program</p>
            <h2
              id="program-beranda"
              className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              Belajar apa saja di sini
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Selain mata pelajaran wajib, ada program yang bisa kamu ikuti sesuai tingkat kelas.
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            Lihat semua program <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map(({ title, level, desc, icon: Icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg hover:shadow-ink/5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-alt text-ink">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm font-medium text-muted">{level}</p>
              <p className="mt-3 text-ink-soft">{desc}</p>
            </li>
          ))}

          <li>
            <Link
              href="/programs"
              className="flex h-full min-h-[12rem] flex-col justify-between rounded-2xl bg-ink p-6 text-bg transition-opacity hover:opacity-90"
            >
              <span className="text-lg font-semibold">Program lengkap dan kurikulum</span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-bg/80">
                Buka halaman program <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}