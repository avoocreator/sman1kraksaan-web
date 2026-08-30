import { SearchX } from "lucide-react";

export function EmptyState({
  title = "Tidak ada data ditemukan.",
  description = "Coba ubah filter atau kata kunci pencarian.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt/50 px-6 py-16 text-center">
      <SearchX className="mb-4 h-8 w-8 text-muted" strokeWidth={1.5} />
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
    </div>
  );
}
