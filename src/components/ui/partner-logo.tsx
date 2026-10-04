"use client";

import { useState } from "react";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export function PartnerLogo({
  name,
  logo,
  className = "h-12 w-12",
}: {
  name: string;
  logo?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      <span
        aria-hidden
        className={`flex ${className} items-center justify-center overflow-hidden bg-white`}
      >
        <img
          src={logo}
          alt={`Logo ${name}`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={`flex ${className} items-center justify-center rounded-xl bg-surface-alt text-lg font-bold text-ink`}
    >
      {initialsOf(name)}
    </span>
  );
}
