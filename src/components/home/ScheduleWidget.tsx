"use client";

import Link from "next/link";
import type { Entry } from "@/types/schedule";
import { useNow, usePersisted } from "@/components/schedule/hooks";
import {
  classes, dayEntries, DAYS, fmt, scheduleDay, subjectInfo, teacherName,
} from "@/lib/schedule";

type LessonEntry = Extract<Entry, { kind: "lesson" }>;

export default function ScheduleWidget() {
  const now = useNow();
  const [classIdx, setClassIdx] = usePersisted("sch:class", 0);
  const cls = classes[classIdx] ?? classes[0];

  const day = scheduleDay(now);
  const weekend = now !== null && (now.day === 0 || now.day === 6);
  const nowMin = now && now.day === day ? now.min : null;

  const rest = dayEntries({ classIdx: cls.idx }, day).filter(
    (e): e is LessonEntry => e.kind === "lesson" && (nowMin === null || e.to > nowMin),
  );

  return (
    <section aria-labelledby="jadwal-beranda" className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="jadwal-beranda" className="text-2xl font-bold tracking-tight text-slate-900">
            {weekend ? "Jadwal Senin" : `Jadwal hari ini, ${DAYS[day - 1]}`}
          </h2>
          <p className="mt-1 text-slate-600">Pilih kelasmu, pelajaran berikutnya langsung kelihatan.</p>
        </div>
        <label className="text-sm font-medium text-slate-700">
          <span className="sr-only">Kelas</span>
          <select
            value={cls.idx}
            onChange={(e) => setClassIdx(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {(["X", "XI", "XII"] as const).map((lv) => (
              <optgroup key={lv} label={`Kelas ${lv}`}>
                {classes.filter((c) => c.level === lv).map((c) => (
                  <option key={c.idx} value={c.idx}>{c.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 min-h-[14rem] border-y border-slate-200">
        {now === null ? (
          <p className="py-6 text-slate-500">Memuat jadwal...</p>
        ) : rest.length === 0 ? (
          <p className="py-6 text-slate-600">Pelajaran hari ini sudah selesai.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {rest.slice(0, 4).map((e) => {
              const l = e.lesson;
              const info = subjectInfo(l.subject);
              const active = nowMin !== null && nowMin >= e.from;
              return (
                <li key={`${l.start}-${l.subject}`} className="grid grid-cols-[4.5rem_1fr] gap-x-4 py-3">
                  <span className="text-sm tabular-nums text-slate-500">
                    {fmt(e.from)}
                    <br />
                    {fmt(e.to)}
                  </span>
                  <span>
                    <span className="font-semibold text-slate-900">{info.name}</span>
                    {active && <span className="ml-2 text-sm font-medium text-emerald-700">Sedang berlangsung</span>}
                    <span className="block text-sm text-slate-600">{teacherName(l.teacher)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Link
        href="/schedule"
        className="mt-4 inline-block text-sm font-semibold text-slate-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Buka jadwal lengkap
      </Link>
    </section>
  );
}