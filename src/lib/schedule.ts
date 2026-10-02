import rawStatic from "@/data/schedule.json";
import type { ClassInfo, Entry, Lesson } from "@/types/schedule";

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const t = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

export const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}.${String(m % 60).padStart(2, "0")}`;

// Jam pelajaran ke-1 sampai 11 (istirahat & ishoma disisipkan terpisah)
export const SLOTS = [
  ["7:00", "7:40"], ["7:40", "8:20"], ["8:20", "9:00"], ["9:00", "9:40"],
  ["9:55", "10:35"], ["10:35", "11:15"], ["11:15", "11:55"],
  ["12:40", "13:20"], ["13:20", "13:55"], ["13:55", "14:30"], ["14:30", "15:05"],
].map(([a, b]) => ({ from: t(a), to: t(b) }));

/** "07.20" / "7:20" -> nomor slot jam ke- (1-11). null kalau di luar jam sekolah. */
export function timeToSlot(time: string): number | null {
  const match = time.match(/(\d{1,2})[.:](\d{2})/);
  if (!match) return null;
  const min = Number(match[1]) * 60 + Number(match[2]);
  const idx = SLOTS.findIndex((s) => min >= s.from && min < s.to);
  return idx >= 0 ? idx + 1 : null;
}

// Jeda yang muncul setelah jam ke-4 dan ke-7
const BREAKS: Record<number, { label: string; from: number; to: number }> = {
  4: { label: "Istirahat", from: t("9:40"), to: t("9:55") },
  7: { label: "Ishoma", from: t("11:55"), to: t("12:40") },
};

const segEnd = (s: number) => (s <= 4 ? 4 : s <= 7 ? 7 : 11);

const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

/** Dataset jadwal mentah yang bisa di-serialize antara server dan client. */
export type RawSchedule = {
  classes: string[];
  lessons: [number, number, number, number, string, string][];
};

/** Deretan fungsi & data jadwal yang dipakai komponen via useSchedule(). */
export type Schedule = {
  classes: ClassInfo[];
  lessons: Lesson[];
  teachers: { code: string; name: string }[];
  DAYS: string[];
  fmt: (m: number) => string;
  subjectInfo: (code: string) => { name: string; hue: number; neutral: boolean };
  teacherName: (code: string) => string;
  teacherHours: (code: string) => number;
  dayEntries: (filter: { classIdx?: number; teacher?: string }, day: number) => Entry[];
  scheduleDay: (now: { day: number } | null) => number;
};

// Nama mapel & warna. Cek ulang JEP, BJ, KKA dan TL dengan pihak sekolah.
const SUBJECTS: Record<string, [string, number]> = {
  MTK: ["Matematika", 220], FIS: ["Fisika", 250], KIM: ["Kimia", 280],
  BIO: ["Biologi", 140], BIN: ["Bahasa Indonesia", 355], BIG: ["Bahasa Inggris", 22],
  SEJ: ["Sejarah", 38], GEO: ["Geografi", 90], EKO: ["Ekonomi", 175],
  SOS: ["Sosiologi", 320], PAI: ["Pendidikan Agama Islam", 120],
  PP: ["Pendidikan Pancasila", 0], PJOK: ["PJOK", 195], INF: ["Informatika", 265],
  SB: ["Seni Budaya", 330], BK: ["Bimbingan Konseling", 60],
  KKA: ["Koding dan Kecerdasan Artifisial", 205], JEP: ["Bahasa Jepang", 10],
  BJ: ["Bahasa Jawa", 75], TAHFIDZ: ["Tahfidz", 150], PEMB: ["Pembiasaan & Adiwiyata", 150],
};

export function subjectInfo(code: string) {
  const tl = code.endsWith("-TL");
  const base = tl ? code.slice(0, -3) : code;
  const [name, hue] = SUBJECTS[base] ?? [base, 210];
  return {
    name: tl ? `${name} Tingkat Lanjut` : name,
    hue,
    neutral: base === "PEMB" || base === "TAHFIDZ",
  };
}

export const teacherName = (code: string) =>
  code.replace(/^B\./, "Bu ").replace(/^P\./, "Pak ");

export function wibNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, min: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

// Akhir pekan ditampilkan sebagai Senin
export const scheduleDay = (now: { day: number } | null) =>
  now && now.day >= 1 && now.day <= 5 ? now.day : 1;

/** Bangun instance jadwal lengkap dari dataset mentah (Strapi atau JSON statis). */
export function buildSchedule(raw: RawSchedule): Schedule {
  const classes: ClassInfo[] = (raw.classes ?? []).map((name, idx) => {
    const [level, ...rest] = name.split(" ");
    const short = rest.map(title).join(" ");
    return { idx, name, level: level as ClassInfo["level"], short, label: `${level} ${short}` };
  });

  const lessons: Lesson[] = (raw.lessons ?? []).map(([classIdx, day, start, span, subject, teacher]) => ({
    classIdx, day, start, span, subject, teacher,
  }));

  const teachers = Array.from(new Set(lessons.map((l) => l.teacher).filter(Boolean)))
    .map((code) => ({ code, name: teacherName(code) }))
    .sort((a, b) => a.name.localeCompare(b.name, "id"));

  const teacherHours = (code: string) =>
    lessons.filter((l) => l.teacher === code).reduce((n, l) => n + l.span, 0);

  function dayEntries(filter: { classIdx?: number; teacher?: string }, day: number): Entry[] {
    const ls = lessons
      .filter(
        (l) =>
          l.day === day &&
          (filter.classIdx === undefined || l.classIdx === filter.classIdx) &&
          (filter.teacher === undefined || l.teacher === filter.teacher),
      )
      .sort((a, b) => a.start - b.start);
    if (ls.length === 0) return [];

    const byStart = new Map(ls.map((l) => [l.start, l]));
    const last = Math.max(...ls.map((l) => l.start + l.span - 1));
    const out: Entry[] = [];
    let s = ls[0].start;

    while (s <= last) {
      const l = byStart.get(s);
      let end: number;
      if (l) {
        end = l.start + l.span - 1;
        out.push({ kind: "lesson", lesson: l, from: SLOTS[s - 1].from, to: SLOTS[end - 1].to });
      } else {
        end = s;
        while (end + 1 <= last && !byStart.has(end + 1) && end + 1 <= segEnd(s)) end++;
        out.push({ kind: "gap", count: end - s + 1, from: SLOTS[s - 1].from, to: SLOTS[end - 1].to });
      }
      s = end + 1;
      if (BREAKS[end] && s <= last) out.push({ kind: "break", ...BREAKS[end] });
    }
    return out;
  }

  return {
    classes, lessons, teachers, DAYS, fmt, subjectInfo, teacherName, teacherHours, dayEntries, scheduleDay,
  };
}

/** Jadwal bawaan: JSON statis di repo (fallback kalau Strapi kosong). */
export const staticSchedule = buildSchedule(rawStatic as unknown as RawSchedule);
