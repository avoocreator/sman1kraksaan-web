/**
 * Pengumuman untuk Portal Siswa (/siswa).
 *
 * Sementara ini datanya statis di sini — kalau nanti content type
 * `pengumumans` dibuat di Strapi, pindahkan sumber datanya ke lapisan API
 * (src/lib/api) dengan pola yang sama seperti konten lain (Strapi dulu,
 * fallback data contoh ini).
 *
 * Tanggal pakai format ISO (yyyy-mm-dd) dan ditampilkan dalam bahasa
 * Indonesia lewat helper di bawah. Urutan tampil: terbaru dulu.
 */
export type Announcement = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  category: "Akademik" | "PPDB" | "Kegiatan" | "Umum";
  body: string;
  important?: boolean; // ditandai khusus kalau butuh perhatian segera
};

export const announcements: Announcement[] = [
  {
    id: "ann-asts-gasal",
    title: "Asesmen Sumatif Tengah Semester Gasal 2026/2027",
    date: "2026-10-05",
    category: "Akademik",
    important: true,
    body:
      "Dilaksanakan 12–17 Oktober 2026 mengikuti jadwal per kelas yang dibagikan wali kelas. " +
      "Datang minimal 15 menit sebelum sesi pertama, bawa kartu peserta, dan pastikan " +
      "kehadiran sudah diisi di buku absensi.",
  },
  {
    id: "ann-pentas-seni",
    title: "Pentas seni Sinematura: tiket mulai dijual di ruang OSIS",
    date: "2026-09-30",
    category: "Kegiatan",
    body:
      "Pentas seni tahunan digelar Sabtu malam di aula. Tiket dijual di ruang OSIS setelah jam " +
      "pelajaran, kuota terbatas per kelas. Panitia juga membuka booth merchandise di kantin.",
  },
  {
    id: "ann-ppdb-daful",
    title: "Daftar ulang PPDB Gelombang 1 dimulai pekan ini",
    date: "2026-09-28",
    category: "PPDB",
    body:
      "Calon siswa yang lolos seleksi mengumpulkan berkas (fotokopi rapor, kartu keluarga, akta, " +
      "dan pas foto) di ruang Tata Usaha paling lambat pukul 13.00 WIB hari kerja.",
  },
  {
    id: "ann-tahfidz-jam",
    title: "Pembiasaan Tahfidz pindah ke jam pelajaran pertama",
    date: "2026-09-22",
    category: "Akademik",
    body:
      "Mulai pekan ini setoran tahfidz kelompok dilakukan di jam pelajaran pertama sesuai " +
      "pembagian kelompok dari guru pembina, bukan lagi sebelum upacara.",
  },
  {
    id: "ann-ekskul-gel2",
    title: "Pendaftaran ekskul gelombang kedua dibuka",
    date: "2026-09-15",
    category: "Kegiatan",
    body:
      "Pendaftaran lewat wali kelas dengan mengisi formulir pilihan pertama dan kedua. Kuota " +
      "setiap ekskul berbeda — cek papan pengumuman ruang OSIS untuk detail pembina dan tempat.",
  },
  {
    id: "ann-piket-x",
    title: "Jadwal piket kelas X di-refresh untuk bulan ini",
    date: "2026-09-10",
    category: "Umum",
    body:
      "Pembagian kelompok piket terbaru ditempel di kelas masing-masing. Alat kebersihan " +
      "diambil dari rak TU dan dikembalikan setelah dipakai.",
  },
];

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** "2026-10-05" → "5 Okt 2026" */
export function formatTanggal(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
}

/** "2026-10-05" → { day: "5", month: "Okt" } untuk blok tanggal di kartu */
export function dateParts(iso: string): { day: string; month: string } {
  const [, m, d] = iso.split("-").map(Number);
  return { day: String(d ?? ""), month: MONTHS_ID[(m ?? 1) - 1] ?? "" };
}
