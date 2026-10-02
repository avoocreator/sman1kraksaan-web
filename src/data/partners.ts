import { Partner } from "@/types";

export const partners: Partner[] = [
  {
    slug: "pt-telkom-indonesia",
    name: "PT Telkom Indonesia",
    logo: "Telkom",
    logoImage: "/partners/logos/pt-telkom-indonesia.png",
    type: "Kunjungan Edukatif",
    description:
      "Kolaborasi edukatif dalam pengenalan teknologi digital, jaringan, dan perkembangan industri telekomunikasi bagi siswa.",
    since: 2021,
    website: "https://telkom.co.id",
    programs: [
      "Kunjungan Edukatif",
      "Edukasi Teknologi Digital",
      "Bantuan Infrastruktur Digital",
    ],
  },
  {
    slug: "universitas-brawijaya",
    name: "Universitas Brawijaya",
    logo: "UB",
    logoImage: "/partners/logos/universitas-brawijaya.png",
    type: "Kuliah Tamu",
    description:
      "Kolaborasi akademik dalam bentuk kuliah tamu, olimpiade bersama, dan pengenalan jalur penerimaan mahasiswa berprestasi.",
    since: 2019,
    website: "https://ub.ac.id",
    programs: ["Kuliah Tamu", "Try Out SNBT", "Jalur Prestasi"],
  },
  {
    slug: "bank-jatim",
    name: "Bank Jatim",
    logo: "Bank Jatim",
    logoImage: "/partners/logos/bank-jatim.png",
    type: "Beasiswa & Jalur Masuk",
    description:
      "Mendukung pengembangan siswa melalui edukasi literasi keuangan dan program beasiswa pendidikan.",
    since: 2022,
    programs: ["Literasi Keuangan", "Program Beasiswa"],
  },
  {
    slug: "pt-astra-honda-motor",
    name: "PT Astra Honda Motor",
    logo: "AHM",
    logoImage: "/partners/logos/pt-astra-honda-motor.png",
    type: "Kunjungan Edukatif",
    description:
      "Menyelenggarakan kegiatan kunjungan edukatif untuk mengenalkan lingkungan industri, proses produksi, dan perkembangan teknologi otomotif.",
    since: 2018,
    programs: ["Kunjungan Pabrik", "Edukasi Teknologi Otomotif"],
  },
  {
    slug: "startup-lokal-agritech",
    name: "AgriTech Nusantara",
    logo: "AgriTech",
    logoImage: "/partners/logos/agritech-nusantara.png",
    type: "Kolaborasi Riset",
    description:
      "Kolaborasi riset pertanian digital bersama siswa dalam proyek pengenalan teknologi pertanian presisi dan inovasi berbasis data.",
    since: 2023,
    programs: ["Riset Bersama", "Mentoring Inovasi"],
  },
];

export function getAllPartners() {
  return partners;
}

export function getPartnerBySlug(slug: string) {
  return partners.find((p) => p.slug === slug);
}