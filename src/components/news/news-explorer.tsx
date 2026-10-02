"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { NewsArticle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, cn } from "@/lib/utils";

const PAGE_SIZE = 6;

export function NewsExplorer({ articles }: { articles: NewsArticle[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [page, setPage] = useState(1);
  const categories = ["Semua", ...Array.from(new Set(articles.map((a) => a.category)))];

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchQuery = a.title.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "Semua" || a.category === category;
      return matchQuery && matchCategory;
    });
  }, [articles, query, category]);

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
            placeholder="Cari berita..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      <div className="mt-8">
        {paged.length === 0 ? (
          <EmptyState title="Tidak ada berita ditemukan." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((a) => (
              <Link key={a.slug} href={`/news/${a.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={a.cover} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <Badge tone="neutral">{a.category}</Badge>
                  <p className="mt-2.5 text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">{a.title}</p>
                  <p className="mt-2 text-xs text-muted">{formatDate(a.publishedAt)}</p>
                </div>
              </Link>
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
              className={cn("h-9 w-9 rounded-full text-sm font-medium transition-colors", page === i + 1 ? "bg-orange text-white" : "text-ink-soft hover:bg-surface-alt")}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
