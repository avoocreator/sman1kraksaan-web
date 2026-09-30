import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type PartnerItem = {
  name: string;
  type: string; // Universitas, Lembaga, Komunitas, Instansi, dst
  note: string; // bentuk kerja samanya
};

// CONTOH. Ganti dengan mitra asli sekolah, atau kirim data dari halaman
// /partners lewat prop `items`. Jangan pakai nama yang belum dikonfirmasi.
const sample: PartnerItem[] = [
  { name: "Nama Universitas", type: "Universitas", note: "Kuliah tamu dan sosialisasi jalur masuk" },
  { name: "Nama Lembaga", type: "Lembaga", note: "Pelatihan untuk siswa dan guru" },
  { name: "Nama Komunitas", type: "Komunitas", note: "Kegiatan bersama di luar kelas" },
  { name: "Nama Instansi", type: "Instansi", note: "Kunjungan dan kegiatan bersama" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export function PartnersPreview({ items = sample }: { items?: PartnerItem[] }) {
  return (
    <section aria-labelledby="mitra-beranda" className="py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Mitra</p>
            <h2
              id="mitra-beranda"
              className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              Bekerja sama dengan siapa saja
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Kampus, lembaga, dan komunitas yang ikut membuka wawasan siswa di luar kelas.
            </p>
          </div>
          <Link
            href="/partners"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            Lihat semua mitra <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.slice(0, 4).map((p) => (
            <li key={p.name} className="rounded-2xl border border-border bg-surface p-5">
              <span
                aria-hidden
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-alt text-sm font-bold text-ink"
              >
                {initials(p.name)}
              </span>
              <p className="mt-4 font-semibold text-ink">{p.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">{p.type}</p>
              <p className="mt-3 text-sm text-ink-soft">{p.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}