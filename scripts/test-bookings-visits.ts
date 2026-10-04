
process.env.STRAPI_URL = "http://127.0.0.1:4599";
process.env.STRAPI_TOKEN = "test-read";
process.env.STRAPI_WRITE_TOKEN = "test-write";

const { startMockStrapi } = await import("./mock-strapi.mjs");
const fasilitas = await import("@/lib/api/fasilitas");
const visits = await import("@/lib/visits");
const { seedBookings } = await import("@/data/bookings");

const server = startMockStrapi(4599);

let pass = 0;
let fail = 0;
function ok(name, cond) {
  cond ? pass++ : fail++;
  console.log(`${cond ? "PASS" : "FAIL"} — ${name}`);
}
function eq(name, got, want) {
  const good = JSON.stringify(got) === JSON.stringify(want);
  good ? pass++ : fail++;
  console.log(`${good ? "PASS" : "FAIL"} — ${name}${good ? "" : ` | got: ${JSON.stringify(got)} want: ${JSON.stringify(want)}`}`);
}

async function resetMock() {
  await fetch("http://127.0.0.1:4599/__reset", { method: "POST", headers: { Authorization: "Bearer test-write" } });
}

const TOMORROW = new Date(Date.now() + 86400_000).toISOString().slice(0, 10);
const input = {
  facilitySlug: "aula",
  requesterName: "Budi Siswa",
  requesterType: "Siswa",
  organization: "XI-2",
  contact: "0812-0000-0000",
  date: TOMORROW,
  startTime: "08:00",
  endTime: "10:00",
  participants: 50,
  purpose: "Rapat persiapan pentas seni",
};

console.log("== Pemesanan: validasi server ==");

for (const [name, bad] of [
  ["nama kosong ditolak", { ...input, requesterName: "  " }],
  ["jam mulai > selesai ditolak", { ...input, startTime: "11:00", endTime: "09:00" }],
  ["di luar jam operasional ditolak", { ...input, startTime: "05:00", endTime: "07:00" }],
  ["kapasitas melebihi ditolak", { ...input, participants: 99999 }],
  ["keperluan kosong ditolak", { ...input, purpose: "" }],
  ["fasilitas tak dikenal ditolak", { ...input, facilitySlug: "gedung-misterius" }],
]) {
  let threw = false;
  try {
    await fasilitas.createBooking(bad);
  } catch (e) {
    threw = e instanceof fasilitas.BookingError;
  }
  ok(name, threw);
}

console.log("\n== Pemesanan: alur normal ==");

const b1 = await fasilitas.createBooking(input);
ok("pengajuan berhasil dengan kode berformat", /^FSV-\d{4}-\d{4}$/.test(b1.id));
eq("status awal Menunggu", b1.status, "Menunggu");
eq("fasilitas terisi", b1.facilityName, "Aula Serbaguna");

const found = await fasilitas.getBookingByCode(b1.id);
ok("cari berdasarkan kode → ditemukan", Boolean(found));
eq("kontak ikut untuk pencarian kode", found?.contact ?? "", "0812-0000-0000");

const list = await fasilitas.getBookings();
ok("daftar dari CMS (bukan seed saat CMS hidup)", list.length === 1);
eq("proyeksi publik menyembunyikan kontak", fasilitas.toPublicBooking(list[0]).contact, "");

const b2 = await fasilitas.createBooking({ ...input, startTime: "13:00", endTime: "15:00" });
ok("slot bebas pada hari sama lolos", /^FSV-\d{4}-\d{4}$/.test(b2.id));

console.log("\n== Pemesanan: bentrokan dengan yang disetujui ==");

const fbRow = (await (await fetch("http://127.0.0.1:4599/api/facility-bookings", {
  headers: { Authorization: "Bearer test-read" },
})).json()).data.find((r) => r.documentId !== undefined);
await fetch(`http://127.0.0.1:4599/api/facility-bookings/${fbRow.documentId}`, {
  method: "PUT",
  headers: { Authorization: "Bearer test-write", "Content-Type": "application/json" },
  body: JSON.stringify({ data: { status: "Disetujui" } }),
});
await new Promise((r) => setTimeout(r, 50));

let clashMsg = "";
try {
  await fasilitas.createBooking(input);
} catch (e) {
  clashMsg = e instanceof Error ? e.message : "";
}
ok("bentrok dengan pemesanan disetujui ditolak server", clashMsg.includes("bertabrakan"));
console.log(`   pesan: ${clashMsg}`);

console.log("\n== Kunjungan: sesi IP + interval 60 menit ==");

await resetMock();

await visits.recordVisit("203.0.113.10");
eq("kunjungan pertama tercatat", await visits.getTotalVisits(), 1);
await visits.recordVisit("203.0.113.10");
eq("aktivitas dalam 1 jam = kunjungan sama", await visits.getTotalVisits(), 1);
await visits.recordVisit("198.51.100.7");
eq("IP berbeda = kunjungan baru", await visits.getTotalVisits(), 2);

const vlRows = (await (await fetch("http://127.0.0.1:4599/api/visit-logs", {
  headers: { Authorization: "Bearer test-read" },
})).json()).data;
const aged = vlRows.find((r) => r.visitor === visits.hashVisitor("203.0.113.10"));
await fetch(`http://127.0.0.1:4599/api/visit-logs/${aged.documentId}`, {
  method: "PUT",
  headers: { Authorization: "Bearer test-write", "Content-Type": "application/json" },
  body: JSON.stringify({ data: { lastActiveAt: new Date(Date.now() - 2 * 3600_000).toISOString() } }),
});
await visits.recordVisit("203.0.113.10");
eq("setelah idle > 1 jam = kunjungan baru", await visits.getTotalVisits(), 3);
await visits.recordVisit("203.0.113.10");
eq("aktivitas berikutnya tetap kunjungan sama", await visits.getTotalVisits(), 3);

console.log("\n== Ketahanan ==");

process.env.STRAPI_WRITE_TOKEN = "salah";
let wroteFail = false;
try {
  await fasilitas.createBooking({ ...input, startTime: "16:00", endTime: "17:00" });
} catch {
  wroteFail = true;
}
ok("token tulis salah → gagal jelas", wroteFail);
process.env.STRAPI_WRITE_TOKEN = "test-write";

server.stop(true);
const fallback = await fasilitas.getBookings();
eq("CMS down → fallback seed", fallback.length, seedBookings.length);
ok("CMS down → total kunjungan null (widget disembunyikan)", (await visits.getTotalVisits()) === null);

console.log(`\n== ${pass} pass, ${fail} fail ==`);
process.exit(fail ? 1 : 0);
