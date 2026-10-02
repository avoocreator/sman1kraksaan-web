import type { Metadata } from "next";
import Link from "next/link";
import { getPartners } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { PartnerLogo } from "@/components/ui/partner-logo";
import { EmptyState } from "@/components/ui/empty-state";

export const revalidate = 60; // refresh data Strapi

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
          {partners.length > 0
            ? `${partners.length} mitra dari berbagai sektor mendukung pembelajaran, pengembangan akademik, kunjungan edukatif, beasiswa, dan kolaborasi.`
            : "Daftar mitra sekolah — dikelola langsung lewat CMS Strapi."}
        </p>
      </div>

      {types.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {types.map((t) => (
            <Badge tone="blue" key={t}>{t}</Badge>
          ))}
        </div>
      )}

      {partners.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Belum ada mitra di CMS."
            description="Tambahkan entri di Strapi (Collection Types → Partner): isi title, decption, dan unggah logo di field media — halaman ini terisi otomatis."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <Link
              key={p.slug}
              href={`/partners/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5"
            >
              {/* Logo tampil besar di panggung putih — dikenali tanpa baca teks */}
              <div className="flex h-32 items-center justify-center border-b border-border/70 bg-white px-8">
                <PartnerLogo name={p.name} logo={p.logoImage} className="h-24 w-full" />
              </div>
              <div className="p-6">
                <p className="text-base font-semibold text-ink group-hover:text-orange-dark">{p.name}</p>
                <Badge tone="blue" className="mt-2">{p.type}</Badge>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                <p className="mt-3 text-xs text-muted">Mitra sejak {p.since}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
