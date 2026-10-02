import { Hero } from "@/components/home/hero";
import { AchievementsPreview } from "@/components/home/achievements-preview";
import { ProgramsPreview } from "@/components/home/programs-preview";
import { AlumniPreview } from "@/components/home/alumni-preview";
import { PartnersPreview } from "@/components/home/partners-preview";
import { MapTeaser } from "@/components/home/map-teaser";
import { FinalCta } from "@/components/home/final-cta";
import { Reveal } from "@/components/ui/reveal";
import { getHomeData, getSearchSuggestions } from "@/lib/home-data";
import { getAccreditationPdf } from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
  // Urutan beranda (mode umum): Hero → Kenapa di sini (program) → Prestasi →
  // Alumni → Mitra → Jelajahi peta virtual → PPDB sebagai penutup.
  // Widget jadwal pelajaran kini hidup di Portal Siswa (/siswa), agenda di
  // halaman /events, dan asisten AI tetap bisa diakses dari tombol mengambang.
  const { heroArticles, achievements, programItems, alumniItems, partnerItems } =
    await getHomeData();
  const [accreditationPdf, suggestions] = await Promise.all([
    getAccreditationPdf(),
    getSearchSuggestions(),
  ]);

  return (
    <>
      <Hero articles={heroArticles} accreditationPdf={accreditationPdf} suggestions={suggestions} />

      <ProgramsPreview items={programItems} />

      <AchievementsPreview achievements={achievements} />

      <Reveal>
        <AlumniPreview items={alumniItems} />
      </Reveal>

      <Reveal>
        <PartnersPreview items={partnerItems} />
      </Reveal>

      <Reveal>
        <MapTeaser />
      </Reveal>

      <FinalCta />
    </>
  );
}
