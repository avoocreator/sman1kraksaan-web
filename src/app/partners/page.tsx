import type { Metadata } from "next";
import Link from "next/link";
import { getPartners } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Mitra Industri", description: "Kolaborasi SMAN 1 Kraksaan dengan dunia industri dan perguruan tinggi." };

export default async function PartnersPage() {
  const partners = await getPartners();
  const types = Array.from(new Set(partners.map((p) => p.type)));

  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Kolaborasi</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">School × Industry</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          {partners.length}+ mitra dari berbagai sektor mendukung pembelajaran dan pengembangan karier siswa.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {types.map((t) => (
          <Badge tone="blue" key={t}>{t}</Badge>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <Link
            key={p.slug}
            href={`/partners/${p.slug}`}
            className="group rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg hover:shadow-ink/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-alt text-sm font-bold text-ink-soft">
              {p.logo.slice(0, 2)}
            </div>
            <p className="mt-4 text-sm font-semibold text-ink group-hover:text-orange-dark">{p.name}</p>
            <Badge tone="blue" className="mt-2">{p.type}</Badge>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.description}</p>
            <p className="mt-3 text-xs text-muted">Mitra sejak {p.since}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
