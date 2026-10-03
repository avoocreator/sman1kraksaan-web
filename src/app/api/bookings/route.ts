/**
 * API route pemesanan fasilitas.
 *
 * GET  /api/bookings            → daftar pemesanan (proyeksi publik, tanpa kontak)
 *                                untuk pemeriksaan bentrok di form & jadwal.
 * GET  /api/bookings?kode=FSV…  → satu pemesanan (tanpa kontak) untuk cek status.
 * POST /api/bookings            → ajukan pemesanan baru → tersimpan di Strapi
 *                                (content type `facility-bookings`), status awal
 *                                "Menunggu" hingga disetujui admin di Strapi.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  BookingError, createBooking, getBookingByCode, getBookings, toPublicBooking,
} from "@/lib/api/fasilitas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const kode = req.nextUrl.searchParams.get("kode")?.trim();
  if (kode) {
    const booking = await getBookingByCode(kode);
    if (!booking) {
      return NextResponse.json({ error: "Kode pemesanan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ booking: toPublicBooking(booking) });
  }
  const bookings = await getBookings();
  return NextResponse.json({ bookings: bookings.map(toPublicBooking) });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Format pengajuan tidak valid." }, { status: 400 });
  }
  try {
    const booking = await createBooking((body ?? {}) as Record<string, never>);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (e) {
    const status = e instanceof BookingError ? e.status : 500;
    const message =
      e instanceof Error ? e.message : "Pengajuan gagal terkirim. Coba lagi atau hubungi Tata Usaha.";
    return NextResponse.json({ error: message }, { status });
  }
}
