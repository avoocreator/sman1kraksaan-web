"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { SchoolEvent } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

const monthShort = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"];

export function EventsPreview({ events }: { events: SchoolEvent[] }) {
  const upcoming = events.filter((e) => e.status === "Akan Datang").slice(0, 3);

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading eyebrow="Agenda" title="Kegiatan Mendatang." />
          <LinkButton href="/events" variant="outline" size="sm">
            Semua Agenda <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {upcoming.map((ev, i) => {
            const d = new Date(ev.date);
            return (
              <motion.a
                key={ev.slug}
                href={`/events/${ev.slug}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex gap-4 rounded-2xl border border-border bg-bg p-4"
              >
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-blue text-white">
                  <span className="text-[10px] font-semibold tracking-wide">{monthShort[d.getMonth()]}</span>
                  <span className="text-xl font-extrabold leading-none">{d.getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">{ev.title}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-soft"><MapPin className="h-3.5 w-3.5" /> {ev.location}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
