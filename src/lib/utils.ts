import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** "2 Okt 2026" — untuk ruang tabel/kartu yang sempit. */
export function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Nama hari dalam bahasa Indonesia, cth. "Kamis". */
export function formatDayName(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(new Date(iso));
}

/** "13:00" -> "13.00" (konvensi penulisan waktu Indonesia). */
export function formatTime(t: string) {
  return t.replace(":", ".");
}

/** "13:00", "16:00" -> "13.00–16.00". */
export function formatTimeRange(start: string, end: string) {
  return `${formatTime(start)}–${formatTime(end)}`;
}

/** Durasi antara dua jam "HH:mm" dalam menit. */
export function durationMinutes(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if (![sh, sm, eh, em].every(Number.isFinite)) return 0;
  return eh * 60 + em - (sh * 60 + sm);
}

/** Label durasi ramah baca, cth. "2 jam 30 menit" / "45 menit". */
export function formatDuration(start: string, end: string) {
  const m = durationMinutes(start, end);
  if (m <= 0) return "";
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return `${rest} menit`;
  if (rest === 0) return `${h} jam`;
  return `${h} jam ${rest} menit`;
}

/** Cek tumpang tindih dua rentang waktu "HH:mm". */
export function timeOverlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Tanggal hari ini dalam format "YYYY-MM-DD" menurut zona WIB
 * (Asia/Jakarta) — bukan UTC server, supaya agenda "hari ini" tidak
 * meleset 7 jam (kejadian sebelum jam 07:00 WIB masih dihitung hari sebelumnya
 * kalau memakai toISOString).
 */
export function todayJakarta(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
