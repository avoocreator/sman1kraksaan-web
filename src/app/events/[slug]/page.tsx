import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { getEvent, getEvents } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  return (
    <div className="container-page py-14 md:py-20">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Agenda
      </Link>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-border">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        </div>
        <Badge tone={event.status === "Akan Datang" ? "orange" : "neutral"} className="mt-6">{event.status}</Badge>
        <h1 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">{event.title}</h1>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-ink-soft">
          <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatDate(event.date)}</span>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</span>
        </div>
        <p className="mt-6 text-base leading-relaxed text-ink-soft">{event.description}</p>
      </div>
    </div>
  );
}
