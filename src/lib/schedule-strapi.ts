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
import { strapiList, strapiSingle, num, pick, txt } from "@/lib/strapi";
import type { StrapiRow } from "@/lib/strapi";
import { timeToSlot, DAYS, type RawSchedule } from "@/lib/schedule";

const CT_SCHEDULE = ["schedules", "schedule", "jadwals"];

/** Single type tempat JSON jadwal utuh ditempel (Content-Type Builder: buat
 *  single type "Jadwal" + field JSON bernama `data`). */
const CT_SCHEDULE_JSON = ["jadwal", "jadwal-pelajaran", "schedule-json", "jadwal-json"];

/**
 * Normalkan JSON jadwal dari berbagai bentuk yang wajar menjadi RawSchedule.
 * Bentuk yang diterima:
 *   A. Persis seperti `src/data/schedule.json`:
 *        { classes: ["X A", ...], lessons: [[0,1,2,1,"TAHFIDZ",""], ...] }
 *      tuple = [indeksKelas, hari(1-5), jamKe(1-11), durasi, mapel, guru]
 *   B. { classes: [...], lessons: [{ class/kelas: "X A", day/hari, start/mulai,
 *      span/durasi, subject/mapel, teacher/guru }, ...] }
 *   C. Array per kelas: [{ class/kelas/nama: "X A", lessons/jadwal: [...] }, ...]
 * Mengembalikan null kalau bentuknya tidak dikenali / tidak valid.
 */
export function normalizeScheduleJson(input: unknown): RawSchedule | null {
  if (!input) return null;

  // Bentuk C: array per kelas — lewatkan ke rowToLessons (parser fleksibel).
  if (Array.isArray(input)) {
    const parsed: ParsedLesson[] = [];
    for (const r of input) {
      if (!r || typeof r !== "object") continue;
      parsed.push(...rowToLessons(r as StrapiRow));
    }
    return finalizeLessons(parsed);
  }

  if (typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;
  const classes = Array.isArray(obj.classes) ? obj.classes.map((c) => txt(c)).filter(Boolean) : null;
  const rawLessons = pick(obj, "lessons", "jadwal", "entries");
  if (!classes || !classes.length || !Array.isArray(rawLessons)) return null;

  const parsed: ParsedLesson[] = [];
  for (const item of rawLessons) {
    // A) tuple [indeks|namaKelas, hari, jamKe, durasi, mapel, guru]
    if (Array.isArray(item)) {
      const head = item[0];
      const className = typeof head === "string" ? head : classes[num(head, 0)];
      if (className === undefined) continue;
      const d = parseDay(item[1]);
      const st = parseStart(item[2]);
      const sp = Math.max(1, num(item[3], 1));
      const sj = txt(item[4]);
      if (d && st && sj) parsed.push({ className, day: d, start: st, span: sp, subject: sj, teacher: txt(item[5]) });
      continue;
    }
    // B) objek per pelajaran
    if (item && typeof item === "object") {
      const o = item as StrapiRow;
      const className = txt(pick(o, "class", "kelas", "className", "namaKelas")) || classes[num(pick(o, "classIndex", "indeksKelas"), -1)];
      const d = parseDay(pick(o, "day", "hari"));
      const st = parseStart(pick(o, "start", "mulai", "jamKe"));
      const sp = Math.max(1, num(pick(o, "span", "durasi", "lamaJam"), 1));
      const sj = txt(pick(o, "subject", "mapel", "pelajaran"));
      if (className && d && st && sj) {
        parsed.push({ className, day: d, start: st, span: sp, subject: sj, teacher: txt(pick(o, "teacher", "guru")) });
      }
    }
  }
  return finalizeLessons(parsed, classes);
}

/** Susun RawSchedule dari daftar pelajaran + daftar kelas (opsional). */
function finalizeLessons(parsed: ParsedLesson[], baseClasses?: string[]): RawSchedule | null {
  if (parsed.length === 0) return null;
  const seen = new Set<string>();
  const classes: string[] = [];
  const push = (name: string) => {
    const n = name.trim();
    if (n && !seen.has(n)) {
      seen.add(n);
      classes.push(n);
    }
  };
  for (const name of baseClasses ?? []) push(name);
  for (const p of parsed) push(p.className);
  classes.sort(classSort);
  const classIdx = new Map(classes.map((name, idx) => [name, idx]));
  const lessons = parsed
    .map(({ className, day, start, span, subject, teacher }) => {
      const idx = classIdx.get(className.trim());
      return idx === undefined ? null : ([idx, day, start, span, subject, teacher] as RawSchedule["lessons"][number]);
    })
    .filter((l): l is RawSchedule["lessons"][number] => l !== null && l[1] >= 1 && l[1] <= DAYS.length);
  if (lessons.length === 0) return null;
  return { classes, lessons };
}

/**
 * Sumber utama: single type `jadwal` dengan field JSON `data` berisi jadwal
 * utuh (bisa ditempel persis dari `src/data/schedule.json`).
 */
async function scheduleFromJsonSingle(revalidate: number): Promise<RawSchedule | null> {
  const row = await strapiSingle<StrapiRow>(CT_SCHEDULE_JSON, revalidate);
  if (!row) return null;
  const data = pick(row, "data", "jadwal", "json", "payload", "content");
  if (data === undefined || data === null) return null;
  try {
    const value = typeof data === "string" ? JSON.parse(data) : data;
    return normalizeScheduleJson(value);
  } catch {
    return null; // JSON tidak valid — biarkan jatuh ke sumber berikutnya
  }
}

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
  // 1) Utamakan single type `jadwal` berisi JSON utuh (paling praktis:
  //    satu tempel dari schedule.json).
  const fromJson = await scheduleFromJsonSingle(revalidate);
  if (fromJson) return fromJson;

  // 2) Cadangan: collection `schedules` (satu entri per pelajaran/kelas).
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
