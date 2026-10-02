import type { Metadata } from "next";
import JelajahiView from "@/components/explore/jelajahi-view";
import { getSchoolRooms } from "@/lib/api";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Jelajahi Sekolah | SMAN 1 Kraksaan",
  description: "Peta virtual interaktif SMAN 1 Kraksaan: klik ruangan untuk melihat detail dan fotonya.",
};

export default async function JelajahiPage() {
  // Ruangan dari Strapi (content type `jelajahis`); kalau belum ada,
  // data peta bawaan repo yang dipakai.
  const { floor1, floor2 } = await getSchoolRooms();

  return <JelajahiView floor1Rooms={floor1} floor2Rooms={floor2} />;
}
