import type { Metadata } from "next";
import { BookOpen, Building2, Compass, FileCheck2, Target, Users } from "lucide-react";
import { accreditation } from "@/data/school-profile";
import { AccreditationCertificateDownload } from "@/components/ui/accreditation-badge";

export const metadata: Metadata = { title: "Tentang Kami", description: "Sejarah, visi, misi, dan profil SMAN 1 Kraksaan." };

const facilities = ["Laboratorium IPA", "Lab Inovasi Digital", "Perpustakaan Digital", "Studio Robotik", "GOR & Lapangan Olahraga", "Aula Serbaguna"];
const extracurriculars = ["Robotik", "Teknologi Informasi", "Debat Bahasa Inggris", "Atletik", "Seni Lukis", "Paduan Suara", "Pramuka", "PMR"];

export default function AboutPage() {
  return (
    <div>
      <div className="container-page py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Tentang Kami</p>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Mengenal SMAN 1 Kraksaan</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Sejak 1965, kami membina generasi pelajar Probolinggo dengan pendekatan akademik yang kuat, karakter yang kokoh, dan keterhubungan nyata dengan dunia industri dan perguruan tinggi.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border">
            <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop" alt="Gedung sekolah" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink">Sejarah Singkat</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              SMAN 1 Kraksaan berdiri pada tahun 1965 sebagai salah satu sekolah menengah atas negeri tertua di Kabupaten Probolinggo. Selama lebih dari lima dekade, sekolah terus bertransformasi mengikuti perkembangan zaman — dari kurikulum konvensional hingga kini merintis ekosistem pembelajaran digital yang terhubung dengan industri.
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
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Menjadi sekolah unggul yang menghasilkan lulusan berkarakter, kompetitif, dan siap menghadapi tantangan global.</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-soft text-blue"><Target className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-bold text-ink">Misi</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Menyelenggarakan pembelajaran bermutu, membina prestasi siswa, dan membangun jejaring dengan perguruan tinggi serta industri.</p>
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
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange text-white"><Users className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-bold text-ink">Sambutan Kepala Sekolah</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                "Pendidikan bukan sekadar transfer ilmu, melainkan proses membentuk karakter dan membuka jalan menuju peluang. Melalui platform digital ini, kami berharap seluruh warga sekolah, alumni, dan mitra industri dapat terhubung lebih erat demi masa depan siswa yang lebih cerah."
              </p>
              <p className="mt-3 text-sm font-semibold text-ink">Drs. H. Bambang Sutrisno, M.Pd.</p>
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
