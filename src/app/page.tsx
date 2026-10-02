import { Hero } from "@/components/home/hero";
import { AchievementsPreview } from "@/components/home/achievements-preview";
import { ProgramsPreview } from "@/components/home/programs-preview";
import { AlumniPreview } from "@/components/home/alumni-preview";
import { PartnersPreview } from "@/components/home/partners-preview";
import { MapTeaser } from "@/components/home/map-teaser";
import { EventsPreview } from "@/components/home/events-preview";
import { AiPreview } from "@/components/home/ai-preview";
import { FinalCta } from "@/components/home/final-cta";
import ScheduleWidget from "@/components/home/ScheduleWidget";
import { ScheduleProvider } from "@/components/schedule/context";
import { Reveal } from "@/components/ui/reveal";
import { getHomeData, getSearchSuggestions } from "@/lib/home-data";
import { getAccreditationPdf } from "@/lib/api";
import { todayJakarta } from "@/lib/utils";

export const revalidate = 60;

export default async function Home() {
  // Semua section beranda memakai subset terkurasi dari data halaman
  // masing-masing (Strapi dulu, fallback data contoh bawaan).
  const {
    heroArticles, achievements, programItems, alumniItems, partnerItems, events, schedule,
  } = await getHomeData();
  const [accreditationPdf, suggestions] = await Promise.all([
    getAccreditationPdf(),
    getSearchSuggestions(),
  ]);
  const today = todayJakarta();

  return (
    <>
      <Hero articles={heroArticles} accreditationPdf={accreditationPdf} suggestions={suggestions} />

      <AchievementsPreview achievements={achievements} />

      <ProgramsPreview items={programItems} />

      <Reveal>
        <AlumniPreview items={alumniItems} />
      </Reveal>

      <Reveal>
        <PartnersPreview items={partnerItems} />
      </Reveal>

      <Reveal>
        <MapTeaser />
      </Reveal>

      <Reveal>
        <ScheduleProvider raw={schedule}>
          <ScheduleWidget />
        </ScheduleProvider>
      </Reveal>

      <EventsPreview events={events} today={today} />

      <AiPreview />

      <FinalCta />
    </>
  );
}
