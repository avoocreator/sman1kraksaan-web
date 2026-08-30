import type { Metadata } from "next";
import { getAlumni } from "@/lib/api";
import { AlumniExplorer } from "@/components/alumni/alumni-explorer";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Jelajahi kisah alumni SMAN 1 Kraksaan di berbagai bidang dan lokasi.",
};

export default async function AlumniPage() {
  const alumni = await getAlumni();
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Alumni</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">From Here, To Everywhere.</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Temukan lulusan SMAN 1 Kraksaan yang kini berkarya di berbagai penjuru.
        </p>
      </div>
      <div className="mt-10">
        <AlumniExplorer alumni={alumni} />
      </div>
    </div>
  );
}
