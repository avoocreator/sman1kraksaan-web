import { SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Kartu "tidak ada data". Props `icon` & `action` bersifat opsional —
 * dipakai halaman fasilitas untuk menampilkan ikon spesifik + tombol aksi.
 */
export function EmptyState({
  title = "Tidak ada data ditemukan.",
  description = "Coba ubah filter atau kata kunci pencarian.",
  icon: Icon = SearchX,
  action,
}: {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-alt/50 px-6 py-16 text-center">
      <Icon className="mb-4 h-8 w-8 text-muted" strokeWidth={1.5} />
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
