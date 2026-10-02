/** Tipe bersama untuk pencarian & rekomendasi search bar. */
export type SearchCategory = "Prestasi" | "Alumni" | "Berita" | "Agenda" | "Program";

export type SearchItem = {
  title: string;
  category: SearchCategory;
  href: string;
  description: string;
};
