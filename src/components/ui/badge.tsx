import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "orange",
  className,
}: {
  children: React.ReactNode;
  tone?: "orange" | "blue" | "neutral";
  className?: string;
}) {
  const tones = {
    orange: "bg-orange-soft text-orange-dark",
    blue: "bg-blue-soft text-blue",
    neutral: "bg-surface-alt text-ink-soft",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
