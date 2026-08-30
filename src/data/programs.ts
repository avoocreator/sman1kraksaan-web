import { Program } from "@/types";

export const programs: Program[] = [
  {
    slug: "double-track",
    name: "Matura Design Project and Bakery Workshop",
    description: "Program unggulan SMAN 1 Kraksaan yang bekerja sama dengan Institut Teknologi Sepuluh Nopember, dengan fokus pengembangan minat dan bakat dalam desain grafis dan pastry bakery.",
    focus: "Desain Grafis & Tata Boga",
    subjects: ["pengolahan pastry dan makanan khas Indonesia", "desain grafis", "video editing", "fotografi"],
    facilities: ["ruang tata boga", "peralatan bakery", "lab multimedia", "jaringan internet & komputer"],
    careers: ["business owner", "graphic designer", "pastry cheff", "photographer"],

  },

  {
    slug: "saintek",
    name: "kelas sains dan teknologi SMAN 1 Kraksaan",
    description: "Program penjurusan kelas SMAN 1 Kraksaan yang berfokus pada mata pelajaran Biologi, Fisika, Kimia, Matematika, dan Informatika.",
    focus: "pendalaman materi sains dan teknologi",
    subjects: ["Fisika", "Kimia", "Matematika", "Matematika Tingkat Lanjut", "Biologi", "Informatika"],
    facilities: ["Ruang Kelas", "Lab Informatika", "Lab Fisika", "Lab Kimia", "Lab Biologi"],
    careers: ["Kedokteran", "Farmasi", "Teknik", "Data Analyst", "Keperawatan", "Dosen atau Guru"],

  },


  {
    slug: "soshum",
    name: "kelas sosial dan hukum SMAN 1 Kraksaan",
    description: "Program penjurusan kelas SMAN 1 Kraksaan yang berfokus pada mata pelajaran Sejarah, PPKN, Sosiologi, Geografi, dan Ekonomi.",
    focus: "pendalaman materi Sosial, Ekonomi dan Hukum",
    subjects: ["Sejarah", "Sejarah Tingkat Lanjut", "Ekonomi", "Geografi", "PPKN", "Sosiologi"],
    facilities: ["Ruang Kelas", "Lab IPS"],
    careers: ["Arkeolog", "Akuntansi", "Administrasi", "Jaksa", "Hakim", "Dosen atau Guru"],

  },

  {
    slug: "bahasa",
    name: "kelas Bahasa SMAN 1 Kraksaan",
    description: "Program penjurusan kelas SMAN 1 Kraksaan yang berfokus pada mata pelajaran Bahasa Indonesia, Bahasa Inggris, dan Bahasa Jepang.",
    focus: "Pendalaman materi bahasa asing",
    subjects: ["Bahasa Indoensia", "Bahasa Inggris", "Bahasa Inggris Tingkat Lanjut", "Bahasa Jepang"],
    facilities: ["Ruang Kelas", "Lab Bahasa", "Perpustakaan"],
    careers: ["Sastra Bahasa", "Dosen atau Guru"],

  },

  {
    slug: "kelas-osn",
    name: "Kelas Persiapan Olimpiade SMAN 1 Kraksaan",
    description: "Program kelas khusus SMAN 1 Kraksaan yang berfokus pada pengembangan dan persiapan siswa/siswi untuk mengikuti olimpiade akademik.",
    focus: "Pendalaman materi olimpiade",
    subjects: ["Fisika", "Kimia", "Matematika", "Biologi", "Informatika", "Bahasa", "Sejarah", "Ekonomi", "Geografi", "Sosiologi", "PPKN"],
    facilities: ["Ruang Kelas", "Lab Informatika", "Lab Fisika", "Lab Kimia", "Lab Biologi", "Lab Bahasa", "Lab IPS", "Perpustakaan"],
    careers: ["Kedokteran", "Farmasi", "Teknik", "Data Analyst", "Keperawatan", "Dosen atau Guru", "Sastra Bahasa", "Akuntansi", "Administrasi"],

  },
];

export function getAllPrograms() {
  return programs;
}

export function getProgramBySlug(slug: string) {
  return programs.find((p) => p.slug === slug);
}
