"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { SchoolEvent } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const monthShort = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"];

export function EventsPreview({ events, today }: { events: SchoolEvent[]; today: string }) {
  // Tiga agenda terdekat yang akan datang (urut dari tanggal paling dekat).
  // Agenda hari ini (mis. Hari Batik Nasional tanggal 2 Oktober) otomatis
  // tampil paling depan dengan sorotan khusus.
  const upcoming = events
    .filter((e) => e.status === "Akan Datang")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading eyebrow="Agenda" title="Kegiatan Mendatang." />
          <LinkButton href="/events" variant="outline" size="sm">
            Semua Agenda <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>

        {upcoming.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Belum ada agenda mendatang di CMS."
              description="Tambahkan entri di Strapi (Collection Types → Event) dengan title dan date."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-4 pt-1 sm:grid-cols-3">
          {upcoming.map((ev, i) => {
            const d = new Date(ev.date);
            const isToday = ev.date === today;
            return (
              <motion.a
                key={ev.slug}
                href={`/events/${ev.slug}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`group relative flex gap-4 rounded-2xl border p-4 transition-shadow ${
                  isToday
                    ? "border-blue bg-gradient-to-br from-blue-soft/90 via-surface to-surface shadow-lg shadow-blue/10 ring-1 ring-blue/30"
                    : "border-border bg-bg hover:shadow-lg hover:shadow-ink/5"
                }`}
              >
                {isToday && (
                  <span className="absolute -top-3 right-4 flex items-center gap-1.5 rounded-full bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-blue/25">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange" />
                    </span>
                    Hari ini
                  </span>
                )}
                <div
                  className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-white ${
                    isToday ? "bg-gradient-to-b from-blue-bright to-blue shadow-md shadow-blue/30" : "bg-blue"
                  }`}
                >
                  <span className="text-[10px] font-semibold tracking-wide">{monthShort[d.getMonth()]}</span>
                  <span className="text-xl font-extrabold leading-none">{d.getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">{ev.title}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-soft"><MapPin className="h-3.5 w-3.5" /> {ev.location}</p>
                  {isToday && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-blue">
                      <Sparkles className="h-3 w-3" aria-hidden /> Sedang berlangsung hari ini
                    </p>
                  )}
                </div>
              </motion.a>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}
