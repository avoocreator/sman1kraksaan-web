import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">{eyebrow}</p>
      )}
      <h2 className="text-balance text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-ink-soft">{description}</p>}
    </div>
  );
}
