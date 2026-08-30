import { SchoolEvent } from "@/types";

export const events: SchoolEvent[] = [
  {
    slug: "school-innovation-day-2026",
    title: "School Innovation Day",
    date: "2026-09-12",
    location: "Aula SMAN 1 Kraksaan",
    description: "Pameran karya inovasi siswa dari seluruh program keahlian, terbuka untuk umum.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    status: "Akan Datang",
  },
  {
    slug: "campus-expo-2026",
    title: "Campus Expo & Beasiswa",
    date: "2026-09-25",
    location: "Lapangan Utama",
    description: "Pameran perguruan tinggi dan informasi beasiswa untuk siswa kelas XII.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    status: "Akan Datang",
  },
  {
    slug: "porseni-2026",
    title: "Pekan Olahraga & Seni (PORSENI)",
    date: "2026-10-05",
    location: "GOR Kraksaan",
    description: "Kompetisi olahraga dan seni antar kelas dalam rangka HUT sekolah.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
    status: "Akan Datang",
  },
  {
    slug: "wisuda-purna-siswa-2026",
    title: "Wisuda Purna Siswa 2026",
    date: "2026-06-14",
    location: "Aula SMAN 1 Kraksaan",
    description: "Pelepasan siswa kelas XII angkatan 2026.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    status: "Selesai",
  },
];

export function getAllEvents() {
  return events;
}

export function getEventBySlug(slug: string) {
  return events.find((e) => e.slug === slug);
}
