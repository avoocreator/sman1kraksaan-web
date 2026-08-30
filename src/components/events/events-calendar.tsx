"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { SchoolEvent } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const monthShort = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"];

export function EventsCalendar({ events }: { events: SchoolEvent[] }) {
  const [tab, setTab] = useState<"Akan Datang" | "Selesai">("Akan Datang");
  const filtered = events.filter((e) => e.status === tab);

  return (
    <div>
      <div className="flex gap-2">
        {(["Akan Datang", "Selesai"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              tab === t ? "border-orange bg-orange text-white" : "border-border text-ink-soft hover:border-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <EmptyState title="Belum ada agenda." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((ev) => {
              const d = new Date(ev.date);
              return (
                <Link
                  key={ev.slug}
                  href={`/events/${ev.slug}`}
                  className="group flex gap-4 rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-lg hover:shadow-ink/5"
                >
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-blue text-white">
                    <span className="text-[10px] font-semibold tracking-wide">{monthShort[d.getMonth()]}</span>
                    <span className="text-xl font-extrabold leading-none">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">{ev.title}</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-soft"><MapPin className="h-3.5 w-3.5" /> {ev.location}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-muted">{ev.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
