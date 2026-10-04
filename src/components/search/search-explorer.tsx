"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { SearchItem } from "@/types/search";
import { fuzzyScore, similarity } from "@/lib/fuzzy";
import { cn } from "@/lib/utils";

const categories = ["Semua", "Prestasi", "Alumni", "Berita", "Agenda", "Program"] as const;

function Highlight({ text, query }: { text: string; query: string }) {
  const lower = text.toLowerCase();
  const token = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .find((t) => lower.includes(t));
  if (!token) return <>{text}</>;
  const idx = lower.indexOf(token);
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-orange-soft px-0.5 text-ink">{text.slice(idx, idx + token.length)}</mark>
      {text.slice(idx + token.length)}
    </>
  );
}

export function SearchExplorer({
  items,
  initialQuery = "",
  popular = [],
}: {
  items: SearchItem[];
  initialQuery?: string;
  popular?: SearchItem[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q && category === "Semua") return [];
    return items
      .map((item) => ({
        item,
        score: fuzzyScore(q, item.title, `${item.description} ${item.category}`),
      }))
      .filter((x) => (category === "Semua" ? x.score > 0 : x.score > 0 && x.item.category === category))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((x) => x.item);
  }, [items, query, category]);

  const nearest = useMemo(() => {
    const q = query.trim();
    if (!q || filtered.length > 0) return [];
    return items
      .map((item) => ({ item, sim: Math.max(similarity(q, item.title), similarity(q, item.description) * 0.8) }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 3)
      .map((x) => x.item);
  }, [items, query, filtered.length]);

  const q = query.trim();
  const idle = !q && category === "Semua";

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          autoFocus={Boolean(initialQuery)}
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
        {idle ? (
          popular.length > 0 ? (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                <Sparkles className="h-3.5 w-3.5 text-orange" aria-hidden /> Populer &amp; terbaru
              </p>
              <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
                {popular.map((item, i) => (
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
            </div>
          ) : (
            <p className="py-16 text-center text-sm text-muted">Mulai ketik untuk mencari, atau pilih kategori di atas.</p>
          )
        ) : filtered.length === 0 ? (
          <div>
            <EmptyState
              title={`Tidak menemukan hasil untuk “${q}”.`}
              description={
                category !== "Semua"
                  ? "Coba pilih kategori Semua, atau gunakan kata kunci yang lebih umum."
                  : "Coba kata kunci yang lebih pendek atau lebih umum, misalnya nama kegiatannya saja."
              }
            />
            {nearest.length > 0 && (
              <div className="mt-8">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                  <Sparkles className="h-3.5 w-3.5 text-orange" aria-hidden /> Mungkin yang Anda cari
                </p>
                <ul className="mt-3 divide-y divide-border rounded-2xl border border-blue/25 bg-blue-soft/40">
                  {nearest.map((item, i) => (
                    <li key={i}>
                      <Link href={item.href} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-blue-soft/70">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
                          <p className="truncate text-xs text-muted">{item.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-blue" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-3 text-xs font-semibold text-muted">
              {filtered.length} hasil untuk “{q}”
              {category !== "Semua" ? ` dalam kategori ${category}` : ""}
            </p>
            <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {filtered.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-alt">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        <Highlight text={item.title} query={q} />
                      </p>
                      <p className="truncate text-xs text-muted">{item.description}</p>
                    </div>
                    <Badge tone="neutral">{item.category}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
