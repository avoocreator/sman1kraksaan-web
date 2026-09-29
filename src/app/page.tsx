import { Hero } from "@/components/home/hero";
import { SupportedBy } from "@/components/home/supported-by";
import { AchievementsPreview } from "@/components/home/achievements-preview";
import { EventsPreview } from "@/components/home/events-preview";
import { AiPreview } from "@/components/home/ai-preview";
import { FinalCta } from "@/components/home/final-cta";
import ScheduleWidget from "@/components/home/ScheduleWidget";
import {
  getAchievements,
  getNews,
  getEvents,
} from "@/lib/api";

export default async function Home() {
  const [achievements, news, events] = await Promise.all([
    getAchievements(),
    getNews(),
    getEvents(),
  ]);

  return (
    <>
      {/* School Digital Hub + berita otomatis */}
      <Hero articles={news} />

      {/* Prestasi dibuat lebih awal */}
      <AchievementsPreview achievements={achievements} />

      {/* Tetap berada setelah bagian prestasi */}
      <SupportedBy />

      {/* Jadwal pelajaran per kelas */}
      <ScheduleWidget />

      {/* Pembatas visual sebelum agenda */}
      <div className="bg-surface-alt/40 py-3">
        <div className="container-page">
          <div className="h-px bg-border/70" />
        </div>
      </div>

      {/* Agenda mendatang */}
      <EventsPreview events={events} />

      {/* Sementara tetap dipertahankan */}
      <AiPreview />

      <FinalCta />
    </>
  );
}