import { Hero } from "@/components/home/hero";
import { SupportedBy } from "@/components/home/supported-by";
import { AchievementsPreview } from "@/components/home/achievements-preview";
import { ProgramsPreview } from "@/components/home/programs-preview";
import { AlumniPreview } from "@/components/home/alumni-preview";
import { PartnersPreview } from "@/components/home/partners-preview";
import { MapTeaser } from "@/components/home/map-teaser";
import { EventsPreview } from "@/components/home/events-preview";
import { AiPreview } from "@/components/home/ai-preview";
import { FinalCta } from "@/components/home/final-cta";
import ScheduleWidget from "@/components/home/ScheduleWidget";
import { Reveal } from "@/components/ui/reveal";
import { getAchievements, getNews, getEvents } from "@/lib/api";
import { getHomeAlumni, getHomePartners, getHomePrograms } from "@/lib/home-data";

export default async function Home() {
  const [achievements, news, events, programs, alumni, partners] = await Promise.all([
    getAchievements(),
    getNews(),
    getEvents(),
    getHomePrograms(),
    getHomeAlumni(),
    getHomePartners(),
  ]);

  return (
    <>
      <Hero articles={news} />

      {/* Lima logo wajib dari guidebook JHIC, langsung di bawah hero */}
      <SupportedBy />

      <AchievementsPreview achievements={achievements} />

      <ProgramsPreview items={programs} />

      <Reveal>
        <AlumniPreview items={alumni} />
      </Reveal>

      <Reveal>
        <PartnersPreview items={partners} />
      </Reveal>

      <Reveal>
        <MapTeaser />
      </Reveal>

      <Reveal>
        <ScheduleWidget />
      </Reveal>

      <EventsPreview events={events} />

      <AiPreview />

      <FinalCta />
    </>
  );
}