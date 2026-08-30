import type { Metadata } from "next";
import { getAchievements } from "@/lib/api";
import { AchievementsExplorer } from "@/components/achievements/achievements-explorer";

export const metadata: Metadata = {
  title: "Prestasi",
  description: "Jejak rekam keingintahuan, disiplin, dan keunggulan siswa SMAN 1 Kraksaan.",
};

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Prestasi</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Achievements</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          A record of curiosity, discipline, and excellence.
        </p>
      </div>
      <div className="mt-10">
        <AchievementsExplorer achievements={achievements} />
      </div>
    </div>
  );
}
