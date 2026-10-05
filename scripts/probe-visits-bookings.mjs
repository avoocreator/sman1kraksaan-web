/**
 * Probe CMS: cek kondisi CT visit-logs & facility-bookings saat ini.
 * Jalankan: node --env-file=repo/.env scripts/probe-visits-bookings.mjs
 */
const BASE = (process.env.STRAPI_URL || "").replace(/\/$/, "");
const TOKEN = process.env.STRAPI_TOKEN || "";

async function probe(path) {
  try {
    const res = await fetch(`${BASE}/api/${path}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      signal: AbortSignal.timeout(10000),
    });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, json };
  } catch (e) {
    return { status: 0, error: String(e) };
  }
}

const visits = await probe("visit-logs?pagination[pageSize]=1");
console.log("== visit-logs ==");
console.log("status:", visits.status);
if (visits.json?.meta) console.log("total:", visits.json.meta?.pagination?.total);
if (visits.json?.error) console.log("error:", visits.json.error?.message ?? visits.json.error);

const bookings = await probe("facility-bookings?pagination[pageSize]=3&sort[0]=createdAt:desc");
console.log("\n== facility-bookings ==");
console.log("status:", bookings.status);
console.log("total:", bookings.json?.meta?.pagination?.total);
if (bookings.json?.error) console.log("error:", bookings.json.error?.message ?? bookings.json.error);
if (Array.isArray(bookings.json?.data) && bookings.json.data.length > 0) {
  const row = bookings.json.data[0];
  console.log("fields contoh entri pertama:", Object.keys(row).filter((k) => k !== "attributes"));
  for (const r of bookings.json.data) {
    const d = r;
    console.log("-", d.bookingCode ?? r.bookingCode, "|", d.facility ?? r.facility, "|", d.date, d.startTime, "-", d.endTime, "| status:", d.status ?? "(kosong)");
  }
}
