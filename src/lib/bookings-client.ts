"use client";

import { FacilityBooking, BookingStatus } from "@/types";
import { seedBookings } from "@/data/bookings";
import { timeOverlaps } from "@/lib/utils";

/**
 * Penyimpanan pemesanan untuk PROTOTYPE.
 * Data disimpan di localStorage browser agar seluruh alur
 * (pengajuan -> verifikasi admin -> cek status) bisa dicoba end-to-end
 * tanpa backend. Pada produksi, ganti dengan REST API + database.
 *
 * Mengikuti pola external store (useSyncExternalStore) agar komponen
 * yang membaca data ini selalu sinkron dengan perubahan terbaru.
 */

const STORAGE_KEY = "sman1kraksaan-fasilitas-bookings-v2";
const CHANGE_EVENT = "sman1kraksaan:bookings-changed";

let cache: FacilityBooking[] | null = null;

function read(): FacilityBooking[] {
  if (typeof window === "undefined") return seedBookings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBookings));
      return seedBookings;
    }
    return JSON.parse(raw) as FacilityBooking[];
  } catch {
    return seedBookings;
  }
}

function write(list: FacilityBooking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  cache = list;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeBookings(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function getBookingsSnapshot(): FacilityBooking[] {
  if (cache === null) cache = read();
  return cache;
}

/** Snapshot untuk render server (SSR/hydration awal). */
export function getBookingsServerSnapshot(): FacilityBooking[] {
  return seedBookings;
}

export function generateBookingCode(existing: FacilityBooking[]): string {
  const year = new Date().getFullYear();
  const maxSeq = existing
    .map((b) => Number.parseInt(b.id.split("-").pop() ?? "0", 10))
    .reduce((a, b) => (Number.isFinite(b) && b > a ? b : a), 0);
  return `FSV-${year}-${String(maxSeq + 1).padStart(4, "0")}`;
}

export function persistBooking(booking: FacilityBooking) {
  write([booking, ...getBookingsSnapshot()]);
}

export function changeBookingStatus(id: string, status: BookingStatus, adminNote?: string) {
  write(
    getBookingsSnapshot().map((b) =>
      b.id === id ? { ...b, status, adminNote: adminNote ?? b.adminNote } : b
    )
  );
}

export function findBooking(code: string): FacilityBooking | undefined {
  return getBookingsSnapshot().find(
    (b) => b.id.toLowerCase() === code.trim().toLowerCase()
  );
}

/**
 * Cari pemesanan lain yang jadwalnya berbenturan (fasilitas, tanggal,
 * dan rentang jam yang tumpang tindih). Dipakai form pemesanan untuk
 * memperingatkan pengguna sebelum pengajuan dikirim.
 */
export function findConflicts(
  facilitySlug: string,
  date: string,
  startTime: string,
  endTime: string
): { approved: FacilityBooking[]; pending: FacilityBooking[] } {
  const all = getBookingsSnapshot().filter(
    (b) =>
      b.facilitySlug === facilitySlug &&
      b.date === date &&
      b.status !== "Ditolak" &&
      b.status !== "Selesai"
  );
  return {
    approved: all.filter(
      (b) => b.status === "Disetujui" && timeOverlaps(startTime, endTime, b.startTime, b.endTime)
    ),
    pending: all.filter(
      (b) => b.status === "Menunggu" && timeOverlaps(startTime, endTime, b.startTime, b.endTime)
    ),
  };
}

/** Kembalikan data prototype ke kondisi awal (seed). */
export function resetBookings() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  cache = null;
  write(read());
}
