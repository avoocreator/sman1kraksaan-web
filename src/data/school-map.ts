import { SchoolRoom } from "@/types";

function kelas(id: string, name: string, x: number, y: number, w: number, h: number, fontSize = 15): SchoolRoom {
  return {
    id, name, category: "kelas",
    description: `Ruang kelas ${name}, digunakan untuk kegiatan belajar mengajar siswa sehari-hari.`,
    photo: "/jelajah/photos/kelas-default.jpg",
    x, y, width: w, height: h, fontSize,
  };
}

export const floor1Rooms: SchoolRoom[] = [
  // Kolom kiri
  { id: "mushola-putra", name: "Mushola Putra", category: "taman", description: "Tempat ibadah bagi siswa dan warga sekolah laki-laki.", photo: "/jelajah/photos/mushola-putra.jpg", x: 70, y: 130, width: 230, height: 160 },
  { id: "mushola-putri-atas", name: "Mushola Putri", category: "taman", description: "Ruang ibadah kecil bagi siswi di area utara sekolah.", photo: "/jelajah/photos/mushola-putri.jpg", x: 70, y: 295, width: 130, height: 48, fontSize: 11 },
  kelas("xa", "X A", 70, 350, 100, 72),
  kelas("xb", "X B", 70, 425, 100, 72),
  kelas("xc", "X C", 70, 498, 100, 72),
  { id: "galeri-seni", name: "Galeri Seni", category: "ekstrakurikuler", description: "Ruang pameran karya seni rupa hasil kreativitas siswa.", photo: "/jelajah/photos/galeri-seni.jpg", x: 70, y: 572, width: 100, height: 72, fontSize: 12 },
  kelas("xd", "X D", 70, 645, 100, 72),
  kelas("xe", "X E", 70, 718, 100, 72),

  // Kolom 2
  { id: "satpam", name: "Pos Satpam", category: "fasilitas", description: "Pos keamanan sekolah, pusat pemantauan keluar-masuk area sekolah.", photo: "/jelajah/photos/satpam.jpg", x: 367, y: 367, width: 100, height: 45, fontSize: 11 },
  { id: "lab-fisika", name: "Lab. Fisika", category: "lab", description: "Laboratorium praktikum Fisika dengan peralatan eksperimen dasar hingga lanjutan.", photo: "/jelajah/photos/lab-fisika.jpg", x: 235, y: 415, width: 130, height: 150 },
  { id: "ruang-pertemuan", name: "Ruang Pertemuan", category: "fasilitas", description: "Ruang serbaguna untuk rapat guru, orang tua, dan tamu sekolah.", photo: "/jelajah/photos/ruang-pertemuan.jpg", x: 235, y: 567, width: 130, height: 150 },
  kelas("xj", "X J", 368, 415, 95, 72),
  kelas("xi-kelas", "X I", 368, 488, 95, 72),
  kelas("xh", "X H", 368, 562, 95, 155),

  // Baris ekskul/OSIS
  kelas("xf", "X F", 235, 850, 100, 95),
  kelas("xg", "X G", 337, 850, 95, 95),
  { id: "ruang-musik", name: "Ruang Musik", category: "ekstrakurikuler", description: "Studio latihan ekstrakurikuler seni musik (Band).", photo: "/jelajah/photos/ruang-musik.jpg", x: 434, y: 850, width: 130, height: 95, fontSize: 12 },
  { id: "r-osis", name: "Ruang OSIS", category: "fasilitas", description: "Sekretariat Organisasi Siswa Intra Sekolah (OSKAMATURA).", photo: "/jelajah/photos/r-osis.jpg", x: 566, y: 850, width: 100, height: 95, fontSize: 12 },
  { id: "uks", name: "UKS", category: "fasilitas", description: "Unit Kesehatan Sekolah untuk penanganan kesehatan dasar siswa.", photo: "/jelajah/photos/uks.jpg", x: 668, y: 850, width: 100, height: 95, fontSize: 13 },
  { id: "r-sinematura", name: "R. Sinematura", category: "ekstrakurikuler", description: "Ruang ekstrakurikuler Sinematografi & Broadcasting.", photo: "/jelajah/photos/r-sinematura.jpg", x: 770, y: 850, width: 45, height: 95, fontSize: 9, vertical: true },

  // Baris tengah atas
  { id: "komite", name: "Ruang Komite", category: "fasilitas", description: "Ruang kerja Komite Sekolah.", photo: "/jelajah/photos/komite.jpg", x: 534, y: 340, width: 100, height: 80, fontSize: 12 },
  { id: "kurikulum", name: "Ruang Kurikulum", category: "fasilitas", description: "Ruang kerja wakil kepala sekolah bidang kurikulum.", photo: "/jelajah/photos/kurikulum.jpg", x: 636, y: 340, width: 100, height: 80, fontSize: 11 },
  { id: "tu-kepsek", name: "Ruang TU & Kepsek", category: "fasilitas", description: "Ruang Tata Usaha dan ruang Kepala Sekolah.", photo: "/jelajah/photos/tu-kepsek.jpg", x: 738, y: 340, width: 295, height: 80, fontSize: 16 },
  { id: "toilet-putri-atas", name: "Toilet Putri", category: "toilet", description: "Toilet siswi area gedung utara.", photo: "/jelajah/photos/toilet.jpg", x: 1035, y: 340, width: 130, height: 80, fontSize: 13 },
  kelas("xid", "XI D", 1167, 340, 100, 72),
  kelas("xic", "XI C", 1167, 415, 100, 72),
  kelas("xie", "XI E", 1300, 340, 100, 72),
  kelas("xif", "XI F", 1300, 415, 100, 72),

  // Aula
  { id: "aula", name: "Aula", category: "taman", description: "Gedung serbaguna untuk upacara, pertunjukan, dan acara besar sekolah.", photo: "/jelajah/photos/aula.jpg", x: 503, y: 462, width: 296, height: 260, fontSize: 22 },
  { id: "panggung", name: "Panggung", category: "ekstrakurikuler", description: "Panggung pertunjukan di dalam Aula sekolah.", photo: "/jelajah/photos/panggung.jpg", x: 503, y: 722, width: 296, height: 35, fontSize: 11 },

  // Lab Kimia dkk
  { id: "lab-kimia", name: "Lab Kimia", category: "lab", description: "Laboratorium praktikum Kimia dengan fasilitas standar keselamatan.", photo: "/jelajah/photos/lab-kimia.jpg", x: 835, y: 490, width: 165, height: 180 },
  { id: "r-operator", name: "R. Operator", category: "fasilitas", description: "Ruang operator jaringan dan teknisi IT sekolah.", photo: "/jelajah/photos/r-operator.jpg", x: 835, y: 670, width: 82, height: 150, fontSize: 11, vertical: true },
  { id: "lab-biologi", name: "Lab Biologi", category: "lab", description: "Laboratorium praktikum Biologi dengan koleksi spesimen dan mikroskop.", photo: "/jelajah/photos/lab-biologi.jpg", x: 917, y: 670, width: 82, height: 150, fontSize: 12, vertical: true },
  { id: "r-dapodik", name: "R. Dapodik", category: "fasilitas", description: "Ruang pengelolaan Data Pokok Pendidikan sekolah.", photo: "/jelajah/photos/r-dapodik.jpg", x: 835, y: 820, width: 82, height: 95, fontSize: 10 },
  { id: "r-bos", name: "R. BOS/BPOPP", category: "fasilitas", description: "Ruang pengelolaan dana BOS dan BPOPP sekolah.", photo: "/jelajah/photos/r-bos.jpg", x: 917, y: 820, width: 82, height: 95, fontSize: 9 },

  // Taman & Ruang Guru
  { id: "taman-besar", name: "Taman", category: "taman", description: "Area hijau terbuka di tengah kompleks sekolah.", photo: "/jelajah/photos/taman.jpg", x: 1070, y: 580, width: 510, height: 180, fontSize: 20 },
  { id: "r-bk", name: "Ruang BK", category: "fasilitas", description: "Ruang Bimbingan Konseling siswa.", photo: "/jelajah/photos/r-bk.jpg", x: 1070, y: 820, width: 95, height: 95, fontSize: 13 },
  { id: "r-guru", name: "Ruang Guru", category: "fasilitas", description: "Ruang kerja utama seluruh dewan guru SMAN 1 Kraksaan.", photo: "/jelajah/photos/r-guru.jpg", x: 1165, y: 820, width: 255, height: 95, fontSize: 16 },

  kelas("xig", "XI G", 1666, 550, 100, 70),
  kelas("xih", "XI H", 1766, 550, 100, 70),
  kelas("xij", "XI J", 1666, 680, 100, 70),
  kelas("xii-kelas", "XI I", 1766, 680, 100, 70),

  { id: "taman-kecil", name: "Taman", category: "taman", description: "Area hijau kecil di sisi timur kompleks kelas.", photo: "/jelajah/photos/taman.jpg", x: 1600, y: 790, width: 215, height: 75, fontSize: 16 },

  // Perpustakaan & ekskul
  { id: "perpustakaan", name: "Perpustakaan", category: "lab", description: "Perpustakaan sekolah — koleksi buku pelajaran, fiksi, dan ruang baca digital.", photo: "/jelajah/photos/perpustakaan.jpg", x: 1660, y: 80, width: 140, height: 180, fontSize: 13 },
  { id: "r-pecinta-alam", name: "R. Pecinta Alam", category: "ekstrakurikuler", description: "Sekretariat ekstrakurikuler SMAKRAPALA (Pecinta Alam).", photo: "/jelajah/photos/r-pecinta-alam.jpg", x: 1545, y: 300, width: 85, height: 95, fontSize: 9 },
  { id: "r-pramuka", name: "R. Pramuka", category: "ekstrakurikuler", description: "Sekretariat ekstrakurikuler Pramuka.", photo: "/jelajah/photos/r-pramuka.jpg", x: 1630, y: 300, width: 85, height: 95, fontSize: 10 },
  { id: "r-silat", name: "R. Silat", category: "ekstrakurikuler", description: "Ruang latihan ekstrakurikuler Pencak Silat.", photo: "/jelajah/photos/r-silat.jpg", x: 1715, y: 300, width: 85, height: 95, fontSize: 10 },
  { id: "lab-multimedia", name: "Lab Multimedia", category: "lab", description: "Laboratorium multimedia untuk desain grafis, video editing, dan fotografi.", photo: "/jelajah/photos/lab-multimedia.jpg", x: 1545, y: 395, width: 255, height: 120, fontSize: 14 },

  kelas("xiid", "XII D", 1610, 925, 95, 70, 13),
  kelas("xiie", "XII E", 1705, 925, 95, 70, 13),
  kelas("xiig", "XII G", 1610, 1040, 95, 70, 13),
  kelas("xiif", "XII F", 1705, 1040, 95, 70, 13),
  { id: "lab-ips", name: "Lab IPS", category: "lab", description: "Laboratorium IPS untuk praktik dan simulasi pembelajaran ilmu sosial.", photo: "/jelajah/photos/lab-ips.jpg", x: 1610, y: 1155, width: 190, height: 70, fontSize: 14 },
  { id: "lab-komputer", name: "Lab Komputer", category: "lab", description: "Laboratorium komputer untuk pembelajaran Informatika dan TIK.", photo: "/jelajah/photos/lab-komputer.jpg", x: 1610, y: 1290, width: 190, height: 105, fontSize: 15 },

  kelas("xiia", "XII A", 1900, 760, 100, 165, 14),
  kelas("xiib", "XII B", 1900, 925, 100, 95, 14),
  kelas("xiic", "XII C", 1900, 1068, 100, 150, 14),
  { id: "adiwiyata", name: "Adiwiyata", category: "ekstrakurikuler", description: "Ruang koordinasi program Adiwiyata (sekolah peduli lingkungan).", photo: "/jelajah/photos/adiwiyata.jpg", x: 1900, y: 1218, width: 40, height: 95, fontSize: 8, vertical: true },
  { id: "kantin", name: "Kantin", category: "kantin", description: "Kantin sekolah menyediakan makanan dan minuman bagi siswa dan guru.", photo: "/jelajah/photos/kantin.jpg", x: 1830, y: 1180, width: 170, height: 215, fontSize: 18 },

  { id: "lapangan", name: "Lapangan", category: "taman", description: "Lapangan utama untuk upacara bendera, olahraga, dan kegiatan luar ruangan.", photo: "/jelajah/photos/lapangan.jpg", x: 905, y: 970, width: 595, height: 245, fontSize: 26 },

  { id: "mushola-putri-bawah", name: "Mushola Putri", category: "taman", description: "Tempat ibadah utama bagi siswi SMAN 1 Kraksaan.", photo: "/jelajah/photos/mushola-putri.jpg", x: 280, y: 1030, width: 295, height: 300, fontSize: 18 },
  { id: "toilet-putra-bawah", name: "Toilet Putra", category: "toilet", description: "Toilet siswa area selatan sekolah.", photo: "/jelajah/photos/toilet.jpg", x: 580, y: 1120, width: 80, height: 210, fontSize: 11, vertical: true },
  { id: "toilet-putri-bawah", name: "Toilet Putri", category: "toilet", description: "Toilet siswi area selatan sekolah.", photo: "/jelajah/photos/toilet.jpg", x: 665, y: 1195, width: 180, height: 135, fontSize: 14 },

  { id: "r-tataboga", name: "R. Tataboga", category: "lab", description: "Ruang praktik Tata Boga — bagian dari program Double Track Bakery Workshop.", photo: "/jelajah/photos/r-tataboga.jpg", x: 865, y: 1250, width: 100, height: 80, fontSize: 12 },
  { id: "r-kompas", name: "R. KOMPAS", category: "ekstrakurikuler", description: "Ruang ekstrakurikuler Jurnalistik (WARTA MATURA).", photo: "/jelajah/photos/r-kompas.jpg", x: 965, y: 1250, width: 100, height: 80, fontSize: 12 },
  { id: "koperasi", name: "Koperasi", category: "fasilitas", description: "Koperasi sekolah menyediakan alat tulis dan kebutuhan siswa.", photo: "/jelajah/photos/koperasi.jpg", x: 1065, y: 1250, width: 100, height: 80, fontSize: 12 },

  kelas("xiij", "XII J", 1210, 1240, 100, 90, 14),
  kelas("xiii-kelas", "XII I", 1310, 1240, 100, 90, 14),
  kelas("xiih", "XII H", 1410, 1240, 100, 90, 14),
];

// Lantai 2
export const floor2Rooms: SchoolRoom[] = [
  {
    id: "xi-a", name: "XI A", category: "kelas",
    description: "Ruang kelas XI A, satu-satunya bagian sekolah yang memiliki lantai 2.",
    photo: "/jelajah/photos/kelas-default.jpg",
    x: 566, y: 850, width: 100, height: 95, fontSize: 15,
  },
  {
    id: "xi-b", name: "XI B", category: "kelas",
    description: "Ruang kelas XI B, satu-satunya bagian sekolah yang memiliki lantai 2.",
    photo: "/jelajah/photos/kelas-default.jpg",
    x: 668, y: 850, width: 100, height: 95, fontSize: 15,
  },
];

export const MAP_VIEWBOX = "0 0 2050 1420";
export const MAP_CENTER = { x: 1025, y: 710 };