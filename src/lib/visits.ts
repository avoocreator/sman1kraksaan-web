/**
 * Penghitung kunjungan situs (visitor counter) berbasis IP + interval istirahat.
 *
 * Mekanisme (sesuai keinginan admin):
 *   - Setiap pengunjung dikenali dari alamat IP-nya (di-hash, bukan disimpan
 *     mentah — lebih privat dan tetap bisa membedakan pengunjung).
 *   - Aktivitas apa pun (buka halaman mana pun) dalam rentang istirahat
 *     (60 menit) tetap dihitung SATU kunjungan.
 *   - Setelah tidak ada aktivitas ≥ 60 menit, kunjungan berikutnya dihitung
 *     kunjungan baru.
 *
 * Penyimpanan: Strapi content type `visit-logs` — satu entri = satu sesi
 * kunjungan (visitor = hash IP, startedAt, lastActiveAt). Total kunjungan =
 * jumlah seluruh entri (diambil dari meta.pagination.total — murah, tanpa
 * memuat semua baris). Karena ini butuh TULIS, dipakai STRAPI_WRITE_TOKEN
 * (lihat docs/STRAPI-INTEGRASI.md); kalau belum diisi, penghitung diam-diam
 * tidak aktif dan widget footer tidak tampil — situs tetap normal.
 */

import { createHash } from "node:crypto";

import type { StrapiRow } from "@/lib/strapi";

/** Rentang istirahat (menit): aktivitas dalam rentang ini = kunjungan yang sama. */
export const SESSION_MINUTES = 60;

function strapiBase(): string | undefined {
  return process.env.STRAPI_URL?.replace(/\/$/, "");
}

function readToken(): string | undefined {
  return process.env.STRAPI_TOKEN?.trim() || undefined;
}

function writeToken(): string | undefined {
  return process.env.STRAPI_WRITE_TOKEN?.trim() || process.env.STRAPI_TOKEN?.trim() || undefined;
}

/**
 * Hash IP agar tidak menyimpan alamat mentah. Garam tetap cukup untuk
 * keperluan ini (bukan data sensitif — hanya untuk membedakan pengunjung).
 */
export function hashVisitor(ip: string): string {
  const salt = process.env.VISIT_SALT?.trim() || "sman1kraksaan-visit-v1";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** IP klien dari header proxy (Vercel/Cloudflare) — IP pertama yang valid. */
export function clientIpFrom(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

function minutesBetween(iso: string, now: number): number {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return (now - t) / 60_000;
}

/**
 * Catat satu aktivitas kunjungan. Dipanggil API route /api/visit (POST).
 * Diam-diam no-op kalau Strapi tidak siap — penghitung bukan fitur kritis.
 */
export async function recordVisit(ip: string | null): Promise<void> {
  const BASE = strapiBase();
  const token = writeToken();
  if (!BASE || !token || !ip) return;
  const visitor = hashVisitor(ip);
  const nowIso = new Date().toISOString();

  try {
    // 1) Cari sesi aktif milik IP ini (lastActiveAt dalam rentang istirahat).
    const q = new URLSearchParams({
      "filters[visitor][$eq]": visitor,
      "sort[0]": "lastActiveAt:desc",
      "pagination[pageSize]": "1",
    });
    const res = await fetch(`${BASE}/api/visit-logs?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const json = (await res.json().catch(() => ({}))) as { data?: StrapiRow[] };
      const hit = json.data?.[0];
      const lastActive = txtOf(hit?.lastActiveAt) || txtOf(hit?.startedAt);
      if (hit?.documentId && lastActive && minutesBetween(lastActive, Date.now()) < SESSION_MINUTES) {
        // 2a) Sesi masih hidup — perbarui denyut aktivitasnya saja.
        await fetch(`${BASE}/api/visit-logs/${hit.documentId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ data: { lastActiveAt: nowIso } }),
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        return;
      }
    }

    // 2b) Belum ada sesi / sudah kedaluwarsa → kunjungan baru.
    await fetch(`${BASE}/api/visit-logs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { visitor, startedAt: nowIso, lastActiveAt: nowIso, publishedAt: nowIso },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Penghitung tidak boleh mengganggu situs — abaikan kegagalan.
  }
}

function txtOf(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Total kunjungan (jumlah semua sesi). null = belum tersedia
 * (CT visit-logs belum dibuat / Strapi down) → widget footer disembunyikan.
 * Hasil di-cache 5 menit supaya tidak membebani Strapi di setiap render.
 */
export async function getTotalVisits(): Promise<number | null> {
  const BASE = strapiBase();
  const token = readToken() ?? writeToken();
  if (!BASE || !token) return null;
  try {
    const res = await fetch(`${BASE}/api/visit-logs?pagination[pageSize]=1`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = (await res.json().catch(() => ({}))) as {
      meta?: { pagination?: { total?: number } };
    };
    const total = json.meta?.pagination?.total;
    return typeof total === "number" ? total : null;
  } catch {
    return null;
  }
}
