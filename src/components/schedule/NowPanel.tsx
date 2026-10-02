import type { Entry } from "@/types/schedule";
import { useSchedule } from "@/components/schedule/context";
import { liveState, type LessonEntry } from "./shared";

type Props = {
  entries: Entry[];
  nowMin: number | null; // null = bukan hari ini
  show: "class" | "teacher";
};

function Quiet({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-alt/60 p-5 sm:p-6">
      <p className="text-lg font-semibold text-ink">{title}</p>
      <p className="mt-1 text-ink-soft">{text}</p>
    </div>
  );
}

export default function NowPanel({ entries, nowMin, show }: Props) {
  const { classes, fmt, subjectInfo, teacherName } = useSchedule();
  const s = liveState(entries, nowMin);
  const who = (e: LessonEntry, mode: Props["show"]) =>
    mode === "teacher" ? classes[e.lesson.classIdx]?.label ?? "" : teacherName(e.lesson.teacher);

  if (!s.first || !s.last) {
    return <Quiet title="Tidak ada pelajaran" text="Belum ada jadwal untuk hari ini." />;
  }
  if (nowMin === null) {
    return (
      <Quiet
        title={`Mulai pukul ${fmt(s.first.from)}`}
        text={`Pelajaran pertama: ${subjectInfo(s.first.lesson.subject).name}.`}
      />
    );
  }

  if (s.current) {
    const e = s.current;
    const pct = Math.min(100, Math.max(0, ((nowMin - e.from) / (e.to - e.from)) * 100));
    return (
      <div className="rounded-2xl bg-blue p-5 text-bg sm:p-6">
        <p className="flex items-center gap-2 text-sm font-medium text-bg/75">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(152_65%_55%)] opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[hsl(152_65%_55%)]" />
          </span>
          Sedang berlangsung
        </p>
        <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {subjectInfo(e.lesson.subject).name}
        </p>
        {who(e, show) && <p className="mt-1 text-bg/75">{who(e, show)}</p>}
        <div className="mt-6 flex items-center justify-between text-sm tabular-nums text-bg/75">
          <span>{fmt(e.from)}</span>
          <span className="font-medium text-bg">Sisa {e.to - nowMin} menit</span>
          <span>{fmt(e.to)}</span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg/20"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres pelajaran"
        >
          <div className="h-full rounded-full bg-bg transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        {s.next && (
          <p className="mt-5 border-t border-bg/15 pt-3 text-sm text-bg/75">
            Berikutnya pukul {fmt(s.next.from)}:{" "}
            <span className="font-medium text-bg">{subjectInfo(s.next.lesson.subject).name}</span>
          </p>
        )}
      </div>
    );
  }

  if (s.before) {
    return (
      <Quiet
        title={`Belum mulai, pukul ${fmt(s.first.from)}`}
        text={`Pelajaran pertama: ${subjectInfo(s.first.lesson.subject).name}.`}
      />
    );
  }
  if (s.after || !s.next) {
    return <Quiet title="Pelajaran hari ini sudah selesai" text="Sampai ketemu besok." />;
  }
  return (
    <Quiet
      title={s.onBreak && s.onBreak.kind === "break" ? s.onBreak.label : "Jam kosong"}
      text={`Berikutnya pukul ${fmt(s.next.from)}: ${subjectInfo(s.next.lesson.subject).name}.`}
    />
  );
}