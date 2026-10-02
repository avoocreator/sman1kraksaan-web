import { cn } from "@/lib/utils";

// Lima logo pendukung (wajib ada semua) — versi footer: kecil, seragam,
// grayscale dengan warna kembali saat hover supaya footer tetap rapi.
const logos = [
  { name: "JHIC", src: "/supported-by/jhic.png" },
  { name: "Jagoan Hosting", src: "/supported-by/jagoan-hosting.png" },
  { name: "Komdigi", src: "/supported-by/komdigi.png" },
  { name: "Garuda Spark", src: "/supported-by/garuda-spark.png" },
  { name: "Ngalup", src: "/supported-by/ngalup.png" },
];

export function SupportLogos({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-7 gap-y-3", className)}>
      {logos.map((logo) => (
        <li key={logo.name} title={logo.name}>
          <img
            src={logo.src}
            alt={logo.name}
            loading="lazy"
            className="h-6 w-auto max-w-[6.5rem] object-contain opacity-55 grayscale transition duration-300 hover:scale-105 hover:opacity-100 hover:grayscale-0 sm:h-7"
          />
        </li>
      ))}
    </ul>
  );
}
