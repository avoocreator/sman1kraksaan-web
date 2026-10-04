import { NextRequest, NextResponse } from "next/server";
import { clientIpFrom, recordVisit } from "@/lib/visits";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = clientIpFrom(req.headers);
  await recordVisit(ip);
  return new NextResponse(null, { status: 204 });
}
