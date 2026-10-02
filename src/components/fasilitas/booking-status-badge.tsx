import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils";

const styles: Record<BookingStatus, { tone: "orange" | "blue" | "neutral"; className?: string; label: string }> = {
  Menunggu: { tone: "orange", label: "Menunggu Verifikasi" },
  Disetujui: { tone: "blue", className: "bg-emerald-50 text-emerald-700", label: "Disetujui" },
  Ditolak: { tone: "neutral", className: "bg-red-50 text-red-600", label: "Ditolak" },
  Selesai: { tone: "neutral", className: "bg-surface-alt text-muted", label: "Selesai" },
};

export function BookingStatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  const s = styles[status];
  return (
    <Badge tone={s.tone} className={cn(s.className, className)}>
      {s.label}
    </Badge>
  );
}
