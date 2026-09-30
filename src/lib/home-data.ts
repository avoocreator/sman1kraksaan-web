import type { ProgramItem } from "@/components/home/programs-preview";
import type { AlumniItem } from "@/components/home/alumni-preview";
import type { PartnerItem } from "@/components/home/partners-preview";
import { blocksToText, firstMediaUrl, strapiList } from "@/lib/strapi";
import type { StrapiMedia } from "@/lib/strapi";

// Setiap fungsi mengembalikan undefined kalau Strapi tidak bisa dijangkau atau
// masih kosong. Komponen lalu memakai data contoh bawaannya.

type StrapiProgram = { title?: string; level?: string; icon?: string; description?: unknown; decription?: unknown };
type StrapiAlumnus = {
  name?: string; graduationYear?: string; university?: string; major?: string;
  admissionPath?: string; featured?: boolean; media?: StrapiMedia[];
};
type StrapiPartner = { title?: string; partnerType?: string; decription?: unknown; description?: unknown };

export async function getHomePrograms(): Promise<ProgramItem[] | undefined> {
  const rows = await strapiList<StrapiProgram>("programs?sort=createdAt:asc&pagination[pageSize]=7");
  const items = (rows ?? [])
    .filter((r) => r.title)
    .map((r) => ({
      title: r.title as string,
      level: r.level ?? "",
      desc: blocksToText(r.description ?? r.decription, 130),
      icon: r.icon ?? "book",
    }));
  return items.length ? items : undefined;
}

export async function getHomeAlumni(): Promise<AlumniItem[] | undefined> {
  const rows = await strapiList<StrapiAlumnus>(
    "alumni-profiles?populate=media&sort=createdAt:desc&pagination[pageSize]=9",
  );
  const items = (rows ?? [])
    .filter((r) => r.name && r.featured !== false)
    .slice(0, 3)
    .map((r) => ({
      name: r.name as string,
      year: r.graduationYear ?? "",
      university: r.university ?? "",
      major: r.major ?? "",
      path: r.admissionPath ?? "",
      photo: firstMediaUrl(r.media),
    }));
  return items.length ? items : undefined;
}

export async function getHomePartners(): Promise<PartnerItem[] | undefined> {
  const rows = await strapiList<StrapiPartner>("partners?sort=createdAt:asc&pagination[pageSize]=8");
  const items = (rows ?? [])
    .filter((r) => r.title)
    .slice(0, 4)
    .map((r) => ({
      name: r.title as string,
      type: r.partnerType ?? "Mitra",
      note: blocksToText(r.decription ?? r.description, 90),
    }));
  return items.length ? items : undefined;
}