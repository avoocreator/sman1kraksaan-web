import { Partner } from "@/types";

export const partners: Partner[] = [
  {
    slug: "pt-telkom-indonesia",
    name: "PT Telkom Indonesia",
    logo: "Telkom",
    type: "Magang",
    description: "Menyediakan program magang bidang jaringan dan pengembangan aplikasi bagi siswa program Teknologi Informasi.",
    since: 2021,
    website: "https://telkom.co.id",
    programs: ["Magang Siswa", "Kunjungan Industri", "Bantuan Infrastruktur Digital"],
  },
  {
    slug: "universitas-brawijaya",
    name: "Universitas Brawijaya",
    logo: "UB",
    type: "Kuliah Tamu",
    description: "Kolaborasi rutin dalam bentuk kuliah tamu, olimpiade bersama, dan jalur penerimaan mahasiswa berprestasi.",
    since: 2019,
    website: "https://ub.ac.id",
    programs: ["Kuliah Tamu", "Try Out SNBT", "Jalur Prestasi"],
  },
  {
    slug: "bank-jatim",
    name: "Bank Jatim",
    logo: "Bank Jatim",
    type: "Rekrutmen",
    description: "Membuka jalur rekrutmen magang dan program edukasi literasi keuangan bagi siswa kelas XII.",
    since: 2022,
    programs: ["Literasi Keuangan", "Program Beasiswa"],
  },
  {
    slug: "pt-astra-honda-motor",
    name: "PT Astra Honda Motor",
    logo: "AHM",
    type: "Kunjungan Industri",
    description: "Menyelenggarakan kunjungan industri tahunan ke fasilitas produksi bagi siswa program otomotif.",
    since: 2018,
    programs: ["Kunjungan Pabrik", "Pelatihan Teknisi"],
  },
  {
    slug: "startup-lokal-agritech",
    name: "AgriTech Nusantara",
    logo: "AgriTech",
    type: "Kolaborasi",
    description: "Kolaborasi riset pertanian digital bersama siswa program IPA dalam proyek pertanian presisi.",
    since: 2023,
    programs: ["Riset Bersama", "Mentoring Startup"],
  },
];

export function getAllPartners() {
  return partners;
}

export function getPartnerBySlug(slug: string) {
  return partners.find((p) => p.slug === slug);
}
