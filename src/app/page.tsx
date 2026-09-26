import { Hero } from "@/components/home/hero";
import { SupportedBy } from "@/components/home/supported-by";
import { StatsStrip } from "@/components/home/stats-strip";
import { SchoolIntro } from "@/components/home/school-intro";
import { AchievementsPreview } from "@/components/home/achievements-preview";
import { AlumniPreview } from "@/components/home/alumni-preview";
import { PartnersPreview } from "@/components/home/partners-preview";
import { NewsPreview } from "@/components/home/news-preview";
import { EventsPreview } from "@/components/home/events-preview";
import { AiPreview } from "@/components/home/ai-preview";
import { FinalCta } from "@/components/home/final-cta";
import {
  getAchievements,
  getAlumni,
  getPartners,
  getNews,
  getEvents,
  getStatistics,
} from "@/lib/api";

export default async function Home() {
  const [achievements, alumniList, partners, news, events, statistics] =
    await Promise.all([
      getAchievements(),
      getAlumni(),
      getPartners(),
      getNews(),
      getEvents(),
      getStatistics(),
    ]);

  return (
    <>
      <Hero />
      <SupportedBy />
      <StatsStrip statistics={statistics} />
      <SchoolIntro />
      <AchievementsPreview achievements={achievements} />
      <AlumniPreview alumni={alumniList} statistics={statistics} />
      <PartnersPreview partners={partners} />
      <NewsPreview articles={news} />
      <EventsPreview events={events} />
      <AiPreview />
      <FinalCta />
    </>
  );
}
