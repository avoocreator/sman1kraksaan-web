/**
 * Mock Strapi untuk verifikasi alur pemesanan & kunjungan TANPA menyentuh
 * CMS produksi. Dipakai oleh scripts/test-bookings-visits.ts (bun).
 *
 * Endpoint yang ditiru (respons bentuk Strapi v5):
 *   GET    /api/facility-bookings          (token baca/tulis)
 *   POST   /api/facility-bookings          (wajib token tulis)
 *   PUT    /api/facility-bookings/:docId   (wajib token tulis)
 *   GET    /api/visit-logs[?filters...]    (token baca/tulis)
 *   POST   /api/visit-logs                 (wajib token tulis)
 *   PUT    /api/visit-logs/:docId          (wajib token tulis)
 *   POST   /__reset                        (alat tes: kosongkan data)
 */

const READ = "test-read";
const WRITE = "test-write";

/** Status enum — POST dengan status di luar ini ditolak 400 (meniru CT nyata). */
const ENUM_STATUS = ["Menunggu", "Disetujui", "Ditolak", "Selesai"];

const state = {
  bookings: [],
  visits: [],
  seq: 0,
};

function reset() {
  state.bookings = [];
  state.visits = [];
  state.seq = 0;
}

function authOk(req, needWrite) {
  const h = req.headers.get("authorization") || "";
  const token = h.replace(/^Bearer\s+/i, "");
  if (needWrite) return token === WRITE;
  return token === READ || token === WRITE;
}

function json(data, status = 200) {
  // no-store: cegah Bun's fetch cache menelan respons GET saat pengujian
  // (di produksi caching dikatur Next Data Cache, bukan header respons).
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function paginated(rows) {
  return { data: rows, meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: rows.length } } };
}

export function startMockStrapi(port = 4599) {
  return Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      const path = url.pathname;
      const needWrite = req.method !== "GET";
      if (!authOk(req, needWrite)) {
        return json(
          { data: null, error: { status: 403, name: "ForbiddenError", message: "Forbidden" } },
          403,
        );
      }

      // --- alat tes ---
      if (path === "/__reset" && req.method === "POST") {
        reset();
        return json({ ok: true });
      }

      // --- facility-bookings ---
      if (path === "/api/facility-bookings" && req.method === "GET") {
        return json(paginated(state.bookings));
      }
      if (path === "/api/facility-bookings" && req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        const data = body.data ?? {};
        if (data.status !== undefined && !ENUM_STATUS.includes(data.status)) {
          return json({ data: null, error: { status: 400, message: "Invalid enum status" } }, 400);
        }
        state.seq += 1;
        const row = {
          id: state.seq,
          documentId: `fb-doc-${state.seq}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.bookings.push(row);
        return json({ data: row }, 201);
      }
      const fbMatch = path.match(/^\/api\/facility-bookings\/([^/]+)$/);
      if (fbMatch && req.method === "PUT") {
        const row = state.bookings.find((r) => r.documentId === fbMatch[1]);
        if (!row) return json({ data: null, error: { status: 404, message: "Not found" } }, 404);
        const body = await req.json().catch(() => ({}));
        Object.assign(row, body.data ?? {});
        return json({ data: row });
      }

      // --- visit-logs ---
      if (path === "/api/visit-logs" && req.method === "GET") {
        const visitor = url.searchParams.get("filters[visitor][$eq]");
        let rows = state.visits;
        if (visitor !== null) rows = rows.filter((r) => r.visitor === visitor);
        rows = [...rows].sort((a, b) => (b.lastActiveAt || "").localeCompare(a.lastActiveAt || ""));
        // Semantik Strapi: total = jumlah SEMUA kecocokan (sebelum slicing).
        const total = rows.length;
        const pageSize = Number(url.searchParams.get("pagination[pageSize]") || 100);
        const sliced = rows.slice(0, Number.isFinite(pageSize) && pageSize > 0 ? pageSize : rows.length);
        return json({
          data: sliced,
          meta: { pagination: { page: 1, pageSize, pageCount: Math.ceil(total / pageSize) || 1, total } },
        });
      }
      if (path === "/api/visit-logs" && req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        state.seq += 1;
        const row = {
          id: state.seq,
          documentId: `vl-doc-${state.seq}`,
          ...(body.data ?? {}),
          createdAt: new Date().toISOString(),
        };
        state.visits.push(row);
        return json({ data: row }, 201);
      }
      const vlMatch = path.match(/^\/api\/visit-logs\/([^/]+)$/);
      if (vlMatch && req.method === "PUT") {
        const row = state.visits.find((r) => r.documentId === vlMatch[1]);
        if (!row) return json({ data: null, error: { status: 404, message: "Not found" } }, 404);
        const body = await req.json().catch(() => ({}));
        Object.assign(row, body.data ?? {});
        return json({ data: row });
      }

      return json({ data: null, error: { status: 404, message: `Endpoint tidak dikenal: ${req.method} ${path}` } }, 404);
    },
  });
}
