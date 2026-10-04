import { getSchoolRooms } from "@/lib/api/index";

const { floor1, floor2 } = await getSchoolRooms();
const all = [...floor1, ...floor2];
const withPano = all.filter((r) => r.panorama);

console.log("== Ruangan dengan panorama ==");
for (const r of withPano) console.log(`· ${r.id} (${r.name}) → ${r.panorama}`);

console.log("\n== Cek spesifik ==");
const rp = all.find((r) => r.id === "ruang-pertemuan");
console.log("ruang-pertemuan panorama:", rp?.panorama ?? "(KOSONG!)");
console.log(
  "ruang-pertemuan photo (dari CMS?):",
  rp?.photo?.startsWith("http") ? rp.photo : rp?.photo,
);

const lf = all.find((r) => r.id === "lab-fisika");
console.log("lab-fisika panorama (fallback demo, CMS null):", lf?.panorama);

const ok =
  Boolean(rp?.panorama) &&
  rp!.panorama!.includes("PHOTOSPHERE") &&
  withPano.length >= 1;
console.log(ok ? "\n== HASIL: LULUS — tombol 360° akan muncul ==" : "\n== HASIL: GAGAL ==");
process.exit(ok ? 0 : 1);
