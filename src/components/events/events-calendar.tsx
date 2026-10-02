"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Sparkles } from "lucide-react";
import { SchoolEvent } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const monthShort = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"];

export function EventsCalendar({ events, today }: { events: SchoolEvent[]; today: string }) {
  const [tab, setTab] = useState<"Akan Datang" | "Selesai">("Akan Datang");
  const filtered = events.filter((e) => e.status === tab).sort((a, b) => {
    // Tab "Akan Datang": terdekat dulu. Tab "Selesai": yang terakhir lewat dulu.
    return tab === "Akan Datang" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
  });
  const todays = events
    .filter((e) => e.date === today)
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div>
      {/* Sorotan agenda hari ini — tampil otomatis kalau ada agenda bertanggal hari ini */}
      {todays.length > 0 && (
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-blue/30 bg-gradient-to-br from-blue-soft via-surface to-surface p-5 shadow-lg shadow-blue/10 sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue/10 blur-2xl" />
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue">
            <Sparkles className="h-4 w-4" aria-hidden />
            Berlangsung hari ini
          </p>
          <ul className="mt-3 space-y-2">
            {todays.map((ev) => (
              <li key={ev.slug}>
                <Link
                  href={`/events/${ev.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-blue/20 bg-white/80 px-4 py-3 transition-colors hover:border-blue/50 hover:bg-white"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange" />
                    </span>
                    <span className="truncate text-sm font-semibold text-ink group-hover:text-blue">{ev.title}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-blue px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Hari ini
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

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
              const isToday = ev.date === today;
              return (
                <Link
                  key={ev.slug}
                  href={`/events/${ev.slug}`}
                  className={cn(
                    "group relative flex gap-4 rounded-2xl border p-5 transition-shadow",
                    isToday
                      ? "border-blue bg-gradient-to-br from-blue-soft/80 via-surface to-surface shadow-lg shadow-blue/10 ring-1 ring-blue/30"
                      : "border-border bg-surface hover:shadow-lg hover:shadow-ink/5",
                  )}
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
                    className={cn(
                      "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-white",
                      isToday ? "bg-gradient-to-b from-blue-bright to-blue shadow-md shadow-blue/30" : "bg-blue",
                    )}
                  >
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
