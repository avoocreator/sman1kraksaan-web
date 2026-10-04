
import type { FacilityCategory } from "@/types";

export const FACILITY_CATEGORIES: FacilityCategory[] = [
  "Aula & Serbaguna",
  "Laboratorium",
  "Olahraga & Lapangan",
  "Seni & Ekstrakurikuler",
  "Perpustakaan",
  "Ruang Rapat",
  "Fasilitas Ibadah",
  "Ruang Penunjang",
];

// urutan prioritas
const KEYWORDS: [FacilityCategory, string[]][] = [
  ["Fasilitas Ibadah", ["mushola", "musala", "masjid", "surau", "ibadah", "sholat", "salat"]],
  ["Laboratorium", ["laboratorium", "lab"]],
  ["Olahraga & Lapangan", ["olahraga", "lapangan", "futsal", "basket", "voli", "bulutangkis", "bulu tangkis", "atletik", "gym", "sport"]],
  ["Ruang Rapat", ["rapat", "pertemuan", "meeting"]],
  ["Perpustakaan", ["perpustakaan", "pustaka", "library"]],
  ["Aula & Serbaguna", ["aula", "serbaguna", "auditorium", "pendopo"]],
  ["Ruang Penunjang", ["tataboga", "tata boga", "dapur", "kantin", "koperasi", "penunjang", "gudang"]],
  ["Seni & Ekstrakurikuler", ["seni", "musik", "tari", "galeri", "lukis", "ekskul", "ekstrakurikuler", "ekstrakulikuler", "pramuka", "paskibra"]],
];

function includesAny(hay: string, words: string[]): boolean {
  return words.some((w) => hay.includes(w));
}

function match(hay: string): FacilityCategory | undefined {
  for (const [category, words] of KEYWORDS) {
    if (includesAny(hay, words)) return category;
  }
  return undefined;
}

export function normCategory(v: unknown, name: string): FacilityCategory {
  const n = name.toLowerCase().trim();
  const cat = typeof v === "string" ? v.toLowerCase().trim() : "";
  const usable = cat.length > 0 && cat !== n;
  if (usable) {
    const hit = match(cat);
    if (hit) return hit;
  }
  return match(n) ?? "Seni & Ekstrakurikuler";
}
