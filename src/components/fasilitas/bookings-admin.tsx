"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Search, Clock3, CheckCircle2, XCircle, Flag, RotateCcw, Inbox, MoreHorizontal,
} from "lucide-react";
import { FacilityBooking, BookingStatus } from "@/types";
import {
  subscribeBookings, getBookingsSnapshot, getBookingsServerSnapshot,
  changeBookingStatus, resetBookings,
} from "@/lib/bookings-client";
import { BookingStatusBadge } from "@/components/fasilitas/booking-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, formatTimeRange, cn } from "@/lib/utils";

const statusTabs: ("Semua" | BookingStatus)[] = ["Semua", "Menunggu", "Disetujui", "Ditolak", "Selesai"];

function statCard(label: string, value: number, tone: "orange" | "blue" | "green" | "red", Icon: React.ElementType) {
  const tones = {
    orange: "bg-orange-soft text-orange",
    blue: "bg-blue-soft text-blue",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-500",
  };
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", tones[tone])}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <p className="mt-3 text-2xl font-extrabold text-ink">{value}</p>
      <p className="mt-0.5 text-xs text-ink-soft">{label}</p>
    </div>
  );
}

export function BookingsAdmin() {
  const bookings = useSyncExternalStore(
    subscribeBookings,
    getBookingsSnapshot,
    getBookingsServerSnapshot
  );
  const [tab, setTab] = useState<(typeof statusTabs)[number]>("Semua");
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<FacilityBooking | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchTab = tab === "Semua" || b.status === tab;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.facilityName.toLowerCase().includes(q) ||
        b.requesterName.toLowerCase().includes(q) ||
        b.organization.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [bookings, tab, query]);

  function act(id: string, status: BookingStatus, adminNote?: string) {
    changeBookingStatus(id, status, adminNote);
    setOpenMenu(null);
  }

  function handleReset() {
    resetBookings();
    setTab("Semua");
    setQuery("");
  }

  const counts = {
    menunggu: bookings.filter((b) => b.status === "Menunggu").length,
    disetujui: bookings.filter((b) => b.status === "Disetujui").length,
    ditolak: bookings.filter((b) => b.status === "Ditolak").length,
    total: bookings.length,
  };

  return (
    <div className="space-y-6">
      {/* Statistik */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCard("Menunggu Verifikasi", counts.menunggu, "orange", Clock3)}
        {statCard("Disetujui", counts.disetujui, "green", CheckCircle2)}
        {statCard("Ditolak", counts.ditolak, "red", XCircle)}
        {statCard("Total Pemesanan", counts.total, "blue", Inbox)}
      </div>

      {/* Tabel */}
      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  tab === t ? "border-orange bg-orange text-white" : "border-border text-ink-soft hover:border-ink"
                )}
              >
                {t === "Semua" ? "Semua" : t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kode, fasilitas, pemesan..."
                className="h-9 w-full rounded-full border border-border bg-bg pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange/40 sm:w-56"
              />
            </div>
            <button
              onClick={handleReset}
              title="Reset data prototype ke kondisi awal"
              className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Data
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Tidak ada pemesanan." description="Ubah filter atau kata kunci pencarian." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Kode</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Fasilitas</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Pemesan</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Jadwal</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Keperluan</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-surface-alt/50">
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-ink">{b.id}</td>
                    <td className="px-4 py-3.5 text-ink-soft">{b.facilityName}</td>
                    <td className="px-4 py-3.5 text-ink-soft">
                      <span className="font-medium text-ink">{b.requesterName}</span>
                      <span className="block text-xs text-muted">{b.organization}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-ink-soft">
                      {formatDate(b.date)}
                      <span className="block text-xs font-medium text-muted">{formatTimeRange(b.startTime, b.endTime)} WIB</span>
                    </td>
                    <td className="max-w-56 px-4 py-3.5 text-xs leading-relaxed text-ink-soft">
                      <span className="line-clamp-2">{b.purpose}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="relative px-4 py-3.5 text-right">
                      <button
                        onClick={() => setOpenMenu(openMenu === b.id ? null : b.id)}
                        className="rounded-full p-1.5 text-muted hover:bg-surface-alt hover:text-ink"
                        aria-label="Aksi pemesanan"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === b.id && (
                        <div className="absolute right-4 top-10 z-10 w-44 rounded-xl border border-border bg-surface p-1 shadow-lg shadow-ink/5">
                          {b.status === "Menunggu" && (
                            <>
                              <button
                                onClick={() => act(b.id, "Disetujui", "Diverifikasi oleh Waka Sarana Prasarana.")}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Setujui
                              </button>
                              <button
                                onClick={() => { setRejectTarget(b); setRejectNote(""); setOpenMenu(null); }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Tolak…
                              </button>
                            </>
                          )}
                          {b.status === "Disetujui" && (
                            <button
                              onClick={() => act(b.id, "Selesai")}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-ink-soft hover:bg-surface-alt"
                            >
                              <Flag className="h-3.5 w-3.5" /> Tandai Selesai
                            </button>
                          )}
                          {(b.status === "Ditolak" || b.status === "Selesai") && (
                            <button
                              onClick={() => act(b.id, "Menunggu")}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-ink-soft hover:bg-surface-alt"
                            >
                              <Clock3 className="h-3.5 w-3.5" /> Ajukan Ulang Verifikasi
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal tolak */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-ink">Tolak Pemesanan {rejectTarget.id}</h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              {rejectTarget.facilityName} — {formatDate(rejectTarget.date)}, {formatTimeRange(rejectTarget.startTime, rejectTarget.endTime)} WIB oleh {rejectTarget.requesterName}.
            </p>
            <label className="mt-5 block text-xs font-medium text-ink-soft" htmlFor="reject-note">
              Alasan penolakan (dikirim ke pemesan)
            </label>
            <textarea
              id="reject-note" rows={3} value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}
              placeholder="cth. Bentrok dengan jadwal ujian sekolah…"
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/40"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setRejectTarget(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink hover:border-ink"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  act(rejectTarget.id, "Ditolak", rejectNote.trim() || "Tidak dapat dipenuhi pada jadwal tersebut.");
                  setRejectTarget(null);
                }}
                className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600"
              >
                Tolak Pemesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
