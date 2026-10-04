import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PartnerLogo } from "@/components/ui/partner-logo";

export type PartnerItem = {
  name: string;
  type: string;
  note: string;
  logo?: string;
};

export function PartnersPreview({ items = [] }: { items?: PartnerItem[] }) {
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

        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Belum ada data mitra di CMS."
              description="Tambahkan entri di Strapi (Collection Types → Partner) beserta logonya, maka kartu ini terisi otomatis."
            />
          </div>
        ) : (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.slice(0, 4).map((p) => (
              <li
                key={p.name}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5"
              >
                <div className="flex h-28 items-center justify-center border-b border-border/70 bg-white px-6">
                  <PartnerLogo name={p.name} logo={p.logo} className="h-20 w-full" />
                </div>
                <div className="p-5">
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                    {p.type}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm text-ink-soft">{p.note}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
