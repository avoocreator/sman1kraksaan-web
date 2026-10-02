import { cn } from "@/lib/utils";

const logos = [
  { name: "JHIC", src: "/supported-by/jhic.png" },
  { name: "Jagoan Hosting", src: "/supported-by/jagoan-hosting.png" },
  { name: "Komdigi", src: "/supported-by/komdigi.png" },
  { name: "Garuda Spark", src: "/supported-by/garuda-spark.png" },
  { name: "Ngalup", src: "/supported-by/ngalup.png" },
];

type Props = {
  variant?: "strip" | "footer";
  className?: string;
};

function LogoList({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-8 gap-y-3", className)}>
      {logos.map((logo) => (
        <li key={logo.name}>
          <img
            src={logo.src}
            alt={logo.name}
            className="h-7 w-auto max-w-[8rem] object-contain sm:h-9"
          />
        </li>
      ))}
    </ul>
  );
}

export function SupportLogos({ variant = "strip", className }: Props) {
  if (variant === "footer") {
    return (
      <div className={className}>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Didukung oleh
        </p>
        <LogoList className="mt-3" />
      </div>
    );
  }

  return (
    <section
      aria-label="Didukung oleh"
      className={cn("border-y border-border bg-surface", className)}
    >
      <div className="container-page flex flex-col items-center gap-4 py-5 sm:flex-row sm:justify-between sm:gap-8">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted">
          Didukung oleh
        </p>
        <LogoList className="justify-center sm:justify-end" />
      </div>
    </section>
  );
}