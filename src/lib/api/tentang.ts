/**
 * Konten halaman "Tentang Kami" dari Strapi single type `about`.
 *
 * Prinsip: SEMUA field punya nilai cadangan (fallback) yang sama dengan isi
 * hardcode sebelumnya — jadi situs tidak pernah rusak walau CMS kosong,
 * field belum dibuat, atau Strapi sedang tidak terjangkau.
 *
 * Field CMS yang dibaca (nama fleksibel, besar/kecil huruf diabaikan):
 *   title             Text        — judul H1 (opsional)
 *   decription        Rich text   — paragraf pengantar "Mengenal sekolah"
 *                                 (mengikuti nama field yang sudah ada, typo tetap dibaca)
 *   schoolPhoto       Media       — foto gedung sekolah di samping "Sejarah Singkat"
 *                                 (nama field yang dibuat user; alias lama tetap dibaca:
 *                                 media / heroImage / gambar / fotoSekolah / fotoGedung)
 *   history           Rich text   — sejarah singkat
 *   vision            Text        — visi
 *   mission           Text        — misi, SATU MISI PER BARIS
 *   facilitiesList    Text        — fasilitas, SATU PER BARIS (opsional;
 *                                 kalau kosong dipakai nama dari CT `facilities`)
 *   extracurriculars  Text        — ekskul, SATU PER BARIS
 *   principalName     Text        — nama kepala sekolah
 *   principalMessage  Rich text   — isi sambutan kepala sekolah
 *   principalPhoto    Media       — foto kepala sekolah
 */
import { strapiSingle, strapiList, pick, txt, mediaUrl, blocksToParagraphs, blocksToText } from "@/lib/strapi";
import type { StrapiRow } from "@/lib/strapi";

/* ------------------------------------------------------------------ */
/* Nilai cadangan = isi hardcode lama                                   */
/* ------------------------------------------------------------------ */

export const ABOUT_FALLBACK = {
  heading: "Mengenal SMAN 1 Kraksaan",
  intro:
    "SMAN 1 Kraksaan merupakan sekolah menengah atas negeri yang berlokasi di Sidomukti, Kraksaan, Kabupaten Probolinggo, Jawa Timur. Berdiri pada tahun 1978, Sekolah ini berhasil mengukir ratusan prestasi akademik dan non-akademik. Sekolah ini menerapkan kurikulum merdeka yang sudah disesuaikan dengan standar Pendidikan Indonesia dan menyediakan program studi Saintek (Sains dan Teknologi) dan Soshum (Sosial Hukum). Selain itu, SMA Negeri 1 Kraksaan aktif dalam mengembangkan kegiatan ekstrakurikuler akademik dan non akademik (seni dan olahraga)",
  history: [
    "Didirikan pada 1 April 1978, SMAN 1 Kraksaan telah melewati perjalanan panjang dalam membangun pendidikan di Kabupaten Probolinggo. Berawal dari kegiatan pembelajaran yang memanfaatkan gedung SMP Negeri 1 Kraksaan, sekolah ini kemudian berkembang menjadi institusi pendidikan yang terus beradaptasi dengan perubahan zaman dan mendorong peserta didik untuk berprestasi.",
    "Ribuan alumni telah lahir dari sekolah ini dan tersebar di berbagai bidang, menjadi bukti nyata komitmen sekolah dalam mencetak generasi unggul.",
  ],
  vision:
    "Menghasilkan lulusan yang Beriman, Bertaqwa, Berakhlakmulia, Berbudaya lingkungan, Berwawasan global, dan Terdepan dalamp Prestasi (BELIA BERLIAN GLOBAL TERATASI)",
  mission: [
    "Meningkatkan keimanan dan ketaqwaan pada Tuhan Yang Maha Esa.",
    "Menguatkan pengembangan enam dimensi profil pelajar Pancasila.",
    "Meningkatkan kepedulian terhadap kelestarian lingkungan yang sehat.",
    "Meningkatkan kualitas lulusan untuk dapat bersaing di era global.",
    "Menumbuhkan dan mendorong tumbuhnya semangat berkompetisi positif dan berprestasi.",
  ],
  principalName: "Ahmad Sudiarto, S.Pd., M.M.",
  principalMessage:
    "Sungguh merupakan rahmat Allah yang indah hingga pengembangan website SMA Negeri 1 Kraksaan dapat terwujud. Berangkat dari keinginan untuk memberikan layanan pendidikan yang lebih baik bagi masyarakat Kabupaten Probolinggo, khususnya Kraksaan dan sekitarnya, website ini hadir sebagai media untuk menyampaikan berbagai rencana, kegiatan, dan capaian sekolah secara utuh. Terima kasih kami sampaikan kepada seluruh pihak yang senantiasa mendukung kemajuan pendidikan serta keluarga besar SMA Negeri 1 Kraksaan yang terus berkontribusi dalam membangun sekolah tercinta. Website ini menjadi langkah awal untuk terus berbenah dan berkembang, dengan saran serta masukan sebagai bagian penting dalam pengembangannya. Semoga website ini dapat memberikan manfaat dan mewujudkan ikhtiar terbaik SMA Negeri 1 Kraksaan. Aamiin.",
};

const FALLBACK_FACILITIES = [
  "Ruang Kelas", "Lab Informatika", "Lab Fisika", "Lab Kimia", "Lab Biologi",
  "Lab Bahasa", "Lab IPS", "Perpustakaan", "Lab MultiMedia", "Ruang Tata Usaha",
  "Ruang Pertemuan", "Ruangan Organisasi & Ekstrakurikuler", "Ruang Kepala Sekolah",
  "Mushola Putra & Putri", "Kantin", "Koperasi Sekolah", "Ruang Guru",
];

const FALLBACK_EXTRACURRICULARS = [
  "Robotika (Matura Robot Tech)", "Bahasa Jepang (Nihongo)", "ECC (English Conversation Club)",
  "Jurnalistik (WARTA MATURA)", "KIR (Kelompok Ilmiah Remaja)", "Olah Raga Basket (SHITTONG)",
  "Olah Raga Bola Tangan (Handball)", "Olah Raga Futsal", "Olah Raga Sepak Takraw",
  "Olah Raga Voli", "Olah Raga Badminthon", "OSIS (OSKAMATURA)", "PASKIBRA (KOMPASMATURA)",
  "Pecinta Alam (SMAKRAPALA)", "Pencak Silat", "PMR (Palang Merah Remaja)", "Pramuka",
  "Seni Drama (TEATER DEKIK)", "Seni Hadrah", "Seni Lukis (SPAMATURA)", "Seni Musik (Band)",
  "Seni Paduan Suara", "Seni Tari (ARISAKRA)", "Sinematografi & Broadcasting (SINEMATURA)",
  "Tahfidz Quran",
];

export const PRINCIPAL_ROLE = "Kepala SMAN 1 Kraksaan";

/* ------------------------------------------------------------------ */
/* Util kecil                                                           */
/* ------------------------------------------------------------------ */

/** Teks multiline → daftar item (SATU PER BARIS, koma TIDAK dipakai pemisah
 *  karena banyak kalimat mengandung koma). Kalau field ternyata Rich text
 *  (Blocks), setiap blok paragraf dianggap satu item. */
function textItems(v: unknown): string[] {
  if (Array.isArray(v)) {
    const out = (v as Array<Record<string, unknown>>)
      .map((b) => txt(blocksToText(b)))
      .filter(Boolean);
    return out;
  }
  if (typeof v !== "string") return [];
  return v
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Rich text (Blocks) / string → daftar paragraf. */
function paragraphs(v: unknown): string[] {
  if (typeof v === "string") {
    return v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  return blocksToParagraphs(v);
}

/* ------------------------------------------------------------------ */
/* Tipe hasil                                                           */
/* ------------------------------------------------------------------ */

export type AboutContent = {
  heading: string;
  intro: string[];
  heroImage?: string;
  history: string[];
  vision: string;
  mission: string[];
  facilities: string[];
  extracurriculars: string[];
  principalName: string;
  principalRole: string;
  principalMessage: string[];
  principalPhoto?: string;
  /** true kalau ada cukup data dari Strapi (min. intro/history terisi). */
  fromCms: boolean;
};

/* ------------------------------------------------------------------ */
/* Ambil konten                                                         */
/* ------------------------------------------------------------------ */

async function facilityNamesFromCt(revalidate: number): Promise<string[]> {
  const rows = await strapiList(["facilities", "facility"], revalidate);
  if (!rows?.length) return [];
  const names = rows
    .map((r) => txt(pick(r, "name", "nama", "title", "judul")))
    .filter(Boolean);
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, "id"));
}

export async function getAboutContent(revalidate = 120): Promise<AboutContent> {
  const about = await strapiSingle<StrapiRow>(["about", "about-page", "tentang"], revalidate);

  // Fasilitas: field teks di About → CT facilities → fallback statis.
  let facilities = textItems(pick(about ?? {}, "facilitiesList", "facilities", "daftarFasilitas"));
  if (facilities.length === 0) facilities = await facilityNamesFromCt(revalidate);
  if (facilities.length === 0) facilities = FALLBACK_FACILITIES;

  const extracurriculars = textItems(pick(about ?? {}, "extracurriculars", "ekstrakurikuler", "extracurricular"));
  const heroImage = mediaUrl(
    pick(about ?? {}, "schoolPhoto", "schoolImage", "fotoSekolah", "fotoGedung", "media", "heroImage", "gambar"),
  );
  const principalPhoto = mediaUrl(pick(about ?? {}, "principalPhoto", "fotoKepsek"));

  const intro = paragraphs(pick(about ?? {}, "decription", "description", "intro"));
  const history = paragraphs(pick(about ?? {}, "history", "sejarah"));

  return {
    heading: txt(pick(about ?? {}, "title", "judul")) || ABOUT_FALLBACK.heading,
    intro: intro.length ? intro : [ABOUT_FALLBACK.intro],
    heroImage,
    history: history.length ? history : ABOUT_FALLBACK.history,
    vision: txt(pick(about ?? {}, "vision", "visi")) || ABOUT_FALLBACK.vision,
    mission: (() => {
      const m = textItems(pick(about ?? {}, "mission", "misi"));
      return m.length ? m : ABOUT_FALLBACK.mission;
    })(),
    facilities,
    extracurriculars: extracurriculars.length ? extracurriculars : FALLBACK_EXTRACURRICULARS,
    principalName: txt(pick(about ?? {}, "principalName", "namaKepsek")) || ABOUT_FALLBACK.principalName,
    principalRole: PRINCIPAL_ROLE,
    principalMessage: (() => {
      const m = paragraphs(pick(about ?? {}, "principalMessage", "sambutanKepsek"));
      return m.length ? m : [ABOUT_FALLBACK.principalMessage];
    })(),
    principalPhoto,
    fromCms: Boolean(about) && (intro.length > 0 || history.length > 0),
  };
}
