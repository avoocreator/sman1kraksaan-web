/**
 * Ambil jadwal pelajaran dari Strapi content type `schedules` dan ubah
 * menjadi dataset mentah yang bisa dipakai buildSchedule().
 *
 * Dua bentuk data didukung (beda baris/kolom dipilih otomatis):
 *   1. Satu entri per pelajaran:  { class/kelas, day/hari, start/mulai,
 *      span/durasi, subject/mapel, teacher/guru }
 *   2. Satu entri per kelas:      { class/kelas, lessons/jadwal: [ ... ] }
 *      dengan isi array { day, start, span, subject, teacher }.
 *
 * Kalau Strapi tidak terjangkau atau masih kosong, fungsi mengembalikan
 * null → pemanggil memakai jadwal JSON statis di `src/data/schedule.json`.
 */
import { strapiList, num, pick, txt } from "@/lib/strapi";
import type { StrapiRow } from "@/lib/strapi";
import { timeToSlot, DAYS, type RawSchedule } from "@/lib/schedule";

const CT_SCHEDULE = ["schedules", "schedule", "jadwals"];

/** "Senin"/"sen" -> 1..5. Angka 1-5 dipakai langsung, 0-4 dianggap 0=Senin. */
function parseDay(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) {
    if (v >= 1 && v <= 5) return v;
    if (v >= 0 && v <= 4) return v + 1;
    return null; // Minggu/Sabtu: tidak ada KBM
  }
  const s = txt(v).toLowerCase();
  if (!s) return null;
  const names = ["senin", "selasa", "rabu", "kamis", "jumat"];
  const shorts = ["sen", "sel", "rab", "kam", "jum"];
  const byName = names.findIndex((n) => s.includes(n));
  if (byName >= 0) return byName + 1;
  const byShort = shorts.findIndex((n) => s === n);
  if (byShort >= 0) return byShort + 1;
  const asNum = num(s, 0);
  return parseDay(asNum);
}

/** Nilai `start` bisa berupa nomor jam (1-11) atau teks jam "07.00". */
function parseStart(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) {
    if (v >= 1 && v <= 11) return v;
    if (v >= 0 && v <= 10) return v + 1;
    return null;
  }
  const s = txt(v);
  if (!s) return null;
  const slot = timeToSlot(s);
  if (slot) return slot;
  const asNum = num(s, 0);
  return parseStart(asNum);
}

type ParsedLesson = { className: string; day: number; start: number; span: number; subject: string; teacher: string };

function rowToLessons(r: StrapiRow): ParsedLesson[] {
  const className = txt(pick(r, "class", "kelas", "className", "namaKelas", "name", "nama", "title", "judul"));
  const subject = txt(pick(r, "subject", "mapel", "mataPelajaran", "pelajaran", "subjectName"));
  const teacher = txt(pick(r, "teacher", "guru", "pengajar", "teacherName", "guruPengajar"));
  const day = parseDay(pick(r, "day", "hari"));
  const start = parseStart(pick(r, "start", "mulai", "startSlot", "jamKe", "jamMulai"));
  const span = Math.max(1, num(pick(r, "span", "durasi", "jumlahJam", "lamaJam", "length"), 1));

  // Bentuk 2: entri berisi array pelajaran untuk satu kelas
  const listJson = pick<unknown[]>(r, "lessons", "jadwal", "entries", "blocks", "data");
  if (Array.isArray(listJson) && listJson.length) {
    const out: ParsedLesson[] = [];
    for (const item of listJson) {
      if (!item || typeof item !== "object") continue;
      const o = item as StrapiRow;
      const d = parseDay(pick(o, "day", "hari"));
      const st = parseStart(pick(o, "start", "mulai", "startSlot", "jamKe", "jamMulai"));
      const sp = Math.max(1, num(pick(o, "span", "durasi", "jumlahJam", "lamaJam"), 1));
      const sj = txt(pick(o, "subject", "mapel", "mataPelajaran", "pelajaran"));
      const gr = txt(pick(o, "teacher", "guru", "pengajar"));
      if (d && st && sj) out.push({ className, day: d, start: st, span: sp, subject: sj, teacher: gr });
    }
    if (out.length) return out;
  }

  // Bentuk 1: satu baris = satu pelajaran
  if (day && start && subject) {
    return [{ className: className || "?", day, start, span, subject, teacher }];
  }
  return [];
}

const classSort = (a: string, b: string) => {
  const levelOrder = (n: string) => (n.startsWith("XII") ? 3 : n.startsWith("XI") ? 2 : n.startsWith("X ") || n === "X" ? 1 : 0);
  const d = levelOrder(a) - levelOrder(b);
  return d !== 0 ? d : a.localeCompare(b, "id", { numeric: true });
};

export async function getScheduleRaw(revalidate = 60): Promise<RawSchedule | null> {
  const rows = await strapiList(CT_SCHEDULE, revalidate);
  if (!rows || rows.length === 0) return null;

  const parsed: ParsedLesson[] = [];
  const extraClasses: string[] = [];
  for (const r of rows) parsed.push(...rowToLessons(r));
  if (parsed.length === 0) return null;

  // Kumpulkan daftar kelas dari Strapi; urutkan per tingkat.
  const seen = new Set<string>();
  for (const p of parsed) {
    const name = p.className.trim();
    if (name && !seen.has(name)) {
      seen.add(name);
      extraClasses.push(name);
    }
  }
  extraClasses.sort(classSort);

  const classIdx = new Map(extraClasses.map((name, idx) => [name, idx]));
  const lessons: RawSchedule["lessons"] = parsed
    .map(({ className, day, start, span, subject, teacher }) => {
      const idx = classIdx.get(className.trim()) ?? 0;
      return [idx, day, start, span, subject, teacher] as RawSchedule["lessons"][number];
    })
    .filter(([idx, day]) => idx >= 0 && day >= 1 && day <= DAYS.length);

  return { classes: extraClasses, lessons };
}
