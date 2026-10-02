import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  ClipboardList,
  SearchCheck,
  Users,
  MapPin,
  Megaphone,
  ImageOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ScheduleProvider } from "@/components/schedule/context";
import ScheduleWidget from "@/components/home/ScheduleWidget";
import { getScheduleRaw } from "@/lib/api";
import { getFacilities } from "@/lib/api/fasilitas";
import { todayJakarta } from "@/lib/utils";
import { announcements, dateParts, formatTanggal } from "@/data/announcements";

export const revalidate = 60; // segarkan data Strapi dengan pola halaman lain

export const metadata: Metadata = {
  title: "Portal Siswa — SMAN 1 Kraksaan",
  description:
    "Ruang harian siswa SMAN 1 Kraksaan: pengumuman terbaru, jadwal pelajaran hari ini, dan pemesanan fasilitas sekolah.",
};

// Alur pemesanan fasilitas — ringkasan dari halaman /fasilitas.
const langkah = [
  {
    icon: CalendarPlus,
    title: "Pilih fasilitas",
    desc: "Telusuri katalog, cek kapasitas dan lokasinya.",
  },
  {
    icon: ClipboardList,
    title: "Atur tanggal & jam",
    desc: "Isi data pemesan, lalu pilih jam mulai–selesai yang bebas.",
  },
  {
    icon: SearchCheck,
    title: "Tunggu verifikasi",
    desc: "Admin sarpras yang acc; pantau lewat cek status.",
  },
];

export default async function SiswaPortalPage() {
  const [schedule, facilities] = await Promise.all([getScheduleRaw(), getFacilities()]);

  // Terbaru dulu; pengumuman penting naik ke paling atas.
  const sorted = [...announcements].sort((a, b) => {
    if (Boolean(a.important) !== Boolean(b.important))
      return Number(Boolean(b.important)) - Number(Boolean(a.important));
    return b.date.localeCompare(a.date);
  });

  return (
    <>
      {/* Kepala portal — identitas "mode siswa" yang jelas beda dari beranda umum */}
      <section className="border-b border-border bg-surface-alt/40">
        <div className="container-page py-12 md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <Megaphone className="h-3.5 w-3.5" aria-hidden />
            Portal Siswa
          </span>
          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Urusan harianmu, satu halaman.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Cek pengumuman terbaru, lihat pelajaran hari ini sesuai kelas, lalu pesan
            fasilitas kalau ada kegiatan. Halaman ini khusus untuk siswa — beranda
            umum tetap ada untuk pengunjung lain.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Kembali ke beranda umum
            </Link>
            <span className="text-muted">Hari ini: {formatTanggal(todayJakarta())}</span>
          </div>
        </div>
      </section>

      {/* 1 — Pengumuman */}
      <section aria-labelledby="pengumuman-siswa" className="py-14 sm:py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">Pengumuman</p>
              <h2
                id="pengumuman-siswa"
                className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
              >
                Yang perlu kamu tahu
              </h2>
              <p className="mt-3 max-w-xl text-ink-soft">
                Diurut dari yang paling penting dan terbaru. Yang bertanda{" "}
                <span className="font-semibold text-orange">Penting</span> biasanya
                ada tenggat waktunya.
              </p>
            </div>
          </div>

          <ul className="mt-10 grid gap-4 lg:grid-cols-2">
            {sorted.map((a) => {
              const { day, month } = dateParts(a.date);
              return (
                <li key={a.id}>
                  <article
                    className={`flex h-full gap-4 rounded-3xl border bg-surface p-5 sm:gap-5 sm:p-6 ${
                      a.important ? "border-orange/40 shadow-sm shadow-orange/5" : "border-border"
                    }`}
                  >
                    {/* Blok tanggal */}
                    <div
                      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border ${
                        a.important ? "border-orange/40 bg-orange/10" : "border-border bg-surface-alt"
                      }`}
                      aria-hidden
                    >
                      <span className="text-xl font-extrabold leading-none text-ink">{day}</span>
                      <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {month}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="neutral">{a.category}</Badge>
                        {a.important && <Badge tone="orange">Penting</Badge>}
                        <span className="text-xs text-muted">{formatTanggal(a.date)}</span>
                      </div>
                      <h3 className="mt-2.5 text-base font-bold leading-snug tracking-tight text-ink sm:text-lg">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.body}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 2 — Jadwal pelajaran (widget yang sama seperti sebelumnya di beranda) */}
      <ScheduleProvider raw={schedule}>
        <ScheduleWidget />
      </ScheduleProvider>

      {/* 3 — Pesan fasilitas */}
      <section aria-labelledby="fasilitas-siswa" className="bg-surface-alt/40 py-14 sm:py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">Pesan Fasilitas</p>
              <h2
                id="fasilitas-siswa"
                className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
              >
                Butuh aula, lab, atau lapangan?
              </h2>
              <p className="mt-3 max-w-xl text-ink-soft">
                Untuk kegiatan kelas, ekskul, atau organisasi — ajukan pemesanan
                online, nanti admin sarana prasarana yang menyetujui.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <LinkButton href="/fasilitas/pesan" size="md">
                Ajukan Pemesanan <ArrowRight className="h-4 w-4" aria-hidden />
              </LinkButton>
              <LinkButton href="/fasilitas/status" size="md" variant="outline">
                Cek Status
              </LinkButton>
            </div>
          </div>

          {/* Contoh fasilitas yang paling sering dipakai siswa */}
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.slice(0, 3).map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/fasilitas/${f.slug}`}
                  className="group block h-full overflow-hidden rounded-3xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-surface-alt">
                    {f.image ? (
                      <img
                        src={f.image}
                        alt={f.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted" aria-hidden>
                        <ImageOff className="h-8 w-8" />
                      </span>
                    )}
                    <span className="absolute left-3 top-3">
                      <Badge tone="blue">{f.category}</Badge>
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold tracking-tight text-ink group-hover:text-orange-dark">
                      {f.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">
                      {f.shortDescription || f.description}
                    </p>
                    <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" aria-hidden /> {f.location}
                      </span>
                      {f.capacity > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" aria-hidden /> {f.capacity} orang
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Alur singkat biar siswa tahu apa yang terjadi setelah mengajukan */}
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {langkah.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-alt text-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-bold tabular-nums text-muted">Langkah {i + 1}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
