import type { Metadata } from "next";
import { getCareerOpportunities } from "@/lib/api";
import { CareerExplorer } from "@/components/career/career-explorer";

export const metadata: Metadata = { title: "Karier & PKL", description: "Peluang magang, PKL, dan karier bersama mitra industri SMAN 1 Kraksaan." };

export default async function CareerPage() {
  const opportunities = await getCareerOpportunities();
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Karier & PKL</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Your Next Opportunity Starts Here.</h1>
      </div>
      <div className="mt-10">
        <CareerExplorer opportunities={opportunities} />
      </div>
    </div>
  );
}
