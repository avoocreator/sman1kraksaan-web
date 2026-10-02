"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Achievement } from "@/types";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

const categories = ["Semua", "Akademik", "Teknologi", "Olahraga", "Seni"] as const;
const levels = ["Semua", "Sekolah", "Kabupaten", "Provinsi", "Nasional", "Internasional"] as const;
const PAGE_SIZE = 8;

export function AchievementsExplorer({ achievements }: { achievements: Achievement[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");
  const [level, setLevel] = useState<(typeof levels)[number]>("Semua");
  const [sort, setSort] = useState<"terbaru" | "terlama">("terbaru");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = achievements.filter((a) => {
      const matchQuery = a.title.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "Semua" || a.category === category;
      const matchLevel = level === "Semua" || a.level === level;
      return matchQuery && matchCategory && matchLevel;
    });
    list = list.sort((a, b) => (sort === "terbaru" ? b.year - a.year : a.year - b.year));
    return list;
  }, [achievements, query, category, level, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Cari prestasi..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "terbaru" | "terlama")}
          className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-ink-soft focus:outline-none"
        >
          <option value="terbaru">Urutkan: Terbaru</option>
          <option value="terlama">Urutkan: Terlama</option>
        </select>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c); setPage(1); }}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              category === c ? "border-orange bg-orange text-white" : "border-border text-ink-soft hover:border-ink"
            )}
          >
            {c}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-border" />
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => { setLevel(l); setPage(1); }}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              level === l ? "border-blue bg-blue text-white" : "border-border text-ink-soft hover:border-ink"
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted">{filtered.length} prestasi ditemukan</p>

      <div className="mt-4">
        {paged.length === 0 ? (
          <EmptyState title="Tidak ada prestasi ditemukan." description="Coba ubah filter atau kata kunci pencarian." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {paged.map((a, i) => (
              <AchievementCard achievement={a} key={a.slug} index={i} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={cn(
                "h-9 w-9 rounded-full text-sm font-medium transition-colors",
                page === i + 1 ? "bg-orange text-white" : "text-ink-soft hover:bg-surface-alt"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
