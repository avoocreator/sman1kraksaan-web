import Link from "next/link";
import { ArrowRight } from "lucide-react";

const pins = [
  { x: 118, y: 92 },
  { x: 262, y: 168 },
  { x: 176, y: 236 },
];

export function MapTeaser() {
  return (
    <section aria-labelledby="peta-beranda" className="pb-16 sm:pb-20">
      <div className="container-page">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-ink p-6 text-bg sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-bg/60">Peta virtual</p>
            <h2
              id="peta-beranda"
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Keliling sekolah sebelum datang
            </h2>
            <p className="mt-3 max-w-md text-bg/75">
              Lihat denah dan titik-titik penting SMAN 1 Kraksaan lewat peta virtual, dari HP atau laptop.
            </p>
            <Link
              href="/jelajahi"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-bg px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
            >
              Buka peta <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {/* Ilustrasi denah abstrak, bukan denah sekolah yang sebenarnya */}
          <div className="relative mx-auto w-full max-w-md" aria-hidden>
            <svg viewBox="0 0 360 300" className="h-auto w-full" fill="none">
              <g stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.5">
                <rect x="24" y="24" width="150" height="90" rx="10" />
                <rect x="190" y="24" width="146" height="58" rx="10" />
                <rect x="190" y="98" width="146" height="110" rx="10" />
                <rect x="24" y="130" width="150" height="78" rx="10" />
                <rect x="24" y="224" width="312" height="52" rx="10" />
              </g>
              <g stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="4 6">
                <path d="M99 114v16M263 82v16M99 208v16" />
              </g>
            </svg>
            {pins.map((p) => (
              <span
                key={`${p.x}-${p.y}`}
                className="absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(p.x / 360) * 100}%`, top: `${(p.y / 300) * 100}%` }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(152_65%_55%)] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[hsl(152_65%_55%)]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}