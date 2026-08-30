import { Alumnus } from "@/types";

export const alumni: Alumnus[] = [
  {
    slug: "raden-ayu-kirana",
    name: "Raden Ayu Kirana",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    graduationYear: 2018,
    destination: "Institut Teknologi Bandung",
    role: "Software Engineer, Gojek",
    location: "Jakarta",
    category: "Karier Profesional",
    bio: "Alumni jurusan MIPA yang kini berkarier sebagai software engineer setelah menempuh studi Teknik Informatika di ITB.",
    timeline: [
      { year: 2018, label: "Lulus SMAN 1 Kraksaan" },
      { year: 2022, label: "Lulus Teknik Informatika, ITB" },
      { year: 2023, label: "Bergabung sebagai Software Engineer" },
    ],
  },
  {
    slug: "muhammad-arya-wibawa",
    name: "Muhammad Arya Wibawa",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    graduationYear: 2016,
    destination: "Universitas Gadjah Mada",
    role: "Founder, Kopi Kraksaan Studio",
    location: "Probolinggo",
    category: "Wirausaha",
    bio: "Merintis usaha kopi lokal yang kini memiliki tiga cabang, sembari aktif membina UMKM di kampung halaman.",
    timeline: [
      { year: 2016, label: "Lulus SMAN 1 Kraksaan" },
      { year: 2020, label: "Lulus Manajemen, UGM" },
      { year: 2021, label: "Mendirikan Kopi Kraksaan Studio" },
    ],
  },
  {
    slug: "anindya-putri-maharani",
    name: "Anindya Putri Maharani",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    graduationYear: 2020,
    destination: "Universitas Airlangga",
    role: "Mahasiswa Kedokteran",
    location: "Surabaya",
    category: "Pendidikan Tinggi",
    bio: "Sedang menempuh pendidikan profesi dokter dan aktif sebagai relawan kesehatan di komunitas kampus.",
    timeline: [
      { year: 2020, label: "Lulus SMAN 1 Kraksaan" },
      { year: 2020, label: "Diterima di Fakultas Kedokteran Unair" },
    ],
  },
  {
    slug: "bima-satria-nugraha",
    name: "Bima Satria Nugraha",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    graduationYear: 2019,
    destination: "Politeknik Elektronika Negeri Surabaya",
    role: "Embedded System Engineer, PT Panasonic",
    location: "Pasuruan",
    category: "Karier Profesional",
    bio: "Menekuni bidang sistem tertanam dan kini menjadi bagian dari tim R&D perangkat elektronik rumah tangga.",
    timeline: [
      { year: 2019, label: "Lulus SMAN 1 Kraksaan" },
      { year: 2023, label: "Lulus D4 Teknik Elektronika, PENS" },
      { year: 2023, label: "Bergabung dengan PT Panasonic" },
    ],
  },
];

export function getAllAlumni() {
  return alumni;
}

export function getAlumnusBySlug(slug: string) {
  return alumni.find((a) => a.slug === slug);
}
