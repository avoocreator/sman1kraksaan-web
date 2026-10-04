
import { createHash } from "node:crypto";

import type { StrapiRow } from "@/lib/strapi";

export const SESSION_MINUTES = 60;

function strapiBase(): string | undefined {
  return process.env.STRAPI_URL?.replace(/\/$/, "");
}

function readToken(): string | undefined {
  return process.env.STRAPI_TOKEN?.trim() || undefined;
}

function writeToken(): string | undefined {
  return process.env.STRAPI_WRITE_TOKEN?.trim() || process.env.STRAPI_TOKEN?.trim() || undefined;
}

export function hashVisitor(ip: string): string {
  const salt = process.env.VISIT_SALT?.trim() || "sman1kraksaan-visit-v1";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function clientIpFrom(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

function minutesBetween(iso: string, now: number): number {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return (now - t) / 60_000;
}

const THROTTLE_MS = 5 * 60_000;
const lastPing = new Map<string, number>();

type Validation = { invalid: string[]; missing: string[]; message: string };

// validasi
function parseValidation(body: unknown): Validation {
  const invalid: string[] = [];
  const missing: string[] = [];
  let message = "";
  const visit = (node: unknown, depth = 0) => {
    if (depth > 4 || !node || typeof node !== "object") return;
    const o = node as Record<string, unknown>;
    const msg = typeof o.message === "string" ? o.message : "";
    const path = Array.isArray(o.path)
      ? o.path.filter((p) => typeof p === "string").join(".")
      : typeof o.path === "string"
        ? o.path
        : "";
    const scalarKey = typeof o.key === "string" ? o.key : "";
    if (msg) {
      if (!message) message = msg;
      const key =
        path ||
        scalarKey ||
        msg.match(/invalid key\s*["']?([\w-]+)/i)?.[1] ||
        msg.match(/["']?([\w-]+)["']?\s+must be defined/i)?.[1] ||
        msg.match(/["']?([\w-]+)["']?\s+is invalid/i)?.[1] ||
        "";
      if (/invalid key|is invalid/i.test(msg) && key) invalid.push(key);
      else if (/must be defined/i.test(msg) && key) missing.push(key);
    }
    for (const child of Object.values(o)) if (child && typeof child === "object") visit(child, depth + 1);
  };
  visit(body);
  return { invalid: [...new Set(invalid)], missing: [...new Set(missing)], message };
}

// tulis strapi
async function mutateVisit(
  method: "POST" | "PUT",
  url: string,
  token: string,
  buildPayload: () => Record<string, unknown>,
  fillValue: (key: string) => unknown,
): Promise<boolean> {
  const payload = buildPayload();
  for (let attempt = 0; attempt < 3; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
    } catch (err) {
      console.warn(`[visit] ${method} ${url} gagal jaringan:`, String(err));
      return false;
    }
    if (res.ok) return true;
    if (res.status === 401 || res.status === 403) {
      console.warn(
        `[visit] ${res.status} pada ${method} visit-logs — token tidak punya izin ` +
          `${method === "POST" ? "create" : "update"} Visit Log. Perbaiki: Strapi → Settings → ` +
          `API Tokens → centang ${method === "POST" ? "create" : "update"} untuk Visit log → Save.`,
      );
      return false;
    }
    if (res.status !== 400 && res.status !== 422) {
      console.warn(`[visit] ${res.status} tak terduga pada ${method} visit-logs`);
      return false;
    }
    const body = (await res.json().catch(() => ({}))) as unknown;
    const { invalid, missing, message } = parseValidation(body);
    if (invalid.length === 0 && missing.length === 0) {
      console.warn(`[visit] 400 pada ${method} visit-logs: ${message || "validasi gagal"}`);
      return false;
    }
    for (const key of invalid) delete payload[key];
    let filled = 0;
    for (const key of missing) {
      if (payload[key] === undefined) {
        const value = fillValue(key);
        if (value !== undefined) {
          payload[key] = value;
          filled++;
        }
      }
    }
    if (invalid.length === 0 && filled === 0) {
      console.warn(`[visit] 400 berulang pada ${method} visit-logs: ${message}`);
      return false;
    }
    if (attempt >= 2) {
      console.warn(`[visit] ${method} visit-logs: adaptasi mencapai batas — menyerah.`);
      return false;
    }
  }
  return false;
}

// pencatatan
export async function recordVisit(ip: string | null): Promise<void> {
  const BASE = strapiBase();
  const token = writeToken();
  if (!BASE || !token || !ip) return;
  const visitor = hashVisitor(ip);
  const nowMs = Date.now();
  if (nowMs - (lastPing.get(visitor) ?? 0) < THROTTLE_MS) return;
  lastPing.set(visitor, nowMs);
  if (lastPing.size > 5000) lastPing.clear();
  const nowIso = new Date(nowMs).toISOString();

  try {
    const q = new URLSearchParams({
      "filters[visitor][$eq]": visitor,
      "sort[0]": "lastActiveAt:desc",
      "pagination[pageSize]": "1",
    });
    const res = await fetch(`${BASE}/api/visit-logs?${q.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const json = (await res.json().catch(() => ({}))) as { data?: StrapiRow[] };
      const hit = json.data?.[0];
      const lastActive = txtOf(hit?.lastActiveAt) || txtOf(hit?.startedAt);
      if (hit?.documentId && lastActive && minutesBetween(lastActive, Date.now()) < SESSION_MINUTES) {
        await mutateVisit(
          "PUT",
          `${BASE}/api/visit-logs/${hit.documentId}`,
          token,
          () => ({ lastActiveAt: nowIso }),
          () => nowIso,
        );
        return;
      }
    }

    await mutateVisit(
      "POST",
      `${BASE}/api/visit-logs`,
      token,
      () => ({ visitor, startedAt: nowIso, lastActiveAt: nowIso, publishedAt: nowIso }),
      (key) => {
        const k = key.toLowerCase();
        if (k === "visitor" || k.includes("visitor")) return visitor;
        if (k.includes("started") || k.includes("lastactive") || k.includes("published")) return nowIso;
        return undefined;
      },
    );
  } catch {
    // Penghitung tidak boleh mengganggu situs — abaikan kegagalan.
  }
}

function txtOf(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export async function getTotalVisits(
  opts: { fresh?: boolean } = {},
): Promise<number | null> {
  const BASE = strapiBase();
  if (!BASE) return null;
  const cacheInit: RequestInit = opts.fresh
    ? { cache: "no-store" }
    : { next: { revalidate: 300 } };
  const tokens = [...new Set([readToken(), writeToken()].filter(Boolean))];
  for (const token of tokens) {
    try {
      const res = await fetch(`${BASE}/api/visit-logs?pagination[pageSize]=1`, {
        headers: { Authorization: `Bearer ${token}` },
        ...cacheInit,
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const json = (await res.json().catch(() => ({}))) as {
        meta?: { pagination?: { total?: number } };
      };
      const total = json.meta?.pagination?.total;
      if (typeof total === "number") return total;
    } catch {
      // lanjut ke token berikutnya
    }
  }
  return null;
}
