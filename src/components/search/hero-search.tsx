"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Newspaper,
  Search,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SearchCategory, SearchItem } from "@/types/search";
import { fuzzyScore } from "@/lib/fuzzy";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<SearchCategory, LucideIcon> = {
  Berita: Newspaper,
  Agenda: CalendarDays,
  Prestasi: Trophy,
  Alumni: GraduationCap,
  Program: BookOpen,
};

/** Bold potongan judul yang cocok dengan kueri (case-insensitive). */
function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  const hit = tokens.map((t) => text.toLowerCase().indexOf(t)).find((i) => i >= 0);
  const len = tokens.find((t) => text.toLowerCase().includes(t))?.length ?? 0;
  if (hit === undefined) return <>{text}</>;
  return (
    <>
      {text.slice(0, hit)}
      <mark className="rounded bg-orange-soft px-0.5 text-ink">{text.slice(hit, hit + len)}</mark>
      {text.slice(hit + len)}
    </>
  );
}

/**
 * Search bar beranda dengan REKOMENDASI.
 *
 * - Fokus (belum mengetik): tampil ±5 konten terkurasi — agenda hari ini,
 *   berita terbaru, prestasi terbaru (diambil dari server, ISR 60 detik).
 * - Saat mengetik: saran langsung terfilter dengan pencocokan longgar
 *   (fuzzy), maksimal 5.
 * - Keyboard: ↑↓ memilih, Enter membuka saran atau ke halaman pencarian,
 *   Esc menutup. Tanpa JS pun form tetap submit ke /search?q=…
 */
export function HeroSearch({
  suggestions,
  className = "",
}: {
  suggestions: SearchItem[];
  /** Kelas ukuran untuk menyelaraskan dengan tombol di sampingnya. */
  className?: string;
}) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Tutup dropdown saat klik di luar komponen.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const list = useMemo<SearchItem[]>(() => {
    const q = query.trim();
    if (!q) return suggestions.slice(0, 5);
    return suggestions
      .map((s) => ({ s, score: fuzzyScore(q, s.title, s.description) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.s);
  }, [query, suggestions]);

  const openNow = open && (list.length > 0 || query.trim().length > 0);

  const pick = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    setActive(-1);
    inputRef.current?.blur();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && list.length) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % list.length);
    } else if (e.key === "ArrowUp" && list.length) {
      e.preventDefault();
      setActive((a) => (a <= 0 ? list.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      if (active >= 0 && list[active]) {
        e.preventDefault();
        pick(list[active]);
      }
      // Enter tanpa pilihan → biarkan form submit ke /search?q=…
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div ref={wrapRef} className={cn("relative w-full min-w-0", className)}>
      <form
        action="/search"
        role="search"
        onSubmit={() => {
          setOpen(false);
        }}
        className="flex h-12 items-center rounded-full border border-border bg-surface pl-4 pr-1 transition-colors focus-within:border-ink/40"
      >
        <Search className="h-4.5 w-4.5 shrink-0 text-muted" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Cari berita, agenda, prestasi..."
          autoComplete="off"
          aria-label="Cari konten sekolah"
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted"
        />
      </form>

      {openNow && (
        <div
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-ink/10"
        >
          <p className="border-b border-border/70 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            {query.trim() ? "Saran pencarian" : "Rekomendasi untuk kamu"}
          </p>

          {list.length === 0 ? (
            <p className="px-4 py-3.5 text-sm text-ink-soft">
              Tidak ada saran untuk “{query.trim()}” — tekan Enter untuk mencari di halaman Pencarian.
            </p>
          ) : (
            <ul className="max-h-[320px] overflow-y-auto py-1">
              {list.map((item, i) => {
                const Icon = CATEGORY_ICON[item.category] ?? Newspaper;
                return (
                  <li key={`${item.href}-${item.title}`} role="option" aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => pick(item)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                        i === active ? "bg-surface-alt" : "bg-transparent",
                      )}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-alt text-blue">
                        <Icon className="h-4.5 w-4.5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          <Highlight text={item.title} query={query} />
                        </span>
                        <span className="block truncate text-xs text-muted">{item.description}</span>
                      </span>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted">
                        {item.category}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-between gap-2 border-t border-border/70 bg-surface-alt/60 px-4 py-2.5 text-left text-xs font-semibold text-ink transition-colors hover:bg-surface-alt"
          >
            <span className="truncate">
              {query.trim() ? `Cari “${query.trim()}” di semua konten` : "Cari apa saja di halaman Pencarian"}
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-orange" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
