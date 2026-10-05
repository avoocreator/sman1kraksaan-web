"use client";

import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import NowPanel from "@/components/schedule/NowPanel";
import { useNow, usePersisted } from "@/components/schedule/hooks";
import { chipClass, dayStats, liveState } from "@/components/schedule/shared";
import { useSchedule } from "@/components/schedule/context";

const LEVELS = ["X", "XI", "XII"] as const;

export default function ScheduleWidget() {
  const { classes, dayEntries, DAYS, fmt, scheduleDay, subjectInfo, teacherName } = useSchedule();
  const now = useNow();
  const [classIdx, setClassIdx] = usePersisted("sch:class", 0);
  const cls = classes[classIdx] ?? classes[0];

  const day = scheduleDay(now);
  const weekend = now !== null && (now.day === 0 || now.day === 6);
  const nowMin = now && now.day === day ? now.min : null;

  const entries = dayEntries({ classIdx: cls?.idx ?? 0 }, day);
  const s = liveState(entries, nowMin);
  const stats = dayStats(entries);

  if (classes.length === 0) {
    return (
      <section aria-labelledby="jadwal-beranda" className="py-16 sm:py-20">
        <div className="container-page">
          <h2 id="jadwal-beranda" className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Jadwal pelajaran
          </h2>
          <p className="mt-3 max-w-md text-ink-soft">
            Jadwal semua kelas akan tampil di sini begitu datanya sudah diisi di panel admin.
          </p>
        </div>
      </section>
    );
  }

  const upcoming = s.lessons
    .filter((e) => nowMin === null || e.from > nowMin)
    .slice(nowMin === null ? 1 : 0, nowMin === null ? 5 : 4);

  return (
    <section aria-labelledby="jadwal-beranda" className="py-16 sm:py-20">
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        <div>
          <h2 id="jadwal-beranda" className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {weekend ? "Jadwal Senin" : "Pelajaran hari ini"}
          </h2>
          <p className="mt-3 max-w-md text-ink-soft">
            Pilih kelasmu, lalu lihat pelajaran, jam, dan gurunya. Pilihan tersimpan di perangkat ini.
          </p>

          <div role="group" aria-label="Tingkat" className="mt-6 flex gap-2">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                aria-pressed={cls.level === lv}
                className={chipClass(cls.level === lv)}
                onClick={() => {
                  const c = classes.find((cl) => cl.level === lv);
                  if (c) setClassIdx(c.idx);
                }}
              >
                Kelas {lv}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Kelas" className="mt-3 flex flex-wrap gap-2">
            {classes
              .filter((c) => c.level === cls.level)
              .map((c) => (
                <button
                  key={c.idx}
                  aria-pressed={c.idx === cls.idx}
                  className={chipClass(c.idx === cls.idx)}
                  onClick={() => setClassIdx(c.idx)}
                >
                  {c.short}
                </button>
              ))}
          </div>

          <LinkButton href="/schedule" size="md" className="mt-8">
            Buka jadwal lengkap <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </LinkButton>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-4 shadow-lg shadow-ink/5 sm:p-6" aria-live="polite">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-lg font-bold text-ink">{cls.label}</p>
            <p className="text-sm text-ink-soft">
              {DAYS[day - 1]}
              {stats ? `, ${fmt(stats.from)}-${fmt(stats.to)}` : ""}
            </p>
          </div>

          {now === null ? (
            <div className="space-y-3" aria-hidden>
              <div className="h-40 animate-pulse rounded-2xl bg-surface-alt" />
              <div className="h-12 animate-pulse rounded-xl bg-surface-alt" />
              <div className="h-12 animate-pulse rounded-xl bg-surface-alt" />
            </div>
          ) : (
            <>
              <NowPanel entries={entries} nowMin={nowMin} show="class" />
              {upcoming.length > 0 && (
                <ul className="mt-4 divide-y divide-border">
                  {upcoming.map((e) => {
                    const info = subjectInfo(e.lesson.subject);
                    return (
                      <li key={`${e.lesson.start}-${e.lesson.subject}`} className="flex items-center gap-3 py-3">
                        <span
                          aria-hidden
                          className="h-8 w-1 shrink-0 rounded-full"
                          style={{ background: info.neutral ? "hsl(220 10% 60%)" : `hsl(${info.hue} 55% 48%)` }}
                        />
                        <span className="w-12 shrink-0 text-sm tabular-nums text-ink-soft">{fmt(e.from)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-ink">{info.name}</span>
                          {e.lesson.teacher && (
                            <span className="block truncate text-sm text-ink-soft">{teacherName(e.lesson.teacher)}</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}