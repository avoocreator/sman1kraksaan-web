// Helper kecil untuk membaca data dari Strapi (v5, respons datar) di server.
const BASE = process.env.STRAPI_URL?.replace(/\/$/, "");
const TOKEN = process.env.STRAPI_TOKEN;

export type StrapiMedia = { url?: string; alternativeText?: string | null };

/** Ambil koleksi dari Strapi. Mengembalikan null kalau gagal, supaya halaman tetap tampil. */
export async function strapiList<T>(path: string, revalidate = 60): Promise<T[] | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}/api/${path}`, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
      next: { revalidate },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T[] };
    return Array.isArray(json.data) ? json.data : null;
  } catch {
    return null;
  }
}

/** URL gambar pertama dari field media (relatif atau absolut). */
export function firstMediaUrl(media?: StrapiMedia[] | null): string | undefined {
  const url = media?.[0]?.url;
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${BASE ?? ""}${url}`;
}

type BlockNode = { text?: string; children?: BlockNode[] };

/** Ubah field Rich text (Blocks) menjadi teks biasa. */
export function blocksToText(blocks: unknown, max = 140): string {
  if (!Array.isArray(blocks)) return "";
  const walk = (n: BlockNode): string => n.text ?? (n.children ?? []).map(walk).join("");
  const text = (blocks as BlockNode[]).map(walk).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}