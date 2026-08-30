import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Trophy, Users } from "lucide-react";
import { getAchievement, getAchievements } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { AchievementCard } from "@/components/achievements/achievement-card";

export async function generateStaticParams() {
  const achievements = await getAchievements();
  return achievements.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const achievement = await getAchievement(slug);
  if (!achievement) return {};
  return { title: achievement.title, description: achievement.description };
}

export default async function AchievementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const achievement = await getAchievement(slug);
  if (!achievement) notFound();

  const all = await getAchievements();
  const related = all.filter((a) => a.slug !== achievement.slug && a.category === achievement.category).slice(0, 4);

  return (
    <div className="container-page py-14 md:py-20">
      <Link href="/achievements" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Prestasi
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <div className="aspect-[16/10] overflow-hidden rounded-3xl border border-border">
            <img src={achievement.image} alt={achievement.title} className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-8 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{achievement.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{achievement.description}</p>
        </div>

        <div className="space-y-6 rounded-3xl border border-border bg-surface p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="orange">{achievement.category}</Badge>
            <Badge tone="blue">{achievement.level}</Badge>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted" />
              <span className="text-ink-soft">Tahun {achievement.year}</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="h-4 w-4 text-muted" />
              <span className="text-ink-soft">Tingkat {achievement.level}</span>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <span className="text-ink-soft">{achievement.participants.join(", ")}</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-ink">Prestasi Terkait</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {related.map((a, i) => (
              <AchievementCard achievement={a} key={a.slug} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
