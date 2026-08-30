import type { Metadata } from "next";
import { BookOpen, Building2, Compass, FileCheck2, Target, Users } from "lucide-react";
import { accreditation } from "@/data/school-profile";
import { AccreditationCertificateDownload } from "@/components/ui/accreditation-badge";

export const metadata: Metadata = { title: "Tentang Kami", description: "Sejarah, visi, misi, dan profil SMAN 1 Kraksaan." };

const facilities = [
  "Ruang Kelas",
  "Lab Informatika",
  "Lab Fisika",
  "Lab Kimia",
  "Lab Biologi",
  "Lab Bahasa",
  "Lab IPS",
  "Perpustakaan",
  "Lab MultiMedia",
  "Ruang Tata Usaha",
  "Ruang Pertemuan",
  "Ruangan Organisasi & Ekstrakurikuler",
  "Ruang Kepala Sekolah",
  "Mushola Putra & Putri",
  "Kantin",
  "Koperasi Sekolah",
  "Ruang Guru",
];
const extracurriculars = [
  "Robotika (Matura Robot Tech)",
  "Bahasa Jepang (Nihongo)",
  "ECC (English Conversation Club)",
  "Jurnalistik (WARTA MATURA)",
  "KIR (Kelompok Ilmiah Remaja)",
  "Olah Raga Basket (SHITTONG)",
  "Olah Raga Bola Tangan (Handball)",
  "Olah Raga Futsal",
  "Olah Raga Sepak Takraw",
  "Olah Raga Voli",
  "Olah Raga Badminthon",
  "OSIS (OSKAMATURA)",
  "PASKIBRA (KOMPASMATURA)",
  "Pecinta Alam (SMAKRAPALA)",
  "Pencak Silat",
  "PMR (Palang Merah Remaja)",
  "Pramuka",
  "Seni Drama (TEATER DEKIK)",
  "Seni Hadrah",
  "Seni Lukis (SPAMATURA)",
  "Seni Musik (Band)",
  "Seni Paduan Suara",
  "Seni Tari (ARISAKRA)",
  "Sinematografi & Broadcasting (SINEMATURA)",
  "Tahfidz Quran",
];

export default function AboutPage() {
  return (
    <div>
      <div className="container-page py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Tentang Kami</p>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Mengenal SMAN 1 Kraksaan</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            SMAN 1 Kraksaan merupakan sekolah menengah atas negeri yang berlokasi di Sidomukti, Kraksaan, Kabupaten Probolinggo, Jawa Timur. Berdiri pada tahun 1978, Sekolah ini berhasil mengukir ratusan prestasi akademik dan non-akademik. Sekolah ini menerapkan kurikulum merdeka yang sudah disesuaikan dengan standar Pendidikan Indonesia dan menyediakan program studi Saintek (Sains dan Teknologi) dan Soshum (Sosial Hukum). Selain itu, SMA Negeri 1 Kraksaan aktif dalam mengembangkan kegiatan ekstrakurikuler akademik dan non akademik (seni dan olahraga)
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border">
            <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop" alt="Gedung sekolah" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">Sejarah Singkat</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Didirikan pada 1 April 1978, SMAN 1 Kraksaan telah melewati perjalanan panjang dalam membangun pendidikan di Kabupaten Probolinggo. Berawal dari kegiatan pembelajaran yang memanfaatkan gedung SMP Negeri 1 Kraksaan, sekolah ini kemudian berkembang menjadi institusi pendidikan yang terus beradaptasi dengan perubahan zaman dan mendorong peserta didik untuk berprestasi.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Ribuan alumni telah lahir dari sekolah ini dan tersebar di berbagai bidang, menjadi bukti nyata komitmen sekolah dalam mencetak generasi unggul.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-soft text-orange"><Compass className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-bold text-ink">Visi</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Menghasilkan lulusan yang Beriman, Bertaqwa, Berakhlakmulia, Berbudaya lingkungan, Berwawasan global, dan Terdepan dalamp Prestasi (BELIA BERLIAN GLOBAL TERATASI)</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-soft text-blue"><Target className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-bold text-ink">Misi</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              <ol className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-soft list-decimal list-inside">
                <li>Meningkatkan keimanan dan ketaqwaan pada Tuhan Yang Maha Esa.</li>
                <li>Menguatkan pengembangan enam dimensi profil pelajar Pancasila.</li>
                <li>Meningkatkan kepedulian terhadap kelestarian lingkungan yang sehat.</li>
                <li>Meningkatkan kualitas lulusan untuk dapat bersaing di era global.</li>
                <li>Menumbuhkan dan mendorong tumbuhnya semangat berkompetisi positif dan berprestasi.</li>
              </ol>
            </p>
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-border bg-blue text-white">
          <div className="grid gap-8 p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:p-10">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-4xl font-extrabold">
              {accreditation.rank}
            </span>
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                <FileCheck2 className="h-4 w-4" /> Status Akreditasi
              </p>
              <h2 className="mt-2 text-2xl font-bold">Terakreditasi {accreditation.rank}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
                SMAN 1 Kraksaan telah meraih predikat akreditasi <strong>{accreditation.rank}</strong> dengan
                nilai {accreditation.score} dari {accreditation.issuedBy}, berlaku hingga tahun {accreditation.validUntil}.
              </p>
              <p className="mt-2 text-xs text-white/60">No. Sertifikat: {accreditation.certificateNumber}</p>
            </div>
            <AccreditationCertificateDownload className="bg-orange hover:bg-orange-dark md:self-center" />
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-surface p-8 md:p-10">
          <div className="flex items-start gap-4">
            <img
              src="/kepala-sekolah.jpg"
              alt="Ahmad Sudiarto, S.Pd., M.M. — Kepala SMAN 1 Kraksaan"
              className="h-28 w-28 shrink-0 rounded-xl object-cover sm:h-32 sm:w-32"
            />
            <div>
              <h3 className="text-lg font-bold text-ink">Sambutan Kepala Sekolah</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                "Sungguh merupakan rahmat Allah yang indah hingga pengembangan website SMA Negeri 1 Kraksaan dapat terwujud. Berangkat dari keinginan untuk memberikan layanan pendidikan yang lebih baik bagi masyarakat Kabupaten Probolinggo, khususnya Kraksaan dan sekitarnya, website ini hadir sebagai media untuk menyampaikan berbagai rencana, kegiatan, dan capaian sekolah secara utuh. Terima kasih kami sampaikan kepada seluruh pihak yang senantiasa mendukung kemajuan pendidikan serta keluarga besar SMA Negeri 1 Kraksaan yang terus berkontribusi dalam membangun sekolah tercinta. Website ini menjadi langkah awal untuk terus berbenah dan berkembang, dengan saran serta masukan sebagai bagian penting dalam pengembangannya. Semoga website ini dapat memberikan manfaat dan mewujudkan ikhtiar terbaik SMA Negeri 1 Kraksaan. Aamiin."
              </p>
              <p className="mt-3 text-sm font-semibold text-ink">Ahmad Sudiarto, S.Pd., M.M.</p>
              <p className="text-xs text-muted">Kepala SMAN 1 Kraksaan</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange" />
              <h3 className="text-lg font-bold text-ink">Fasilitas</h3>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {facilities.map((f) => (
                <li key={f} className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink-soft">{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue" />
              <h3 className="text-lg font-bold text-ink">Ekstrakurikuler</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {extracurriculars.map((e) => (
                <span key={e} className="rounded-full border border-border bg-surface-alt px-3.5 py-1.5 text-xs font-medium text-ink-soft">{e}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
