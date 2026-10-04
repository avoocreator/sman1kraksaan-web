export type AchievementLevel = "Sekolah" | "Kabupaten" | "Provinsi" | "Nasional" | "Internasional";
export type AchievementCategory = "Akademik" | "Teknologi" | "Olahraga" | "Seni" | "Organisasi";

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
  destination: string;
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
  logoImage: string;
  type: "Kuliah Tamu" | "Kunjungan Edukatif" | "Beasiswa & Jalur Masuk" | "Kolaborasi Riset" | "Kegiatan Sosial";
  description: string;
  since: number;
  website?: string;
  programs: string[];
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

export type RoomCategory = "kelas" | "lab" | "fasilitas" | "ekstrakurikuler" | "taman" | "toilet" | "kantin";

export interface SchoolRoom {
  id: string;
  name: string;
  category: RoomCategory;
  description: string;
  photo: string;
  panorama?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  vertical?: boolean;
}

export type FacilityCategory =
  | "Aula & Serbaguna"
  | "Laboratorium"
  | "Olahraga & Lapangan"
  | "Seni & Ekstrakurikuler"
  | "Perpustakaan"
  | "Ruang Rapat";

export interface Facility {
  slug: string;
  name: string;
  category: FacilityCategory;
  shortDescription: string;
  description: string;
  image: string;
  capacity: number;
  location: string;
  amenities: string[];
  openTime: string;
  closeTime: string;
  pic: string;
  note?: string;
}

export type BookingStatus = "Menunggu" | "Disetujui" | "Ditolak" | "Selesai";
export type RequesterType = "Siswa" | "Guru" | "Ekstrakurikuler" | "Organisasi" | "Umum";

export interface FacilityBooking {
  id: string;
  facilitySlug: string;
  facilityName: string;
  requesterName: string;
  requesterType: RequesterType;
  organization: string;
  contact: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;
  purpose: string;
  status: BookingStatus;
  adminNote?: string;
  createdAt: string;
}