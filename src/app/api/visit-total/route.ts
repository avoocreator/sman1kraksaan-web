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

export async function GET() {
  const total = await getTotalVisits({ fresh: true });
  return NextResponse.json(
    { total: typeof total === "number" ? total : 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
