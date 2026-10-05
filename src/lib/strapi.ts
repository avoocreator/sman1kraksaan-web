const BASE = process.env.STRAPI_URL?.replace(/\/$/, "");
const TOKEN = process.env.STRAPI_TOKEN;

export type StrapiMedia = { url?: string; alternativeText?: string | null };
export type StrapiRow = Record<string, unknown> & {
  id?: number;
  documentId?: string;
  slug?: string | null;
};

type ListMeta = { total?: number };

function headers(): Record<string, string> {
  return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
}

// fetch
async function strapiListOne<T extends StrapiRow>(
  path: string,
  revalidate: number,
  query = "",
): Promise<{ rows: T[]; meta: ListMeta } | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}/api/${path}?populate=*&pagination[pageSize]=100${query}`, {
      headers: headers(),
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        console.warn(`[strapi] ${res.status} pada /api/${path} — cek izin STRAPI_TOKEN.`);
      }
      return null;
    }
    const json = (await res.json()) as { data?: T[]; meta?: { pagination?: { total?: number } } };
    if (!Array.isArray(json.data)) return null;
    return { rows: json.data, meta: { total: json.meta?.pagination?.total } };
  } catch {
    return null;
  }
}

export async function strapiList<T extends StrapiRow>(
  paths: string | string[],
  revalidate = 60,
  query = "", // tambahan query string, mis. "&sort=createdAt:desc"
): Promise<T[] | null> {
  const candidates = Array.isArray(paths) ? paths : [paths];
  for (const path of candidates) {
    const result = await strapiListOne<T>(path, revalidate, query);
    if (result) return result.rows;
  }
  return null;
}

export async function strapiSingle<T extends StrapiRow>(
  paths: string | string[],
  revalidate = 300,
): Promise<T | null> {
  const candidates = Array.isArray(paths) ? paths : [paths];
  for (const path of candidates) {
    if (!BASE) return null;
    try {
      const res = await fetch(`${BASE}/api/${path}?populate=*`, {
        headers: headers(),
        next: { revalidate },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const json = (await res.json()) as { data?: T | null };
      if (json.data && typeof json.data === "object" && !Array.isArray(json.data)) {
        return json.data;
      }
    } catch {
      // lanjut ke kandidat berikutnya
    }
  }
  return null;
}

export async function strapiCount(
  paths: string | string[],
  revalidate = 300,
): Promise<number | null> {
  const candidates = Array.isArray(paths) ? paths : [paths];
  for (const path of candidates) {
    const result = await strapiListOne<StrapiRow>(path, revalidate);
    if (result) return result.meta.total ?? result.rows.length;
  }
  return null;
}

// util field
export function pick<T = unknown>(row: StrapiRow, ...keys: string[]): T | undefined {
  const hasValue = (v: unknown) => v !== undefined && v !== null && v !== "";
  for (const k of keys) {
    if (hasValue(row[k])) return row[k] as T;
  }
  for (const k of keys) {
    const target = k.toLowerCase();
    const hit = Object.keys(row).find((rk) => rk.toLowerCase() === target);
    if (hit && hasValue(row[hit])) return row[hit] as T;
  }
  return undefined;
}

export function txt(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  return "";
}

export function num(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n) && v.trim() !== "") return n;
  }
  return fallback;
}

export function arr(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v
      .map((item) =>
        typeof item === "string"
          ? item.trim()
          : typeof item === "object" && item !== null
            ? txt((item as Record<string, unknown>).text ?? (item as Record<string, unknown>).name ?? (item as Record<string, unknown>).label)
            : String(item ?? ""),
      )
      .filter(Boolean);
  }
  if (typeof v === "string") {
    return v
      .split(/\r?\n|,|;/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (v) return [txt(v)].filter(Boolean);
  return [];
}

// media
export function mediaUrl(media: unknown): string | undefined {
  const one = (m: unknown): string | undefined => {
    if (!m || typeof m !== "object") return undefined;
    const obj = m as StrapiMedia & { formats?: Record<string, { url?: string }> };
    const url = obj.url;
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${BASE ?? ""}${url}`;
  };
  if (Array.isArray(media)) return one(media[0]);
  if (
    media &&
    typeof media === "object" &&
    "data" in (media as Record<string, unknown>)
  ) {
    return mediaUrl((media as Record<string, unknown>).data);
  }
  return one(media);
}

export function firstMediaUrl(media?: StrapiMedia[] | null): string | undefined {
  return mediaUrl(media);
}

type BlockNode = { text?: string; children?: BlockNode[]; type?: string };

// rich text
export function blocksToText(blocks: unknown, max?: number): string {
  let text = "";
  if (Array.isArray(blocks)) {
    const walk = (n: BlockNode): string => n.text ?? (n.children ?? []).map(walk).join("");
    text = (blocks as BlockNode[]).map(walk).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  } else if (typeof blocks === "string") {
    text = blocks.replace(/\s+/g, " ").trim();
  }
  if (max !== undefined && text.length > max) {
    return `${text.slice(0, max - 1).trimEnd()}…`;
  }
  return text;
}

export function blocksToParagraphs(blocks: unknown): string[] {
  if (Array.isArray(blocks)) {
    const walk = (n: BlockNode): string => n.text ?? (n.children ?? []).map(walk).join("");
    const out = (blocks as BlockNode[])
      .filter((b) => b.type === undefined || b.type === "paragraph")
      .map(walk)
      .map((t) => t.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    if (out.length) return out;
    return blocksToText(blocks).split(/(?<=\.)\s+/).filter(Boolean);
  }
  if (typeof blocks === "string") {
    return blocks.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// tanggal
export function dateOnly(v: unknown, fallback?: string): string {
  const s = txt(v);
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return fallback ?? new Date().toISOString().slice(0, 10);
}

export function rowSlug(row: StrapiRow): string {
  return txt(pick(row, "slug")) || (row.documentId ?? String(row.id ?? ""));
}
