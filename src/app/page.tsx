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
import { getAchievements, getNews, getEvents } from "@/lib/api";

export default async function Home() {
  const [achievements, news, events] = await Promise.all([
    getAchievements(),
    getNews(),
    getEvents(),
  ]);

  return (
    <>
      <Hero articles={news} />

      {/* Lima logo wajib dari guidebook JHIC, langsung di bawah hero */}
      <SupportedBy />

      <AchievementsPreview achievements={achievements} />

      <ProgramsPreview />

      <AlumniPreview />

      <PartnersPreview />

      <MapTeaser />

      <ScheduleWidget />

      <div className="bg-surface-alt/40 py-3">
        <div className="container-page">
          <div className="h-px bg-border/70" />
        </div>
      </div>

      <EventsPreview events={events} />

      <AiPreview />

      <FinalCta />
    </>
  );
}