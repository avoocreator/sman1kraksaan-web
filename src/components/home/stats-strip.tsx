"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Statistics } from "@/types";

function CountUp({ value, suffix = "+" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

export function StatsStrip({ statistics }: { statistics: Statistics }) {
  const items = [
    { label: "Prestasi", value: statistics.achievements },
    { label: "Alumni", value: statistics.alumni },
    { label: "Mitra Industri", value: statistics.partners },
    { label: "Program", value: statistics.programs },
  ];

  return (
    <section className="border-y border-border bg-surface">
      <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="text-center md:text-left"
          >
            <p className="text-3xl font-extrabold text-ink sm:text-4xl">
              <CountUp value={item.value} />
            </p>
            <p className="mt-1 text-sm text-ink-soft">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
