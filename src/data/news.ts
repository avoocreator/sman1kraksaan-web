import { NewsArticle } from "@/types";

export const news: NewsArticle[] = [
  {
    slug: "sman1kraksaan-raih-adiwiyata-nasional",
    title: "SMAN 1 Kraksaan Raih Predikat Adiwiyata Nasional",
    excerpt: "Konsistensi program lingkungan sekolah membuahkan hasil dengan diraihnya predikat Adiwiyata tingkat nasional.",
    content: [
      "SMAN 1 Kraksaan resmi menerima penghargaan Adiwiyata Nasional setelah melalui proses penilaian selama satu tahun terakhir.",
      "Program bank sampah, kebun sekolah, dan kurikulum lingkungan hidup menjadi penilaian utama tim juri.",
      "Kepala sekolah menyampaikan bahwa penghargaan ini menjadi motivasi untuk terus mengembangkan budaya peduli lingkungan di kalangan siswa.",
    ],
    category: "Prestasi",
    cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
    publishedAt: "2026-08-20",
    author: "Humas Sekolah",
    featured: true,
  },
  {
    slug: "pembukaan-lab-inovasi-digital",
    title: "Pembukaan Laboratorium Inovasi Digital",
    excerpt: "Fasilitas baru ini dilengkapi perangkat pemrograman dan IoT untuk mendukung pembelajaran teknologi.",
    content: [
      "Laboratorium Inovasi Digital resmi dibuka untuk mendukung program Teknologi Informasi dan Rekayasa Perangkat Lunak.",
      "Fasilitas ini merupakan hasil kolaborasi dengan mitra industri teknologi.",
    ],
    category: "Fasilitas",
    cover: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
    publishedAt: "2026-08-10",
    author: "Tim Media",
  },
  {
    slug: "workshop-kewirausahaan-siswa",
    title: "Workshop Kewirausahaan Bersama Alumni",
    excerpt: "Alumni sukses berbagi pengalaman merintis usaha di hadapan siswa kelas XI dan XII.",
    content: [
      "Kegiatan ini menghadirkan alumni yang kini menjalankan usaha di bidang kuliner dan kreatif.",
    ],
    category: "Kegiatan",
    cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    publishedAt: "2026-07-28",
    author: "OSIS",
  },
  {
    slug: "tim-robotik-wakili-jawa-timur",
    title: "Tim Robotik Wakili Jawa Timur di Ajang Nasional",
    excerpt: "Setelah menjuarai seleksi provinsi, tim robotik siap berlaga di tingkat nasional bulan depan.",
    content: ["Persiapan intensif dilakukan bersama pembina ekstrakurikuler robotik."],
    category: "Prestasi",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    publishedAt: "2026-07-15",
    author: "Humas Sekolah",
  },
];

export function getAllNews() {
  return news;
}

export function getNewsBySlug(slug: string) {
  return news.find((n) => n.slug === slug);
}
