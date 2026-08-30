"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

interface SearchItem {
  title: string;
  category: "Prestasi" | "Alumni" | "Berita" | "Agenda" | "Karier" | "Program";
  href: string;
  description: string;
}

const categories = ["Semua", "Prestasi", "Alumni", "Berita", "Agenda", "Karier", "Program"] as const;

export function SearchExplorer({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");

  const filtered = useMemo(() => {
    if (!query && category === "Semua") return [];
    return items.filter((item) => {
      const matchQuery = query ? item.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchCategory = category === "Semua" || item.category === category;
      return matchQuery && matchCategory;
    });
  }, [items, query, category]);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik kata kunci pencarian..."
          className="h-14 w-full rounded-2xl border border-border bg-surface pl-12 pr-4 text-base text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
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

      <div className="mt-8">
        {query === "" && category === "Semua" ? (
          <p className="py-16 text-center text-sm text-muted">Mulai ketik untuk mencari, atau pilih kategori di atas.</p>
        ) : filtered.length === 0 ? (
          <EmptyState title="Tidak ada hasil ditemukan." description="Coba kata kunci lain." />
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {filtered.slice(0, 30).map((item, i) => (
              <li key={i}>
                <Link href={item.href} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-alt">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
                    <p className="truncate text-xs text-muted">{item.description}</p>
                  </div>
                  <Badge tone="neutral">{item.category}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
