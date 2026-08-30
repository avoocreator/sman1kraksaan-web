import { Hero } from "@/components/home/hero";
import { StatsStrip } from "@/components/home/stats-strip";
import { SchoolIntro } from "@/components/home/school-intro";
import { AchievementsPreview } from "@/components/home/achievements-preview";
import { AlumniPreview } from "@/components/home/alumni-preview";
import { PartnersPreview } from "@/components/home/partners-preview";
import { CareerPreview } from "@/components/home/career-preview";
import { NewsPreview } from "@/components/home/news-preview";
import { EventsPreview } from "@/components/home/events-preview";
import { AiPreview } from "@/components/home/ai-preview";
import { FinalCta } from "@/components/home/final-cta";
import {
  getAchievements,
  getAlumni,
  getPartners,
  getCareerOpportunities,
  getNews,
  getEvents,
  getStatistics,
} from "@/lib/api";

export default async function Home() {
  const [achievements, alumniList, partners, careers, news, events, statistics] =
    await Promise.all([
      getAchievements(),
      getAlumni(),
      getPartners(),
      getCareerOpportunities(),
      getNews(),
      getEvents(),
      getStatistics(),
    ]);

  return (
    <>
      <Hero />
      <StatsStrip statistics={statistics} />
      <SchoolIntro />
      <AchievementsPreview achievements={achievements} />
      <AlumniPreview alumni={alumniList} statistics={statistics} />
      <PartnersPreview partners={partners} />
      <CareerPreview opportunities={careers} />
      <NewsPreview articles={news} />
      <EventsPreview events={events} />
      <AiPreview />
      <FinalCta />
    </>
  );
}
