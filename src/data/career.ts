import { CareerOpportunity } from "@/types";

export const careerOpportunities: CareerOpportunity[] = [
  {
    slug: "software-developer-intern-telkom",
    position: "Software Developer Intern",
    company: "PT Telkom Indonesia",
    location: "Surabaya",
    type: "Magang",
    deadline: "2026-10-15",
    description: "Membantu tim pengembangan aplikasi internal menggunakan teknologi web modern selama periode PKL.",
    requirements: ["Kelas XI/XII Program TI", "Memahami dasar pemrograman web", "Mampu bekerja dalam tim"],
  },
  {
    slug: "graphic-designer-agritech",
    position: "Graphic Designer",
    company: "AgriTech Nusantara",
    location: "Probolinggo (Remote)",
    type: "Paruh Waktu",
    deadline: "2026-09-30",
    description: "Membuat materi visual untuk kampanye edukasi pertanian digital di media sosial.",
    requirements: ["Menguasai desain grafis dasar", "Portofolio desain", "Kreatif dan komunikatif"],
  },
  {
    slug: "pkl-teknisi-otomotif-ahm",
    position: "PKL Teknisi Otomotif",
    company: "PT Astra Honda Motor",
    location: "Pasuruan",
    type: "PKL",
    deadline: "2026-11-01",
    description: "Praktik kerja lapangan di lini produksi dan perawatan unit sepeda motor.",
    requirements: ["Program Teknik Kendaraan Ringan", "Disiplin dan teliti", "Sehat jasmani"],
  },
  {
    slug: "staf-administrasi-bank-jatim",
    position: "Program Magang Perbankan",
    company: "Bank Jatim Cabang Kraksaan",
    location: "Kraksaan",
    type: "Magang",
    deadline: "2026-10-20",
    description: "Mempelajari operasional layanan perbankan dasar dan literasi keuangan bagi siswa kelas XII.",
    requirements: ["Kelas XII", "Komunikatif", "Rapi dan bertanggung jawab"],
  },
];

export function getAllCareerOpportunities() {
  return careerOpportunities;
}

export function getCareerOpportunityBySlug(slug: string) {
  return careerOpportunities.find((c) => c.slug === slug);
}
