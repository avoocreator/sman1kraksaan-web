"use client";

import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
}

const PAGE_SIZE = 8;

export function DataTable<T extends { id: string }>({
  title,
  addLabel,
  columns,
  rows,
  searchKeys,
}: {
  title: string;
  addLabel: string;
  columns: Column<T>[];
  rows: T[];
  searchKeys: (row: T) => string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(
    () => rows.filter((r) => searchKeys(r).toLowerCase().includes(query.toLowerCase())),
    [rows, query, searchKeys]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Cari..."
              className="h-9 w-full rounded-full border border-border bg-bg pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange/40 sm:w-48"
            />
          </div>
          <button className="flex h-9 items-center gap-1.5 rounded-full bg-orange px-4 text-xs font-semibold text-white hover:bg-orange-dark">
            <Plus className="h-3.5 w-3.5" /> {addLabel}
          </button>
        </div>
      </div>

      {paged.length === 0 ? (
        <div className="p-6"><EmptyState title="Belum ada data." description="Tambahkan data baru untuk memulai." /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                {columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">{c.label}</th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-surface-alt/50">
                  {columns.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-4 py-3.5 text-ink-soft">{c.render(row)}</td>
                  ))}
                  <td className="relative px-4 py-3.5 text-right">
                    <button
                      onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
                      className="rounded-full p-1.5 text-muted hover:bg-surface-alt hover:text-ink"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === row.id && (
                      <div className="absolute right-4 top-10 z-10 w-36 rounded-xl border border-border bg-surface p-1 shadow-lg shadow-ink/5">
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-ink-soft hover:bg-surface-alt">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted">
          <span>Halaman {page} dari {totalPages}</span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn("h-7 w-7 rounded-full font-medium", page === i + 1 ? "bg-orange text-white" : "hover:bg-surface-alt")}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { Badge };
