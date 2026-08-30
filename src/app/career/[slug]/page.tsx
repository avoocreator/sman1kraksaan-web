import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Building2 } from "lucide-react";
import { getCareerOpportunity, getCareerOpportunities } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const opportunities = await getCareerOpportunities();
  return opportunities.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = await getCareerOpportunity(slug);
  if (!job) return {};
  return { title: job.position, description: job.description };
}

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getCareerOpportunity(slug);
  if (!job) notFound();

  return (
    <div className="container-page py-14 md:py-20">
      <Link href="/career" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Karier
      </Link>

      <div className="mt-8 max-w-2xl">
        <Badge tone="blue">{job.type}</Badge>
        <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">{job.position}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-ink-soft">
          <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {job.company}</span>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
          <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Batas: {formatDate(job.deadline)}</span>
        </div>

        <p className="mt-6 text-base leading-relaxed text-ink-soft">{job.description}</p>

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Persyaratan</h2>
          <ul className="mt-3 space-y-2">
            {job.requirements.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" /> {r}
              </li>
            ))}
          </ul>
        </div>

        <LinkButton href="/career" size="lg" className="mt-8">Daftar Sekarang</LinkButton>
      </div>
    </div>
  );
}
