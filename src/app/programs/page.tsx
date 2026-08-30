import type { Metadata } from "next";
import { getPrograms } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Program Pendidikan", description: "Program peminatan dan pengembangan minat siswa SMAN 1 Kraksaan." };

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Program</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Program Pendidikan</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">Pilihan jalur peminatan yang dirancang untuk mengembangkan potensi setiap siswa.</p>
      </div>

      <div className="mt-12 space-y-6">
        {programs.map((p, i) => (
          <div key={p.slug} className="grid gap-6 rounded-3xl border border-border bg-surface p-6 md:grid-cols-[auto_1fr] md:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-soft text-lg font-bold text-orange">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="text-xl font-bold text-ink">{p.name}</h2>
              <Badge tone="blue" className="mt-2">{p.focus}</Badge>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.description}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Mata Pelajaran</p>
                  <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                    {p.subjects.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Fasilitas</p>
                  <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                    {p.facilities.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Peluang Karier</p>
                  <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                    {p.careers.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
