"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Calendar, MapPin, Search } from "lucide-react";
import { CareerOpportunity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, cn } from "@/lib/utils";

const types = ["Semua", "Magang", "PKL", "Penuh Waktu", "Paruh Waktu"] as const;

export function CareerExplorer({ opportunities }: { opportunities: CareerOpportunity[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("Semua");

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      const q = query.toLowerCase();
      const matchQuery = o.position.toLowerCase().includes(q) || o.company.toLowerCase().includes(q);
      const matchType = type === "Semua" || o.type === type;
      return matchQuery && matchType;
    });
  }, [opportunities, query, type]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari posisi atau perusahaan..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                type === t ? "border-orange bg-orange text-white" : "border-border text-ink-soft hover:border-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada peluang ditemukan." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((job) => (
              <Link
                key={job.slug}
                href={`/career/${job.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-lg hover:shadow-ink/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <Badge tone="blue" className="mb-2">{job.type}</Badge>
                  <p className="truncate text-sm font-semibold text-ink group-hover:text-orange-dark">{job.position}</p>
                  <p className="mt-0.5 text-xs text-muted">{job.company}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(job.deadline)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
