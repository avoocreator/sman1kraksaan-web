import { NextResponse } from "next/server";

import { getTotalVisits } from "@/lib/visits";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TTL_MS = 20_000;
let cached: { total: number | null; at: number } | null = null;
let inflight: Promise<number | null> | null = null;

async function totalCached(): Promise<number | null> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.total;
  inflight ??= getTotalVisits({ fresh: true })
    .then((total) => {
      cached = total === null ? null : { total, at: Date.now() };
      return total;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function GET() {
  const total = await totalCached();
  return NextResponse.json(
    { total: typeof total === "number" ? total : 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
