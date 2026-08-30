"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Alumnus } from "@/types";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const categories = ["Semua", "Pendidikan Tinggi", "Karier Profesional", "Wirausaha"] as const;

export function AlumniExplorer({ alumni }: { alumni: Alumnus[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");

  const filtered = useMemo(() => {
    return alumni.filter((a) => {
      const q = query.toLowerCase();
      const matchQuery =
        a.name.toLowerCase().includes(q) ||
        a.destination.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q);
      const matchCategory = category === "Semua" || a.category === category;
      return matchQuery && matchCategory;
    });
  }, [alumni, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, kampus, atau perusahaan..."
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

      <p className="mt-5 text-xs text-muted">{filtered.length} alumni ditemukan</p>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState title="Tidak ada alumni ditemukan." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((a) => (
              <Link
                key={a.slug}
                href={`/alumni/${a.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={a.photo} alt={a.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">{a.name}</p>
                  <p className="mt-0.5 text-xs text-muted">Angkatan {a.graduationYear}</p>
                  <p className="mt-1.5 text-xs leading-snug text-ink-soft">{a.role}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
