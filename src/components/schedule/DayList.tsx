import type { CSSProperties } from "react";
import type { Entry } from "@/types/schedule";
import { classes, fmt, subjectInfo, teacherName } from "@/lib/schedule";

type Props = {
  entries: Entry[];
  show: "class" | "teacher"; // info kedua di tiap blok: nama guru atau nama kelas
  nowMin: number | null; // null = bukan hari ini
};

export default function DayList({ entries, show, nowMin }: Props) {
  if (entries.length === 0) {
    return <p className="py-10 text-slate-600">Tidak ada pelajaran di hari ini.</p>;
  }

  return (
    <ol className="border-y border-slate-200">
      {entries.map((e, i) => {
        const active = nowMin !== null && nowMin >= e.from && nowMin < e.to;
        const done = nowMin !== null && nowMin >= e.to;
        const time = (
          <div className="py-3 text-sm tabular-nums text-slate-500">
            {fmt(e.from)}
            <br />
            {fmt(e.to)}
          </div>
        );

        if (e.kind === "break") {
          return (
            <li
              key={i}
              className={`grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-dashed border-slate-300 bg-slate-50 ${done ? "opacity-50" : ""}`}
            >
              {time}
              <p className={`self-center text-sm ${active ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                {e.label}
                {active ? " sedang berlangsung" : ""}
              </p>
            </li>
          );
        }

        if (e.kind === "gap") {
          return (
            <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-slate-100">
              {time}
              <p className="self-center text-sm text-slate-400">Kosong {e.count} jam</p>
            </li>
          );
        }

        const l = e.lesson;
        const info = subjectInfo(l.subject);
        const second = show === "teacher" ? classes[l.classIdx].label : teacherName(l.teacher);
        const pct = active ? Math.round(((nowMin! - e.from) / (e.to - e.from)) * 100) : 0;

        return (
          <li
            key={i}
            aria-current={active ? "time" : undefined}
            className={`grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-slate-200 first:border-t-0 ${done ? "opacity-50" : ""}`}
            style={{ minHeight: `${l.span * 3.5}rem` }}
          >
            {time}
            <div
              style={{ "--h": info.hue } as CSSProperties}
              className={`relative my-2 border-l-4 py-2 pl-4 pr-2 ${
                info.neutral ? "border-slate-400" : "border-[hsl(var(--h)_55%_45%)]"
              } ${active ? (info.neutral ? "bg-slate-100" : "bg-[hsl(var(--h)_70%_95%)]") : ""}`}
            >
              <p className="text-base font-semibold text-slate-900">{info.name}</p>
              {second && <p className="text-sm text-slate-600">{second}</p>}
              {l.span > 1 && <p className="text-sm text-slate-500">{l.span} jam pelajaran</p>}
              {active && (
                <>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    Sedang berlangsung, sisa {e.to - nowMin!} menit
                  </p>
                  <span
                    aria-hidden
                    className={`absolute bottom-0 left-0 h-0.5 motion-safe:transition-[width] ${
                      info.neutral ? "bg-slate-500" : "bg-[hsl(var(--h)_55%_45%)]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}