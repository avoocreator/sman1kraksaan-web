"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ScanSearch, CheckCircle2, Clock3, XCircle, Flag, Loader2 } from "lucide-react";
import { FacilityBooking } from "@/types";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/fasilitas/booking-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatTimeRange } from "@/lib/utils";
import { cn } from "@/lib/utils";

const timelineSteps = [
  { label: "Pengajuan Dikirim", icon: ScanSearch },
  { label: "Diverifikasi Admin", icon: Clock3 },
  { label: "Keputusan", icon: CheckCircle2 },
  { label: "Pelaksanaan", icon: Flag },
];

function statusIndex(status: FacilityBooking["status"]): number {
  switch (status) {
    case "Menunggu": return 1;
    case "Disetujui": return 2;
    case "Ditolak": return 2;
    case "Selesai": return 3;
  }
}

function BookingResult({ booking }: { booking: FacilityBooking }) {
  const idx = statusIndex(booking.status);
  const rejected = booking.status === "Ditolak";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg shadow-ink/5 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Kode Pemesanan</p>
            <p className="text-2xl font-extrabold tracking-wide text-orange">{booking.id}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Timeline status */}
        <div className="mt-8">
          <div className="relative flex justify-between">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
            <div
              className={cn(
                "absolute left-0 top-4 h-0.5 transition-all",
                rejected ? "bg-red-400" : "bg-orange"
              )}
              style={{ width: `${(idx / (timelineSteps.length - 1)) * 100}%` }}
            />
            {timelineSteps.map((step, i) => {
              const Icon = rejected && i === 2 ? XCircle : step.icon;
              const done = i <= idx;
              return (
                <div key={step.label} className="relative z-10 flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-surface",
                      rejected && i === 2
                        ? "border-red-300 text-red-500"
                        : done
                          ? "border-orange text-orange"
                          : "border-border text-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={cn("mt-2 max-w-20 text-[11px] leading-tight", done ? "font-semibold text-ink" : "text-muted")}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {rejected && booking.adminNote && (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-600">
              <span className="font-semibold">Catatan admin:</span> {booking.adminNote}
            </p>
          )}
          {booking.status === "Disetujui" && booking.adminNote && (
            <p className="mt-6 rounded-xl bg-blue-soft px-4 py-3 text-xs leading-relaxed text-blue">
              <span className="font-semibold">Catatan admin:</span> {booking.adminNote}
            </p>
          )}
        </div>
      </div>

      {/* Detail pemesanan */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <h3 className="text-sm font-bold text-ink">Detail Pemesanan</h3>
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">Fasilitas</dt>
            <dd className="mt-0.5 font-medium text-ink">{booking.facilityName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Tanggal &amp; Waktu</dt>
            <dd className="mt-0.5 font-medium text-ink">
              {formatDate(booking.date)} • {formatTimeRange(booking.startTime, booking.endTime)} WIB
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Nama Pemesan</dt>
            <dd className="mt-0.5 font-medium text-ink">{booking.requesterName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Kategori / Organisasi</dt>
            <dd className="mt-0.5 font-medium text-ink">{booking.requesterType} — {booking.organization}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Jumlah Peserta</dt>
            <dd className="mt-0.5 font-medium text-ink">{booking.participants} orang</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Diajukan Pada</dt>
            <dd className="mt-0.5 font-medium text-ink">
              {new Date(booking.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted">Keperluan</dt>
            <dd className="mt-0.5 leading-relaxed text-ink-soft">{booking.purpose}</dd>
          </div>
        </dl>
      </div>
    </motion.div>
  );
}

export function StatusChecker() {
  const params = useSearchParams();
  const initialCode = params.get("kode") ?? "";

  const [code, setCode] = useState(initialCode);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<FacilityBooking | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function runCheck(rawCode: string) {
    const target = rawCode.trim();
    if (!target) return;
    setChecking(true);
    setNotFound(false);
    setResult(null);
    try {
      const res = await fetch(`/api/bookings?kode=${encodeURIComponent(target)}`);
      const json = await res.json().catch(() => null);
      if (res.ok && json?.booking) setResult(json.booking as FacilityBooking);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setChecking(false);
    }
  }

  // Kode dari URL (link "Lacak Status" dari form) dicek otomatis saat masuk.
  useEffect(() => {
    if (initialCode) void runCheck(initialCode);
  }, [initialCode]);

  function handleCheck(e?: React.FormEvent, override?: string) {
    e?.preventDefault();
    void runCheck(override ?? code);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleCheck} className="mx-auto max-w-xl">
        <label htmlFor="kode" className="mb-1.5 block text-center text-xs font-medium text-ink-soft">
          Masukkan kode pemesanan (cth. FSV-2026-0001)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="kode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="FSV-2026-0001"
              className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm uppercase tracking-wide text-ink placeholder:text-muted placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-orange/40"
            />
          </div>
          <Button type="submit" disabled={checking}>
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lacak"}
          </Button>
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          Status diperbarui langsung dari admin sarana prasarana.
        </p>
      </form>

      {notFound && !checking && (
        <EmptyState
          title="Kode pemesanan tidak ditemukan."
          description="Periksa kembali kode Anda, atau hubungi Tata Usaha untuk bantuan."
        />
      )}
      {result && <BookingResult booking={result} />}
    </div>
  );
}
