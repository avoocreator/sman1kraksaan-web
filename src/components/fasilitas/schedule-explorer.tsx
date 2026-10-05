"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Clock3, CalendarCheck2, CalendarDays, Info, Users,
} from "lucide-react";
import { FacilityBooking } from "@/types";
import { facilities } from "@/data/facilities";
import { BookingStatusBadge } from "@/components/fasilitas/booking-status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import {
  formatDayName, formatDate, formatDateShort, formatTime, formatTimeRange, cn,
} from "@/lib/utils";

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isoOf(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const monthLabelFmt = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });

function monthMatrix(anchorIso: string): (string | null)[][] {
  const d = new Date(anchorIso + "T00:00:00");
  const year = d.getFullYear();
  const month = d.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (string | null)[] = Array(offset).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(isoOf(year, month + 1, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function ScheduleExplorer({ bookings }: { bookings: FacilityBooking[] }) {
  const today = todayIso();
  const [monthAnchor, setMonthAnchor] = useState(() => today.slice(0, 8) + "01");
  const [selected, setSelected] = useState(today);
  const [facilityFilter, setFacilityFilter] = useState("semua");
  const [includePending, setIncludePending] = useState(true);

  const visible = useMemo(
    () =>
      bookings
        .filter((b) => {
          const matchFacility =
            facilityFilter === "semua" || b.facilitySlug === facilityFilter;
          const matchStatus = includePending
            ? b.status !== "Ditolak"
            : b.status === "Disetujui" || b.status === "Selesai";
          return b.date === selected && matchFacility && matchStatus;
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [bookings, selected, facilityFilter, includePending]
  );

  const groups = useMemo(() => {
    const byFacility = new Map<string, FacilityBooking[]>();
    for (const b of visible) {
      const arr = byFacility.get(b.facilitySlug) ?? [];
      arr.push(b);
      byFacility.set(b.facilitySlug, arr);
    }
    return facilities
      .filter((f) => byFacility.has(f.slug))
      .map((f) => ({ facility: f, items: byFacility.get(f.slug)! }));
  }, [visible]);

  const countByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of bookings) {
      if (b.status === "Ditolak") continue;
      if (facilityFilter !== "semua" && b.facilitySlug !== facilityFilter) continue;
      map[b.date] = (map[b.date] ?? 0) + 1;
    }
    return map;
  }, [bookings, facilityFilter]);

  const pendingOnSelected = visible.filter((b) => b.status === "Menunggu").length;
  const weeks = useMemo(() => monthMatrix(monthAnchor), [monthAnchor]);
  const monthLabel = monthLabelFmt.format(new Date(monthAnchor + "T00:00:00"));
  const monthTotal = useMemo(
    () =>
      Object.entries(countByDate).reduce(
        (sum, [date, n]) => (date.slice(0, 7) === monthAnchor.slice(0, 7) ? sum + n : sum),
        0
      ),
    [countByDate, monthAnchor]
  );

  const shiftMonth = (delta: number) => {
    const d = new Date(monthAnchor + "T00:00:00");
    d.setDate(1);
    d.setMonth(d.getMonth() + delta);
    setMonthAnchor(isoOf(d.getFullYear(), d.getMonth() + 1, 1));
  };
  const goToday = () => {
    setSelected(today);
    setMonthAnchor(today.slice(0, 8) + "01");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)] lg:items-start">
      {/* kalender */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-lg shadow-ink/5 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-base font-extrabold text-ink sm:text-lg">{monthLabel}</p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={goToday}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  selected === today
                    ? "border-orange bg-orange text-white"
                    : "border-border text-ink-soft hover:border-ink hover:text-ink"
                )}
              >
                Hari Ini
              </button>
              <button
                onClick={() => shiftMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-ink hover:text-ink"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => shiftMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-ink hover:text-ink"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 sm:gap-1.5">
            {WEEKDAYS.map((w) => (
              <p
                key={w}
                className="text-center text-[10px] font-bold uppercase tracking-wider text-muted"
              >
                {w}
              </p>
            ))}
          </div>

          <div className="mt-1.5 space-y-1 sm:space-y-1.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {week.map((d, di) => {
                  if (!d) {
                    return <div key={`empty-${wi}-${di}`} aria-hidden className="h-12 sm:h-14" />;
                  }
                  const dayNum = Number(d.slice(8, 10));
                  const count = countByDate[d] ?? 0;
                  const isSel = d === selected;
                  const isToday = d === today;
                  const isPast = d < today;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelected(d)}
                      className={cn(
                        "relative flex h-12 flex-col items-center justify-center rounded-xl border text-sm transition-colors sm:h-14",
                        isSel
                          ? "border-orange bg-orange font-extrabold text-white shadow-sm shadow-orange/30"
                          : isToday
                            ? "border-orange/60 bg-orange-soft/40 font-bold text-ink hover:border-orange"
                            : isPast
                              ? "border-border/70 bg-surface-alt/50 text-muted hover:border-ink"
                              : "border-border bg-surface text-ink-soft hover:border-ink hover:text-ink"
                      )}
                    >
                      <span className="leading-none">{dayNum}</span>
                      {count > 0 ? (
                        <span
                          className={cn(
                            "mt-1 rounded-full px-1.5 text-[9px] font-bold leading-[14px]",
                            isSel ? "bg-white/30 text-white" : "bg-orange/15 text-orange-dark"
                          )}
                        >
                          {count}
                        </span>
                      ) : isToday ? (
                        <span className={cn("mt-1 h-1 w-1 rounded-full", isSel ? "bg-white/70" : "bg-orange")} />
                      ) : (
                        <span className="mt-1 h-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3.5 text-[11px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange" /> Ada pemesanan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-orange" /> Hari ini
            </span>
            <span className="ml-auto font-semibold text-ink">
              {monthTotal} pemesanan bulan ini
            </span>
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {/* daftar booking */}
        <div className="rounded-3xl bg-blue p-4 text-white shadow-lg shadow-blue/25 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-extrabold text-white">
                <CalendarDays className="h-4 w-4 text-orange" /> {formatDayName(selected)}
              </p>
              <p className="mt-0.5 text-xs text-white/70">{formatDate(selected)}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={facilityFilter}
                onChange={(e) => setFacilityFilter(e.target.value)}
                className="h-9 w-full rounded-full border border-white/20 bg-white px-3.5 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-orange/60 sm:w-52"
                aria-label="Filter fasilitas"
              >
                <option value="semua">Semua Fasilitas</option>
                {facilities.map((f) => (
                  <option key={f.slug} value={f.slug}>{f.name}</option>
                ))}
              </select>
              <label className="flex cursor-pointer items-center justify-center gap-2 text-xs font-medium text-white/85 sm:justify-end">
                <input
                  type="checkbox"
                  checked={includePending}
                  onChange={(e) => setIncludePending(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/40 accent-orange"
                />
                Termasuk pengajuan menunggu
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/15 pt-3.5">
            <span className="rounded-full bg-orange px-3 py-1 text-[11px] font-bold text-ink">
              {visible.length} pemesanan
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white">
              {groups.length} fasilitas terbooking
            </span>
            {pendingOnSelected > 0 && (
              <span className="rounded-full border border-dashed border-white/40 px-3 py-1 text-[11px] font-semibold text-white/85">
                {pendingOnSelected} menunggu verifikasi
              </span>
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={CalendarCheck2}
            title="Belum ada pemesanan pada tanggal ini."
            description={
              facilityFilter !== "semua"
                ? "Coba pilih fasilitas lain atau lihat semua fasilitas untuk tanggal ini."
                : "Semua fasilitas masih leluasa digunakan pada tanggal ini. Ajukan pemesanan sekarang."
            }
            action={<LinkButton href="/fasilitas/pesan">Ajukan Pemesanan</LinkButton>}
          />
        ) : (
          <div className="space-y-4">
            {groups.map(({ facility, items }) => (
              <div key={facility.slug} className="overflow-hidden rounded-3xl border border-border bg-surface">
                <div className="flex items-center gap-3 border-b border-border bg-surface-alt/50 px-4 py-3">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="h-11 w-11 shrink-0 rounded-xl border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/fasilitas/${facility.slug}`}
                      className="block truncate text-sm font-bold text-ink hover:text-orange-dark"
                    >
                      {facility.name}
                    </Link>
                    <p className="truncate text-[11px] text-muted">
                      {formatTime(facility.openTime)}–{formatTime(facility.closeTime)} WIB • {items.length} sesi terisi
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-orange px-2.5 py-1 text-[10px] font-bold text-white">
                    {items.length}
                  </span>
                </div>

                <ul className="divide-y divide-border">
                  {items.map((b) => (
                    <li key={b.id} className="px-4 py-3.5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="shrink-0 sm:w-24">
                          <p className="flex items-center gap-1.5 text-base font-extrabold leading-none text-ink">
                            <Clock3 className="h-3.5 w-3.5 text-orange" /> {formatTime(b.startTime)}
                          </p>
                          <p className="mt-1 text-[11px] text-muted">s.d. {formatTime(b.endTime)} WIB</p>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-ink">
                            {b.requesterName}
                            <span className="rounded-full bg-blue-soft px-2 py-0.5 text-[10px] font-semibold text-blue">
                              {b.requesterType}
                            </span>
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                            <Users className="h-3 w-3" />
                            {b.organization} • {b.participants} orang
                          </p>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                            <span className="font-semibold text-ink-soft">Untuk: </span>
                            {b.purpose}
                          </p>
                        </div>

                        <div className="shrink-0 sm:pt-0.5">
                          <BookingStatusBadge status={b.status} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-3.5 text-xs leading-relaxed text-ink-soft">
              <span className="flex items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange" />
                <span>
                  Ingin mengunci salah satu slot di atas? Buka{" "}
                  <Link href="/fasilitas/pesan" className="font-semibold text-orange hover:underline">
                    formulir pemesanan
                  </Link>{" "}
                  dan atur tanggal serta jam mulai–selesai secara bebas sesuai kebutuhan kegiatan Anda.
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
