/**
 * E2E: (1) normalizeScheduleJson vs schedule.json asli + bentuk ramah;
 * (2) getAboutContent() live vs Strapi (fallback harus jalan bila kosong);
 * (3) getScheduleRaw() live — harus null (jadwal ST belum dibuat) tanpa error.
 */
import rawStatic from "../src/data/schedule.json";
import { normalizeScheduleJson, getScheduleRaw } from "../src/lib/schedule-strapi";
import { getAboutContent } from "../src/lib/api/tentang";

let fail = 0;
const ok = (name: string, cond: boolean, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);
  if (!cond) fail++;
};

// 1) Bentuk A: persis schedule.json
const a = normalizeScheduleJson(rawStatic);
ok("A: schedule.json asli", !!a && a.classes.length === rawStatic.classes.length && a.lessons.length === rawStatic.lessons.length,
  a ? `${a.classes.length} kelas, ${a.lessons.length} pelajaran` : "null");

// 2) Bentuk B: objek per pelajaran dgn nama kelas
const b = normalizeScheduleJson({
  classes: ["X A", "X B"],
  lessons: [
    { class: "X A", day: "Senin", start: 1, span: 2, subject: "MTK", teacher: "B.Ike" },
    { kelas: "X B", hari: "Selasa", mulai: "07.40", durasi: 1, mapel: "BIN", guru: "B.Dini" },
  ],
});
ok("B: objek per pelajaran", !!b && b.lessons.length === 2 && b.classes.length === 2,
  b ? JSON.stringify(b.lessons) : "null");

// 3) Bentuk C: array per kelas
const c = normalizeScheduleJson([
  { nama: "XI A", jadwal: [{ hari: "Rabu", jamKe: 3, lamaJam: 2, pelajaran: "FIS", pengajar: "P.Fuad" }] },
]);
ok("C: array per kelas", !!c && c.lessons.length === 1 && c.classes[0] === "XI A",
  c ? JSON.stringify(c) : "null");

// 4) Sampah → null
ok("D: JSON sampah -> null", normalizeScheduleJson({ hello: "world" }) === null && normalizeScheduleJson("x") === null && normalizeScheduleJson(null) === null);

// 5) Live: getScheduleRaw (belum ada ST jadwal → null, tanpa throw)
const live = await getScheduleRaw(0);
ok("E: getScheduleRaw live (ST jadwal belum ada)", live === null, live ? "tapi malah dapat data?" : "null ✓");

// 6) Live: getAboutContent — fallback lengkap + heroImage dari CMS media
const about = await getAboutContent(0);
ok("F: about.heading fallback", about.heading === "Mengenal SMAN 1 Kraksaan", about.heading);
ok("G: about.intro fallback terisi", about.intro.length > 0 && about.intro[0].includes("SMAN 1 Kraksaan"), `${about.intro.length} paragraf`);
ok("H: about.mission 5 item", about.mission.length === 5, `${about.mission.length} misi`);
ok("I: about.facilities terisi", about.facilities.length >= 13, `${about.facilities.length} fasilitas (CMS/static)`);
ok("J: about.extracurriculars terisi", about.extracurriculars.length >= 25, `${about.extracurriculars.length} ekskul`);
console.log(`INFO  heroImage: ${about.heroImage ?? "(fallback unsplash)"}`);
console.log(`INFO  principalPhoto: ${about.principalPhoto ?? "(fallback /kepala-sekolah.jpg)"}`);
console.log(`INFO  fasilitas sumber: ${about.facilities[0]} … dst`);

process.exit(fail === 0 ? 0 : 1);
