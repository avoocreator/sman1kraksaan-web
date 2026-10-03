"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";
import { FacilityBooking } from "@/types";
import { formatDateShort, formatTimeRange } from "@/lib/utils";

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Daftar pemesanan terdekat untuk satu fasilitas — menampilkan siapa,
 * kapan, dan untuk apa fasilitas akan dipakai. Data diambil server-side
 * dari Strapi lalu dikirim sebagai prop.
 */
export function FacilityUpcoming({ slug, bookings }: { slug: string; bookings: FacilityBooking[] }) {
  const upcoming = useMemo(() => {
    const today = todayIso();
    return bookings
      .filter(
        (b) =>
          b.facilitySlug === slug &&
          b.date >= today &&
          (b.status === "Disetujui" || b.status === "Menunggu")
      )
      .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
      .slice(0, 3);
  }, [bookings, slug]);

  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" /> Jadwal Terdekat
        </span>
        <Link href="/fasilitas/jadwal" className="text-[11px] font-semibold normal-case text-orange hover:underline">
          Lihat semua
        </Link>
      </p>

      {upcoming.length === 0 ? (
        <p className="mt-3 rounded-xl bg-surface-alt/70 px-3.5 py-3 text-xs leading-relaxed text-ink-soft">
          Belum ada pemesanan mendatang — semua slot masih bebas.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {upcoming.map((b) => (
            <li key={b.id} className="rounded-xl border border-border bg-bg px-3.5 py-2.5">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-ink">
                {formatDateShort(b.date)}
                <span className="flex items-center gap-1 font-medium text-orange">
                  <Clock3 className="h-3 w-3" /> {formatTimeRange(b.startTime, b.endTime)} WIB
                </span>
                {b.status === "Menunggu" && (
                  <span className="rounded-full bg-orange-soft px-2 py-0.5 text-[10px] text-orange-dark">
                    Menunggu
                  </span>
                )}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted">
                {b.requesterName} — {b.organization}: {b.purpose}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
