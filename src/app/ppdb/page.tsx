import type { Metadata } from "next";
import { CalendarCheck, FileText, HelpCircle } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "PPDB", description: "Informasi Penerimaan Peserta Didik Baru SMAN 1 Kraksaan." };

const timeline = [
  { label: "Pendaftaran Online Dibuka", date: "1 Juni 2026" },
  { label: "Verifikasi Berkas", date: "1–10 Juni 2026" },
  { label: "Pengumuman Hasil Seleksi", date: "20 Juni 2026" },
  { label: "Daftar Ulang", date: "21–25 Juni 2026" },
  { label: "Awal Tahun Ajaran Baru", date: "14 Juli 2026" },
];

const requirements = [
  "Fotokopi Ijazah/SKL SMP/sederajat",
  "Fotokopi Kartu Keluarga",
  "Fotokopi Akta Kelahiran",
  "Pas foto berwarna 3x4 (2 lembar)",
  "Sertifikat prestasi (jika ada)",
];

const faqs = [
  { q: "Apakah pendaftaran bisa dilakukan secara online?", a: "Ya, seluruh proses pendaftaran dilakukan melalui sistem PPDB online yang dapat diakses dari halaman ini." },
  { q: "Apakah ada jalur prestasi?", a: "Ada. Jalur prestasi tersedia bagi siswa dengan capaian akademik maupun non-akademik yang dibuktikan dengan sertifikat resmi." },
  { q: "Bagaimana jika berkas belum lengkap?", a: "Berkas dapat menyusul selama masa verifikasi berlangsung, namun disarankan untuk melengkapi sejak awal." },
];

export default function PpdbPage() {
  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 text-center md:py-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">PPDB 2026/2027</p>
          <h1 className="mx-auto max-w-2xl text-balance text-4xl font-extrabold text-ink sm:text-5xl">
            Mulai Langkah Pertamamu di SMAN 1 Kraksaan.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Pendaftaran peserta didik baru tahun ajaran 2026/2027 kini dibuka. Ikuti tahapan berikut untuk bergabung.
          </p>
          <LinkButton href="#faq" size="lg" className="mt-8">Daftar Sekarang</LinkButton>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-orange" />
          <h2 className="text-2xl font-bold text-ink">Jadwal Pendaftaran</h2>
        </div>
        <ol className="mt-8 space-y-5 border-l border-border pl-6">
          {timeline.map((t, i) => (
            <li key={t.label} className="relative">
              <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[9px] font-bold text-white">{i + 1}</span>
              <p className="text-sm font-semibold text-ink">{t.label}</p>
              <p className="text-sm text-ink-soft">{t.date}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="container-page">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue" />
            <h2 className="text-2xl font-bold text-ink">Persyaratan Berkas</h2>
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {requirements.map((r) => (
              <li key={r} className="rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink-soft">{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="container-page py-16 md:py-20">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-orange" />
          <h2 className="text-2xl font-bold text-ink">Pertanyaan Umum</h2>
        </div>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-surface p-5 open:bg-surface-alt/40">
              <summary className="cursor-pointer list-none text-sm font-semibold text-ink">{f.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-blue px-6 py-12 text-center md:py-16">
          <h3 className="text-2xl font-bold text-white">Siap Bergabung Bersama Kami?</h3>
          <LinkButton href="#" size="lg" className="mt-6 bg-orange hover:bg-orange-dark">Mulai Pendaftaran</LinkButton>
        </div>
      </section>
    </div>
  );
}
