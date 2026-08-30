import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, GraduationCap } from "lucide-react";
import { getAlumnus, getAlumni } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const alumni = await getAlumni();
  return alumni.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const alumnus = await getAlumnus(slug);
  if (!alumnus) return {};
  return { title: alumnus.name, description: alumnus.bio };
}

export default async function AlumniDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const alumnus = await getAlumnus(slug);
  if (!alumnus) notFound();

  return (
    <div className="container-page py-14 md:py-20">
      <Link href="/alumni" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Alumni
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="aspect-[3/4] max-w-sm overflow-hidden rounded-3xl border border-border">
            <img src={alumnus.photo} alt={alumnus.name} className="h-full w-full object-cover" />
          </div>
        </div>

        <div>
          <Badge tone="orange">{alumnus.category}</Badge>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{alumnus.name}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{alumnus.bio}</p>

          <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-surface p-5 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-3"><GraduationCap className="h-4 w-4 text-muted" /> Angkatan {alumnus.graduationYear}</div>
            <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-muted" /> {alumnus.role}</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted" /> {alumnus.location}</div>
            <div className="flex items-center gap-3 text-ink-soft">{alumnus.destination}</div>
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Perjalanan Karier</h2>
            <ol className="mt-4 space-y-4 border-l border-border pl-5">
              {alumnus.timeline.map((t) => (
                <li key={t.label} className="relative">
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-orange" />
                  <p className="text-sm font-semibold text-ink">{t.year}</p>
                  <p className="text-sm text-ink-soft">{t.label}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
