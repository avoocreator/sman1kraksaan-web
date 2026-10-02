"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Facility } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { FacilityCard } from "@/components/fasilitas/facility-card";
import { cn } from "@/lib/utils";

const categories = [
  "Semua",
  "Aula & Serbaguna",
  "Laboratorium",
  "Olahraga & Lapangan",
  "Seni & Ekstrakurikuler",
  "Perpustakaan",
  "Ruang Rapat",
] as const;

export function FacilityExplorer({ facilities }: { facilities: Facility[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      const q = query.toLowerCase();
      const matchQuery =
        f.name.toLowerCase().includes(q) ||
        f.shortDescription.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q);
      const matchCategory = category === "Semua" || f.category === category;
      return matchQuery && matchCategory;
    });
  }, [facilities, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau lokasi fasilitas..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                category === c ? "border-orange bg-orange text-white" : "border-border text-ink-soft hover:border-ink"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-xs text-muted">{filtered.length} fasilitas ditemukan</p>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada fasilitas ditemukan." description="Coba ubah filter atau kata kunci pencarian." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((f, i) => (
              <FacilityCard key={f.slug} facility={f} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
