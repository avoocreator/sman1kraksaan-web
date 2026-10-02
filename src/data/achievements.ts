import { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    slug: "juara-1-osn-matematika-provinsi",
    title: "Juara 1 OSN Matematika Tingkat Provinsi",
    year: 2025,
    category: "Akademik",
    level: "Provinsi",
    image: "https://images.unsplash.com/photo-1596496181848-3091d4878b24?q=80&w=1200&auto=format&fit=crop",
    description:
      "Tim Olimpiade Sains Nasional bidang Matematika berhasil meraih juara pertama tingkat Provinsi Jawa Timur setelah melalui rangkaian seleksi ketat sejak tingkat kabupaten.",
    participants: ["Ahmad Fauzan", "Nadia Putri"],
  },
  {
    slug: "juara-2-kompetisi-robotik-nasional",
    title: "Juara 2 Kompetisi Robotik Nasional",
    year: 2025,
    category: "Teknologi",
    level: "Nasional",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    description:
      "Tim robotik SMAN 1 Kraksaan tampil sebagai runner-up dalam ajang Kompetisi Robotik Nasional dengan kategori line follower otonom.",
    participants: ["Bagas Prakoso", "Citra Ayu", "Dimas Aditya"],
  },
  {
    slug: "medali-emas-atletik-popda",
    title: "Medali Emas Cabang Atletik POPDA",
    year: 2024,
    category: "Olahraga",
    level: "Kabupaten",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
    description:
      "Cabang lari 100 meter putra berhasil membawa pulang medali emas dalam Pekan Olahraga Pelajar Daerah tingkat Kabupaten Probolinggo.",
    participants: ["Rizky Ramadhan"],
  },
  {
    slug: "juara-1-lomba-cipta-lukis-tingkat-jatim",
    title: "Juara 1 Lomba Cipta Lukis Tingkat Jawa Timur",
    year: 2024,
    category: "Seni",
    level: "Provinsi",
    image: "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?q=80&w=1200&auto=format&fit=crop",
    description:
      "Karya lukis bertema kearifan lokal berhasil menyabet juara pertama pada lomba cipta lukis pelajar se-Jawa Timur.",
    participants: ["Salsabila Putri"],
  },
  {
    slug: "finalis-national-young-inventors-award",
    title: "Finalis National Young Inventors Award",
    year: 2023,
    category: "Teknologi",
    level: "Nasional",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    description:
      "Inovasi alat pemantau kualitas udara berbasis IoT karya siswa berhasil masuk babak final ajang inovasi pelajar tingkat nasional.",
    participants: ["Fajar Nugroho", "Gita Lestari"],
  },
  {
    slug: "juara-3-debat-bahasa-inggris-provinsi",
    title: "Juara 3 Debat Bahasa Inggris Tingkat Provinsi",
    year: 2023,
    category: "Akademik",
    level: "Provinsi",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?q=80&w=1200&auto=format&fit=crop",
    description:
      "Tim debat bahasa Inggris meraih posisi ketiga dalam kompetisi debat pelajar tingkat provinsi yang diikuti 64 sekolah.",
    participants: ["Hana Wijaya", "Ilham Ramadhani"],
  },
];

export function getAllAchievements() {
  return achievements;
}

export function getAchievementBySlug(slug: string) {
  return achievements.find((a) => a.slug === slug);
}
