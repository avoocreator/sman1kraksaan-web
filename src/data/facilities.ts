import { Facility } from "@/types";

/**
 * Data fasilitas sekolah yang dapat dipesan.
 * Daftar ruangan mengacu pada data peta sekolah (school-map.ts) —
 * hanya ruangan yang memang dapat dipinjam/dipesan yang dimasukkan.
 */
export const facilities: Facility[] = [
  {
    slug: "aula",
    name: "Aula Serbaguna",
    category: "Aula & Serbaguna",
    shortDescription: "Gedung serbaguna untuk upacara, pertunjukan, seminar, dan acara besar sekolah.",
    description:
      "Aula SMAN 1 Kraksaan adalah gedung serbaguna utama yang menjadi pusat kegiatan besar sekolah. Dengan panggung pertunjukan, tata suara, dan ruang duduk yang luas, aula ini digunakan untuk upacara besar, pentas seni, seminar karier, sampai kegiatan yang melibatkan tamu dari luar sekolah. Pemesanan diutamakan untuk kegiatan pembelajaran dan kegiatan resmi sekolah, kemudian kegiatan organisasi siswa, serta kolaborasi dengan instansi luar.",
    image: "/fasilitas/photos/aula.jpg",
    capacity: 500,
    location: "Gedung utama, samping Ruang TU & Kepala Sekolah",
    amenities: ["Panggung & tirai panggung", "Sound system", "AC", "Kursi lipat", "Proyektor", "Genset cadangan"],
    openTime: "07:00",
    closeTime: "21:00",
    pic: "Waka Sarana Prasarana",
    note: "Untuk acara malam, pengajuan minimal 7 hari sebelum tanggal pelaksanaan.",
  },
  {
    slug: "lapangan-utama",
    name: "Lapangan Utama",
    category: "Olahraga & Lapangan",
    shortDescription: "Lapangan serbaguna untuk upacara bendera, olahraga, dan kegiatan luar ruangan.",
    description:
      "Lapangan utama adalah area terbuka terluas di kompleks sekolah. Sehari-hari digunakan untuk upacara bendera, pembiasaan pagi, dan pelajaran PJOK. Di luar jam tersebut lapangan dapat dipesan untuk latihan ekstrakurikuler olahraga, turnamen antar-kelas, maupun kegiatan komunitas yang tidak mengganggu pembelajaran. Tersedia ring basket dan garis lapangan futsal mini.",
    image: "/fasilitas/photos/lapangan.jpg",
    capacity: 1000,
    location: "Tengah kompleks sekolah, bersebelahan dengan Taman",
    amenities: ["Ring basket", "Garis lapangan futsal mini", "Marka upacara", "Sound system portable", "Tribun penonton"],
    openTime: "06:00",
    closeTime: "18:00",
    pic: "Guru PJOK",
    note: "Tidak dapat dipesan pada hari Senin pagi (upacara bendera).",
  },
  {
    slug: "lab-kimia",
    name: "Laboratorium Kimia",
    category: "Laboratorium",
    shortDescription: "Laboratorium praktikum Kimia dengan fasilitas standar keselamatan lengkap.",
    description:
      "Laboratorium Kimia dilengkapi meja praktikum, lemari bahan kimia, APAR, dan peralatan gelas standar untuk praktikum siswa. Selain untuk praktikum mata pelajaran Kimia, lab ini dapat dipesan untuk kegiatan olimpiade sains, tutoring, dan pelatihan berbasis proyek. Setiap penggunaan wajib didampingi guru/guru lab dan mengikuti prosedur keselamatan kerja.",
    image: "/fasilitas/photos/lab-kimia.jpg",
    capacity: 36,
    location: "Gedung sains, lantai 1",
    amenities: ["Meja praktikum 8 kelompok", "Lemari bahan kimia", "APAR & eyewash", "Peralatan gelas laboratorium", "Proyektor"],
    openTime: "07:00",
    closeTime: "17:00",
    pic: "Guru Kimia / Petugas Lab",
    note: "Penggunaan bahan kimia khusus wajib dikonfirmasi ke guru lab minimal 3 hari sebelumnya.",
  },
  {
    slug: "lab-fisika",
    name: "Laboratorium Fisika",
    category: "Laboratorium",
    shortDescription: "Laboratorium praktikum Fisika dengan peralatan eksperimen dasar hingga lanjutan.",
    description:
      "Laboratorium Fisika mendukung praktikum mekanika, listrik-magnet, gelombang, dan optik. Peralatan eksperimen dikelola oleh petugas lab dan dapat dipinjam sesuai kebutuhan praktikum. Lab ini juga sering digunakan untuk pembinaan olimpiade fisika dan kegiatan sains ekstrakurikuler.",
    image: "/fasilitas/photos/lab-fisika.jpg",
    capacity: 36,
    location: "Gedung utara, lantai 1",
    amenities: ["Kit eksperimen mekanika & listrik", "Alat ukur presisi", "Meja praktikum", "Proyektor", "Lemari alat"],
    openTime: "07:00",
    closeTime: "17:00",
    pic: "Guru Fisika / Petugas Lab",
  },
  {
    slug: "lab-biologi",
    name: "Laboratorium Biologi",
    category: "Laboratorium",
    shortDescription: "Laboratorium praktikum Biologi dengan koleksi spesimen dan mikroskop.",
    description:
      "Laboratorium Biologi memiliki koleksi spesimen preparat, mikroskop binokuler, dan peralatan diseksi untuk praktikum siswa. Tersedia juga area kebun lab untuk praktikum ekologi sederhana. Cocok untuk praktikum reguler, pembinaan olimpiade biologi, dan proyek riset siswa.",
    image: "/fasilitas/photos/lab-biologi.jpg",
    capacity: 36,
    location: "Gedung sains, lantai 1",
    amenities: ["Mikroskop binokuler", "Koleksi spesimen preparat", "Peralatan diseksi", "Meja praktikum", "Proyektor"],
    openTime: "07:00",
    closeTime: "17:00",
    pic: "Guru Biologi / Petugas Lab",
  },
  {
    slug: "lab-komputer",
    name: "Laboratorium Komputer",
    category: "Laboratorium",
    shortDescription: "Laboratorium komputer untuk pembelajaran Informatika, TIK, dan pelatihan digital.",
    description:
      "Laboratorium Komputer berisi 36 unit PC dengan jaringan internet, digunakan untuk pembelajaran Informatika dan simulasi ujian berbasis komputer. Di luar jadwal pembelajaran, lab ini dapat dipesan untuk pelatihan literasi digital, workshop coding, ujian sertifikasi, dan kegiatan organisasi yang membutuhkan perangkat komputer.",
    image: "/fasilitas/photos/lab-komputer.jpg",
    capacity: 36,
    location: "Gedung timur, lantai 1",
    amenities: ["36 unit PC + internet", "Proyektor", "AC", "Printer jaringan", "Whiteboard"],
    openTime: "07:00",
    closeTime: "17:00",
    pic: "Ruang Operator / Waka Kurikulum",
    note: "Instalasi software tambahan wajib diajukan sebelum hari pelaksanaan.",
  },
  {
    slug: "lab-multimedia",
    name: "Laboratorium Multimedia",
    category: "Laboratorium",
    shortDescription: "Lab multimedia untuk desain grafis, video editing, dan fotografi.",
    description:
      "Laboratorium Multimedia adalah ruang produksi kreatif untuk kegiatan Sinematura (Sinematografi & Broadcasting) dan Warta Matura (Jurnalistik). Dilengkapi PC spesifikasi tinggi untuk editing, kamera, tripod, lighting kit, dan green screen sederhana. Dapat dipesan untuk produksi konten sekolah, workshop, dan kegiatan ekstrakurikuler lain dengan koordinasi pembina.",
    image: "/fasilitas/photos/lab-multimedia.jpg",
    capacity: 30,
    location: "Sisi barat gedung, sebelah R. Pecinta Alam",
    amenities: ["PC editing spesifikasi tinggi", "Kamera & tripod", "Lighting kit", "Green screen", "Microphone set"],
    openTime: "07:00",
    closeTime: "17:00",
    pic: "Pembina Sinematura",
  },
  {
    slug: "perpustakaan",
    name: "Perpustakaan",
    category: "Perpustakaan",
    shortDescription: "Koleksi buku pelajaran, fiksi, dan ruang baca digital yang nyaman.",
    description:
      "Perpustakaan SMAN 1 Kraksaan menyediakan koleksi buku pelajaran, literatur fiksi dan non-fiksi, serta ruang baca digital. Ruangan dapat dipesan untuk kegiatan literasi kelas, bedah buku, diskusi studi independen, dan pertemuan klub membaca. Kegiatan rutin jam belajar tetap menjadi prioritas utama.",
    image: "/fasilitas/photos/perpustakaan.jpg",
    capacity: 80,
    location: "Gedung utara, lantai 2",
    amenities: ["Koleksi 12.000+ judul", "Area baca", "Komputer katalog digital", "AC", "Proyektor"],
    openTime: "07:00",
    closeTime: "16:30",
    pic: "Kepala Perpustakaan",
  },
  {
    slug: "ruang-pertemuan",
    name: "Ruang Pertemuan",
    category: "Ruang Rapat",
    shortDescription: "Ruang serbaguna untuk rapat guru, orang tua, dan tamu sekolah.",
    description:
      "Ruang Pertemuan dirancang untuk rapat internal guru, pertemuan komite dan orang tua, serta menerima tamu undangan. Meja konferensi panjang dengan kursi nyaman dan proyektor membuat ruangan ini cocok untuk diskusi produkif skala menengah. Pemesanan oleh organisasi siswa diperbolehkan untuk kegiatan koordinasi resmi.",
    image: "/fasilitas/photos/ruang-pertemuan.jpg",
    capacity: 50,
    location: "Gedung utara, lantai 1",
    amenities: ["Meja konferensi panjang", "AC", "Proyektor & layar", "Sound system kecil", "Whiteboard"],
    openTime: "07:00",
    closeTime: "17:00",
    pic: "Tata Usaha",
  },
  {
    slug: "ruang-musik",
    name: "Ruang Musik",
    category: "Seni & Ekstrakurikuler",
    shortDescription: "Studio latihan ekstrakurikuler seni musik (band).",
    description:
      "Ruang Musik adalah studio latihan untuk ekstrakurikuler musik dengan perangkat drum, keyboard, gitar bass, dan sound system latihan. Dinding peredam suara membuat latihan tidak mengganggu proses belajar di ruang sekitar. Selain jadwal latihan rutin, ruangan dapat dipesan untuk persiapan pentas seni dan rekaman proyek siswa.",
    image: "/fasilitas/photos/ruang-musik.jpg",
    capacity: 25,
    location: "Blok selatan, sebelah Ruang OSIS",
    amenities: ["Drum set", "Keyboard", "Gitar & bass + amplifier", "Sound system latihan", "Peredam suara"],
    openTime: "15:30",
    closeTime: "20:30",
    pic: "Pembina Ekstrakurikuler Musik",
    note: "Latihan sore/malam hanya untuk persiapan acara resmi sekolah.",
  },
  {
    slug: "galeri-seni",
    name: "Galeri Seni",
    category: "Seni & Ekstrakurikuler",
    shortDescription: "Ruang pameran karya seni rupa hasil kreativitas siswa.",
    description:
      "Galeri Seni menjadi ruang pamer karya seni rupa siswa — lukisan, kaligrafi, keramik, hingga instalasi. Ruangan dapat dipesan untuk pameran tematik, workshop melukis, dan kegiatan ekstrakurikuler seni rupa. Kurasi pameran didampingi pembina seni rupa agar tampilan galeri tetap konsisten.",
    image: "/fasilitas/photos/galeri-seni.jpg",
    capacity: 60,
    location: "Sisi barat gedung, lantai 1",
    amenities: ["Panel pamer modular", "Lighting pamer", "Meja kerja seni", "Rak penyimpanan karya"],
    openTime: "07:00",
    closeTime: "16:00",
    pic: "Guru Seni Rupa",
  },
  {
    slug: "r-tataboga",
    name: "Ruang Tata Boga",
    category: "Laboratorium",
    shortDescription: "Ruang praktik Tata Boga — bagian dari program Double Track Bakery Workshop.",
    description:
      "Ruang Tata Boga adalah dapur praktik dengan counter stainless steel, oven, dan peralatan memasak lengkap. Merupakan bagian dari program Double Track Bakery Workshop yang melatih keterampilan kewirausahaan siswa. Dapat dipesan untuk pelatihan kuliner, bazar makanan, dan kegiatan kewirausahaan yang didampingi guru pembina.",
    image: "/fasilitas/photos/r-tataboga.jpg",
    capacity: 30,
    location: "Gedung selatan, dekat Kantin",
    amenities: ["Counter stainless steel", "Oven & mixer", "Kompor 4 tungku", "Peralatan memasak lengkap", "Area cuci"],
    openTime: "07:00",
    closeTime: "17:00",
    pic: "Guru Tata Boga",
    note: "Wajib menyerahkan daftar bahan dan mengikuti prosedur keamanan pangan.",
  },
];

export function getAllFacilities() {
  return facilities;
}

export function getFacilityBySlug(slug: string) {
  return facilities.find((f) => f.slug === slug);
}
