/**
 * Lapisan API Fasilitas & Pemesanan.
 *
 * Urutan sumber data (pola sama dengan konten lain):
 *   1. Strapi CMS — content type `facilities` (kalau sudah dibuat user).
 *   2. Data contoh statis di `src/data/facilities.ts` — fallback otomatis
 *      kalau CMS tidak terjangkau / content type belum dibuat / masih kosong.
 *
 * Pemesanan (booking) tetap disimpan di localStorage browser untuk
 * prototype (lihat `src/lib/bookings-client.ts`) — kalau nanti content
 * type `facility-bookings` dibuat di Strapi, pembacaannya bisa
 * dipindah ke sini tanpa mengubah komponen.
 */

import { strapiList, txt, num, pick, mediaUrl, arr, blocksToText, rowSlug } from "@/lib/strapi";
import type { StrapiRow } from "@/lib/strapi";
import type { Facility, FacilityCategory } from "@/types";
import { getAllFacilities, getFacilityBySlug } from "@/data/facilities";

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
