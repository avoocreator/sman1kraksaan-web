import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, CalendarClock } from "lucide-react";
import { getPartner, getPartners } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const partners = await getPartners();
  return partners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartner(slug);
  if (!partner) return {};
  return { title: partner.name, description: partner.description };
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const partner = await getPartner(slug);
  if (!partner) notFound();

  return (
    <div className="container-page py-14 md:py-20">
      <Link href="/partners" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Mitra
      </Link>

      <div className="mt-8 max-w-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-base font-bold text-ink-soft">
          {partner.logo.slice(0, 2)}
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">{partner.name}</h1>
        <Badge tone="blue" className="mt-3">{partner.type}</Badge>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{partner.description}</p>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-ink-soft">
          <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4" /> Mitra sejak {partner.since}</span>
          {partner.website && (
            <a href={partner.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue hover:underline">
              <Globe className="h-4 w-4" /> Kunjungi Situs
            </a>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Program Kolaborasi</h2>
          <ul className="mt-3 space-y-2">
            {partner.programs.map((prog) => (
              <li key={prog} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink-soft">{prog}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
