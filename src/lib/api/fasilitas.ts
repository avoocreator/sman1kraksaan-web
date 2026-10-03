/**
 * Lapisan API Fasilitas & Pemesanan.
 *
 * Urutan sumber data (pola sama dengan konten lain):
 *   1. Strapi CMS — content type `facilities` + `facility-bookings`
 *      (kalau sudah dibuat user).
 *   2. Data contoh statis di `src/data/facilities.ts` / `src/data/bookings.ts`
 *      — fallback otomatis HANYA untuk pembacaan, kalau CMS tidak terjangkau.
 *
 * Pemesanan kini BENAR-BENAR tersimpan di Strapi (bukan lagi localStorage):
 *   - Pengajuan dari form → POST /api/bookings → createBooking() di sini.
 *   - Admin menyetujui/menolak lewat Strapi Content Manager (edit field
 *     `status` pada entri). Tidak ada lagi dashboard admin di situs.
 *   - Situs membaca ulang status (revalidate 60 detik).
 */

import { randomBytes } from "node:crypto";
import { strapiList, txt, num, pick, mediaUrl, arr, blocksToText, rowSlug, dateOnly } from "@/lib/strapi";
import type { StrapiRow } from "@/lib/strapi";
import type { Facility, FacilityCategory, FacilityBooking, BookingStatus, RequesterType } from "@/types";
import { getAllFacilities, getFacilityBySlug } from "@/data/facilities";
import { seedBookings } from "@/data/bookings";
import { timeOverlaps } from "@/lib/utils";

const CT_FASILITAS = ["facilities", "fasilitas", "facility"];
const REVALIDATE = 60;

const CATEGORIES: FacilityCategory[] = [
  "Aula & Serbaguna",
  "Laboratorium",
  "Olahraga & Lapangan",
  "Seni & Ekstrakurikuler",
  "Perpustakaan",
  "Ruang Rapat",
];

function normCategory(v: unknown, name: string): FacilityCategory {
  const s = txt(v).toLowerCase();
  if (s) {
    const found = CATEGORIES.find((c) => s === c.toLowerCase() || s.includes(c.toLowerCase().split(" ")[0]));
    if (found) return found;
  }
  // Tebak dari nama kalau field kategori tidak ada (mis. "Lab Komputer").
  const n = name.toLowerCase();
  if (n.includes("lab")) return "Laboratorium";
  if (n.includes("aula") || n.includes("serbaguna") || n.includes("lapangan")) return "Aula & Serbaguna";
  if (n.includes("perpustakaan")) return "Perpustakaan";
  if (n.includes("ruang") && (n.includes("rapat") || n.includes("meeting"))) return "Ruang Rapat";
  return "Seni & Ekstrakurikuler";
}

function mapFacility(r: StrapiRow): Facility {
  const name = txt(pick(r, "name", "nama", "title", "judul")) || "Fasilitas";
  const image = mediaUrl(pick(r, "image", "gambar", "foto", "photo", "media")) ?? "";
  return {
    slug: rowSlug(r),
    name,
    category: normCategory(pick(r, "category", "kategori", "jenis"), name),
    shortDescription: blocksToText(pick(r, "shortDescription", "short_description", "ringkasan"), 120) ||
      blocksToText(pick(r, "description", "deskripsi", "keterangan"), 110),
    description: blocksToText(pick(r, "description", "deskripsi", "keterangan"), 900),
    image,
    capacity: num(pick(r, "capacity", "kapasitas"), 0),
    location: txt(pick(r, "location", "lokasi", "tempat", "gedung")) || "-",
    amenities: arr(pick(r, "amenities", "fasilitas", "sarana", "fitur")),
    openTime: txt(pick(r, "openTime", "open_time", "jamBuka", "jam_buka")) || "07:00",
    closeTime: txt(pick(r, "closeTime", "close_time", "jamTutup", "jam_tutup")) || "21:00",
    pic: txt(pick(r, "pic", "penanggungJawab", "penanggung_jawab", "contact")) || "-",
    note: txt(pick(r, "note", "catatan")) || undefined,
  };
}

/** Semua fasilitas: Strapi dulu, fallback data statis bawaan. */
export async function getFacilities(): Promise<Facility[]> {
  const rows = await strapiList(CT_FASILITAS, REVALIDATE);
  if (rows === null || rows.length === 0) return getAllFacilities();
  return rows.map(mapFacility);
}

/** Satu fasilitas berdasarkan slug (atau documentId Strapi). */
export async function getFacility(slug: string): Promise<Facility | undefined> {
  const all = await getFacilities();
  return all.find((f) => f.slug === slug) ?? getFacilityBySlug(slug);
}

/* ------------------------------------------------------------------ */
/* PEMESANAN FASILITAS (Strapi content type `facility-bookings`)       */
/* ------------------------------------------------------------------ */

/** Kandidat plural endpoint CT pemesanan (label admin bisa "Fasility-booking"). */
const CT_BOOKING = [
  "facility-bookings", "fasility-bookings", "fasilitas-bookings",
  "bookings", "pesanan-fasilitas", "pesan-fasilitas",
];

const REQUESTER_TYPES: RequesterType[] = ["Siswa", "Guru", "Ekstrakurikuler", "Organisasi", "Umum"];

/** Normalisasi status dari Strapi (enum/text bebas) → BookingStatus. */
function normBookingStatus(v: unknown): BookingStatus {
  const s = txt(v).toLowerCase();
  if (!s) return "Menunggu";
  if (s.includes("setuju") || s.includes("approve")) return "Disetujui";
  if (s.includes("tolak") || s.includes("reject") || s.includes("batal")) return "Ditolak";
  if (s.includes("selesai") || s.includes("done")) return "Selesai";
  return "Menunggu";
}

function normRequesterType(v: unknown): RequesterType {
  const s = txt(v).toLowerCase();
  return REQUESTER_TYPES.find((t) => s === t.toLowerCase() || s.includes(t.toLowerCase())) ?? "Umum";
}

/** Baris Strapi → FacilityBooking. `withContact` untuk lookup per-kode (pemilik kode). */
function mapBooking(r: StrapiRow, withContact: boolean): FacilityBooking {
  const facilityName =
    txt(pick(r, "facility", "facilityName", "facility_name", "namaFasilitas", "nama_fasilitas", "fasilitas")) || "-";
  const facilitySlug =
    txt(pick(r, "facilitySlug", "facility_slug")) ||
    getAllFacilities().find((f) => f.name.toLowerCase() === facilityName.toLowerCase())?.slug ||
    "";
  const code = txt(pick(r, "bookingCode", "booking_code", "kode", "kodePemesanan", "kode_pemesanan", "code"));

  const booking: FacilityBooking = {
    id: code || (r.documentId ?? String(r.id ?? "")),
    facilitySlug,
    facilityName,
    requesterName: txt(pick(r, "requesterName", "requester_name", "namaPemesan", "nama_pemesan", "nama", "name")) || "-",
    requesterType: normRequesterType(pick(r, "requesterType", "requester_type", "kategoriPemesan", "kategori", "jenis")),
    organization: txt(pick(r, "organization", "organisation", "organisasi", "instansi", "kelas")) || "-",
    contact: withContact ? txt(pick(r, "contact", "kontak", "hp", "whatsapp", "telepon", "email")) : "",
    date: dateOnly(pick(r, "date", "tanggal"), todayIsoJakarta()),
    startTime: txt(pick(r, "startTime", "start_time", "jamMulai", "jam_mulai", "mulai", "start")) || "07:00",
    endTime: txt(pick(r, "endTime", "end_time", "jamSelesai", "jam_selesai", "selesai", "end")) || "21:00",
    participants: num(pick(r, "participants", "participant", "jumlahPeserta", "jumlah_peserta", "peserta"), 0),
    purpose: blocksToText(pick(r, "purpose", "keperluan", "tujuan", "keterangan"), 500),
    status: normBookingStatus(pick(r, "bookingStatus", "status", "statusPemesanan", "status_pemesanan")),
    adminNote: txt(pick(r, "adminNote", "admin_note", "catatanAdmin", "catatan_admin", "catatan")) || undefined,
    createdAt: txt(pick(r, "createdAt", "tanggalPengajuan", "dibuat")) || new Date().toISOString(),
  };
  return booking;
}

/** ISO "YYYY-MM-DD" hari ini mengikuti WIB (UTC+7), bukan zona server. */
function todayIsoJakarta(): string {
  return new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
}

/** Proyeksi publik: sembunyikan kontak pemesan (hanya admin yang perlu). */
export function toPublicBooking(b: FacilityBooking): FacilityBooking {
  return { ...b, contact: "" };
}

/**
 * Semua pemesanan dari Strapi (termasuk kontak — JANGAN dikirim mentah ke
 * komponen publik; pakai toPublicBooking). null → CMS tidak terjangkau.
 */
export async function getBookingsRaw(): Promise<FacilityBooking[] | null> {
  const rows = await strapiList(CT_BOOKING, 0); // 0 = tanpa cache: pengajuan baru langsung terbaca
  if (rows === null) return null;
  return rows.map((r) => mapBooking(r, true)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Pemesanan untuk tampilan publik/jadwal: CMS dulu, data contoh saat CMS down. */
export async function getBookings(): Promise<FacilityBooking[]> {
  const raw = await getBookingsRaw();
  return raw ?? seedBookings.map((b) => ({ ...b }));
}

/** Cari satu pemesanan berdasarkan kode (untuk halaman cek status). */
export async function getBookingByCode(code: string): Promise<FacilityBooking | undefined> {
  const target = code.trim().toLowerCase();
  const raw = await getBookingsRaw();
  const list = raw ?? seedBookings;
  return list.find((b) => b.id.toLowerCase() === target);
}

/* --- pengajuan baru (dipanggil API route /api/bookings) ------------- */

/** 6 karakter acak (tanpa 0/O/1/I) — kode tidak bisa ditebak dan tidak bentrok antar entri. */
function randomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(randomBytes(6), (b) => chars[b % chars.length]).join("");
}

export class BookingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Token dengan izin TULIS; opsional — tanpa ini pengajuan gagal jelas, bukan diam-diam. */
function writeToken(): string | undefined {
  return process.env.STRAPI_WRITE_TOKEN?.trim() || process.env.STRAPI_TOKEN?.trim() || undefined;
}

async function strapiWrite(path: string, method: "POST" | "PUT", body: unknown): Promise<StrapiRow> {
  const BASE = process.env.STRAPI_URL?.replace(/\/$/, "");
  const token = writeToken();
  if (!BASE) throw new BookingError("Server belum terhubung ke Strapi (STRAPI_URL kosong).", 503);
  if (!token) {
    throw new BookingError(
      "Server belum punya token tulis. Buat API Token Custom di Strapi (izin create untuk Fasility-booking) lalu isi STRAPI_WRITE_TOKEN.",
      503,
    );
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
  } catch {
    throw new BookingError("Tidak dapat menjangkau server Strapi. Coba lagi sebentar.", 502);
  }
  const json = (await res.json().catch(() => ({}))) as { data?: StrapiRow; error?: { message?: string } };
  if (!res.ok) {
    const detail = json.error?.message ? ` (${json.error.message})` : "";
    if (res.status === 401 || res.status === 403) {
      throw new BookingError(
        `Strapi menolak pengajuan${detail} — pastikan STRAPI_WRITE_TOKEN diisi dengan API Token yang punya izin create pada Fasility-booking.`,
        502,
      );
    }
    throw new BookingError(`Strapi menolak pengajuan${detail}`, 400);
  }
  if (!json.data) throw new BookingError("Respons Strapi tidak dikenali.", 502);
  return json.data;
}

export interface BookingInput {
  facilitySlug?: string;
  requesterName?: string;
  requesterType?: string;
  organization?: string;
  contact?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  participants?: number | string;
  purpose?: string;
}

/**
 * Validasi + simpan pengajuan pemesanan ke Strapi.
 * Melempar BookingError dengan pesan siap-tampilkan kalau data tidak valid.
 */
export async function createBooking(input: BookingInput): Promise<FacilityBooking> {
  const facility = getAllFacilities().find((f) => f.slug === input.facilitySlug);
  const name = txt(input.requesterName);
  const organization = txt(input.organization);
  const contact = txt(input.contact);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(txt(input.date)) ? txt(input.date) : "";
  const startTime = /^\d{2}:\d{2}$/.test(txt(input.startTime)) ? txt(input.startTime) : "";
  const endTime = /^\d{2}:\d{2}$/.test(txt(input.endTime)) ? txt(input.endTime) : "";
  const participants = num(input.participants, 0);
  const purpose = txt(input.purpose);

  if (!facility) throw new BookingError("Fasilitas tidak dikenali.");
  if (!name) throw new BookingError("Nama pemesan wajib diisi.");
  if (!organization) throw new BookingError("Kelas / ekstrakurikuler / instansi wajib diisi.");
  if (!contact) throw new BookingError("Nomor HP atau email wajib diisi.");
  if (!date) throw new BookingError("Tanggal pemesanan wajib dipilih.");
  if (!startTime || !endTime) throw new BookingError("Isi jam mulai dan jam selesai pemesanan.");
  if (startTime >= endTime) throw new BookingError("Jam selesai harus lebih besar dari jam mulai.");
  if (startTime < facility.openTime || endTime > facility.closeTime)
    throw new BookingError(
      `${facility.name} hanya bisa dipesan antara ${facility.openTime}–${facility.closeTime} WIB.`,
    );
  if (participants < 1) throw new BookingError("Jumlah peserta minimal 1 orang.");
  if (participants > facility.capacity)
    throw new BookingError(`Kapasitas maksimal ${facility.name} adalah ${facility.capacity} orang.`);
  if (!purpose) throw new BookingError("Tuliskan keperluan pemesanan.");

  // Bentrokan dengan pemesanan yang SUDAH DISETUJUI ditolak di sisi server —
  // jangan bergantung pada pemeriksaan di browser saja.
  const existing = await getBookings();
  const clash = existing.find(
    (b) =>
      b.facilitySlug === facility.slug &&
      b.date === date &&
      b.status === "Disetujui" &&
      timeOverlaps(startTime, endTime, b.startTime, b.endTime),
  );
  if (clash)
    throw new BookingError(
      `Jadwal bertabrakan dengan pemesanan yang sudah disetujui (${clash.startTime}–${clash.endTime} WIB). Silakan pilih jam lain.`,
      409,
    );

  const year = todayIsoJakarta().slice(0, 4);
  let booking: FacilityBooking | null = null;
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3 && !booking; attempt++) {
    const code = `FSV-${year}-${randomCode()}`;
    const fields: Record<string, unknown> = {
      bookingCode: code,
      facilitySlug: facility.slug,
      facility: facility.name,
      facilityName: facility.name,
      requesterName: name,
      requesterType: normRequesterType(input.requesterType),
      organization,
      contact,
      date,
      startTime,
      endTime,
      participants,
      purpose,
      adminNote: "",
    };
    // Percobaan bertingkat: (1) lengkap + status + publish, (2) tanpa
    // publish, (3) field inti saja — supaya tetap jalan di CT dengan
    // Draft&Publish aktif maupun tanpa field status.
    const attempts: Record<string, unknown>[] = [
      { ...fields, bookingStatus: "Menunggu", publishedAt: new Date().toISOString() },
      { ...fields, bookingStatus: "Menunggu" },
      { ...fields },
    ];
    try {
      await strapiWrite("facility-bookings", "POST", { data: attempts[attempt] });
      booking = {
        id: code,
        facilitySlug: facility.slug,
        facilityName: facility.name,
        requesterName: name,
        requesterType: normRequesterType(input.requesterType),
        organization,
        contact,
        date,
        startTime,
        endTime,
        participants,
        purpose,
        status: "Menunggu",
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      lastError = e;
      // Konflik jadwal / validasi input tidak perlu dicoba ulang.
      if (e instanceof BookingError && (e.status === 409 || e.status < 400)) throw e;
    }
  }
  if (!booking) {
    if (lastError instanceof BookingError) throw lastError;
    throw new BookingError("Pengajuan gagal terkirim. Coba lagi atau hubungi Tata Usaha.", 502);
  }
  return booking;
}
