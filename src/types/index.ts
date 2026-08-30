export type AchievementLevel = "Sekolah" | "Kabupaten" | "Provinsi" | "Nasional" | "Internasional";
export type AchievementCategory = "Akademik" | "Teknologi" | "Olahraga" | "Seni";

export interface Achievement {
  slug: string;
  title: string;
  year: number;
  category: AchievementCategory;
  level: AchievementLevel;
  image: string;
  description: string;
  participants: string[];
  documentation?: string[];
}

export interface Alumnus {
  slug: string;
  name: string;
  photo: string;
  graduationYear: number;
  destination: string; // university/company
  role: string;
  location: string;
  category: "Pendidikan Tinggi" | "Karier Profesional" | "Wirausaha";
  bio: string;
  timeline: { year: number; label: string }[];
}

export interface Partner {
  slug: string;
  name: string;
  logo: string;
  type: "Magang" | "Kunjungan Industri" | "Kuliah Tamu" | "Rekrutmen" | "Kolaborasi";
  description: string;
  since: number;
  website?: string;
  programs: string[];
}

export interface CareerOpportunity {
  slug: string;
  position: string;
  company: string;
  location: string;
  type: "Magang" | "PKL" | "Penuh Waktu" | "Paruh Waktu";
  deadline: string;
  description: string;
  requirements: string[];
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  cover: string;
  publishedAt: string;
  author: string;
  featured?: boolean;
}

export interface SchoolEvent {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  status: "Akan Datang" | "Selesai";
}

export interface Program {
  slug: string;
  name: string;
  description: string;
  focus: string;
  subjects: string[];
  facilities: string[];
  careers: string[];
}

export interface Statistics {
  achievements: number;
  alumni: number;
  partners: number;
  programs: number;
  alumniHigherEd: number;
  alumniProfessional: number;
  alumniEntrepreneur: number;
}
