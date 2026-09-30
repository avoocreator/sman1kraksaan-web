import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

export type AlumniItem = {
  name: string;
  year: string; // tahun lulus
  university: string;
  major: string;
  path: string; // jalur masuk, misal SNBP / SNBT / Mandiri / Beasiswa
  photo?: string; // URL foto (opsional)
};

// CONTOH, dipakai kalau Strapi belum terisi. Isi data asli di Strapi.
const sample: AlumniItem[] = [
  { name: "Nama Alumni 1", year: "2025", university: "Nama Universitas", major: "Program Studi", path: "SNBP" },
  { name: "Nama Alumni 2", year: "2025", university: "Nama Universitas", major: "Program Studi", path: "SNBT" },
  { name: "Nama Alumni 3", year: "2024", university: "Nama Universitas", major: "Program Studi", path: "Beasiswa" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export function AlumniPreview({ items = sample }: { items?: AlumniItem[] }) {
  return (
    <section aria-labelledby="lulusan-beranda" className="bg-surface-alt/40 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Lulusan</p>
            <h2
              id="lulusan-beranda"
              className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              Setelah lulus, mereka ke mana
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Kampus dan jalur yang ditempuh lulusan terbaik kami.
            </p>
          </div>
          <Link
            href="/alumni"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            Lihat semua alumni <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {items.slice(0, 3).map((a) => (
            <li key={a.name} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center gap-3">
                {a.photo ? (
                  <img
                    src={a.photo}
                    alt={a.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-bold text-bg"
                  >
                    {initials(a.name)}
                  </span>
                )}
                <div>
                  <p className="font-semibold text-ink">{a.name}</p>
                  {a.year && <p className="text-sm text-muted">Lulus {a.year}</p>}
                </div>
              </div>
              <p className="mt-5 flex items-start gap-2 text-ink">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
                <span>
                  <span className="font-semibold">{a.university}</span>
                  <span className="block text-sm text-ink-soft">{a.major}</span>
                </span>
              </p>
              {a.path && (
                <p className="mt-4 inline-block rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-ink-soft">
                  Jalur {a.path}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}