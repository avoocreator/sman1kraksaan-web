/**
 * API route penghitung kunjungan.
 *
 * POST /api/visit — dipanggil client (VisitTracker) setiap kali halaman
 * dibuka. Server mengenali pengunjung dari IP (x-forwarded-for), lalu:
 *   - sesi masih hidup (aktivitas < 60 menit) → perbarui denyutnya saja;
 *   - selain itu → catat kunjungan baru.
 * Respons selalu 204 agar gagal/berhasil tidak perlu ditangani di client.
 */
import { NextRequest, NextResponse } from "next/server";
import { clientIpFrom, recordVisit } from "@/lib/visits";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = clientIpFrom(req.headers);
  await recordVisit(ip);
  return new NextResponse(null, { status: 204 });
}
