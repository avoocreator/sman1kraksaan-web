
import { randomBytes } from "node:crypto";
import { strapiList, txt, num, pick, mediaUrl, arr, blocksToText, rowSlug, dateOnly } from "@/lib/strapi";
import type { StrapiRow } from "@/lib/strapi";
import type { Facility, FacilityBooking, BookingStatus, RequesterType } from "@/types";
import { getAllFacilities, getFacilityBySlug } from "@/data/facilities";
import { seedBookings } from "@/data/bookings";
import { timeOverlaps } from "@/lib/utils";
import { normCategory } from "@/lib/facility-categories";

const CT_FASILITAS = ["facilities", "fasilitas", "facility"];
const REVALIDATE = 60;

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

export async function getFacilities(): Promise<Facility[]> {
  const rows = await strapiList(CT_FASILITAS, REVALIDATE);
  if (rows === null || rows.length === 0) return getAllFacilities();
  return rows.map(mapFacility);
}

export async function getFacility(slug: string): Promise<Facility | undefined> {
  const all = await getFacilities();
  return all.find((f) => f.slug === slug) ?? getFacilityBySlug(slug);
}

const CT_BOOKING = [
  "facility-bookings", "fasility-bookings", "fasilitas-bookings",
  "bookings", "pesanan-fasilitas", "pesan-fasilitas",
];

const REQUESTER_TYPES: RequesterType[] = ["Siswa", "Guru", "Ekstrakurikuler", "Organisasi", "Umum"];

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

function todayIsoJakarta(): string {
  return new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
}

export function toPublicBooking(b: FacilityBooking): FacilityBooking {
  return { ...b, contact: "" };
}

export async function getBookingsRaw(fresh = false): Promise<FacilityBooking[] | null> {
  const rows = await strapiList(CT_BOOKING, fresh ? 0 : 15, "&sort=createdAt:desc");
  if (rows === null) return null;
  return rows.map((r) => mapBooking(r, true)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getBookings(fresh = false): Promise<FacilityBooking[]> {
  const raw = await getBookingsRaw(fresh);
  return raw ?? seedBookings.map((b) => ({ ...b }));
}

export async function getBookingByCode(code: string): Promise<FacilityBooking | undefined> {
  const target = code.trim().toLowerCase();
  const find = (l: FacilityBooking[]) => l.find((b) => b.id.toLowerCase() === target);
  const cached = find((await getBookingsRaw()) ?? seedBookings);
  if (cached) return cached;
  const raw = await getBookingsRaw(true);
  return raw ? find(raw) : undefined;
}

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

export async function createBooking(input: BookingInput): Promise<FacilityBooking> {
  const facility = (await getFacility(txt(input.facilitySlug))) ?? getAllFacilities().find((f) => f.slug === input.facilitySlug);
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

  const existing = await getBookings(true);
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
      if (e instanceof BookingError && (e.status === 409 || e.status < 400)) throw e;
    }
  }
  if (!booking) {
    if (lastError instanceof BookingError) throw lastError;
    throw new BookingError("Pengajuan gagal terkirim. Coba lagi atau hubungi Tata Usaha.", 502);
  }
  return booking;
}
