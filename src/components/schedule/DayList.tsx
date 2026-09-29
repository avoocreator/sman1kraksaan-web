import { Clock, User, Users } from "lucide-react";
import type { Entry } from "@/types/schedule";
import { classes, fmt, subjectInfo, teacherName } from "@/lib/schedule";

type Props = {
  entries: Entry[];
  show: "class" | "teacher"; // info kedua di tiap blok
  nowMin: number | null; // null = bukan hari ini
};

export default function DayList({ entries, show, nowMin }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-4 py-14 text-center text-ink-soft">
        Tidak ada pelajaran di hari ini.
      </div>
    );
  }

  return (
    <ol className="space-y-2.5">
      {entries.map((e, i) => {
        const active = nowMin !== null && nowMin >= e.from && nowMin < e.to;
        const done = nowMin !== null && nowMin >= e.to;

        if (e.kind === "break") {
          return (
            <li
              key={i}
              className={`flex items-center gap-3 py-0.5 pl-[4.25rem] text-xs ${
                active ? "font-semibold text-ink" : "text-muted"
              } ${done ? "opacity-60" : ""}`}
            >
              <span className="h-px flex-1 bg-border" />
              <span>
                {e.label} {fmt(e.from)}-{fmt(e.to)}
                {active ? ", sedang berlangsung" : ""}
              </span>
              <span className="h-px flex-1 bg-border" />
            </li>
          );
        }

        if (e.kind === "gap") {
          return (
            <li key={i} className="grid grid-cols-[3.25rem_1fr] gap-3">
              <time className="pt-2 text-sm tabular-nums text-muted">{fmt(e.from)}</time>
              <p className="rounded-xl border border-dashed border-border px-4 py-2 text-sm text-muted">
                Kosong {e.count} jam
              </p>
            </li>
          );
        }

        const l = e.lesson;
        const info = subjectInfo(l.subject);
        const second = show === "teacher" ? classes[l.classIdx].label : teacherName(l.teacher);
        const accent = info.neutral ? "hsl(220 10% 55%)" : `hsl(${info.hue} 55% 48%)`;
        const tint = info.neutral ? "hsl(220 14% 96%)" : `hsl(${info.hue} 70% 96%)`;
        const pct = active ? ((nowMin! - e.from) / (e.to - e.from)) * 100 : 0;

        return (
          <li key={i} className="grid grid-cols-[3.25rem_1fr] gap-3" aria-current={active ? "time" : undefined}>
            <time className={`pt-3.5 text-sm tabular-nums ${active ? "font-bold text-ink" : "text-ink-soft"}`}>
              {fmt(e.from)}
            </time>
            <div
              className={`relative overflow-hidden rounded-xl border border-border border-l-4 bg-surface px-4 py-3 ${
                active ? "ring-2 ring-ink" : ""
              } ${done ? "opacity-55" : ""}`}
              style={{ borderLeftColor: accent, minHeight: `${l.span * 3.75}rem` }}
            >
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 transition-[width] duration-700"
                  style={{ width: `${pct}%`, background: tint }}
                />
              )}
              <div className="relative flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <p className="text-base font-semibold text-ink sm:text-lg">{info.name}</p>
                <p className="flex items-center gap-1.5 text-sm tabular-nums text-ink-soft">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {fmt(e.from)}-{fmt(e.to)}
                  {l.span > 1 && (
                    <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs font-medium text-ink-soft">
                      {l.span} jam
                    </span>
                  )}
                </p>
              </div>
              {second && (
                <p className="relative mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                  {show === "teacher" ? <Users className="h-3.5 w-3.5" aria-hidden /> : <User className="h-3.5 w-3.5" aria-hidden />}
                  {second}
                </p>
              )}
              {active && (
                <p className="relative mt-2 text-sm font-medium text-ink">
                  Sedang berlangsung, sisa {e.to - nowMin!} menit
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}