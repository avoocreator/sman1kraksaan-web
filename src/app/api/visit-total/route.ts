/**
 * Total kunjungan TANPA cache — dipakai footer (client) untuk menyegarkan
 * angka begitu halaman terbuka (angka dari layout ter-cache ISR 5 menit di
 * Vercel, sehingga bisa basi beberapa menit).
 *
 * GET /api/visit-total → { "total": <number> }
 */
import { NextResponse } from "next/server";

import { getTotalVisits } from "@/lib/visits";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cache di memori 20 dtk per instance: berapa pun pengunjungnya, Strapi
// hanya ditanya ~3x/menit (footer polling tiap 60 dtk per tab).
// ponytail: per instance; kalau banyak instance, naikkan TTL atau pakai cache bersama.
const TTL_MS = 20_000;
let cached: { total: number | null; at: number } | null = null;
let inflight: Promise<number | null> | null = null;

async function totalCached(): Promise<number | null> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.total;
  inflight ??= getTotalVisits({ fresh: true })
    .then((total) => {
      // Jangan simpan kegagalan (null): coba lagi di permintaan berikutnya.
      cached = total === null ? null : { total, at: Date.now() };
      return total;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function GET() {
  const total = await totalCached();
  return NextResponse.json(
    { total: typeof total === "number" ? total : 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
