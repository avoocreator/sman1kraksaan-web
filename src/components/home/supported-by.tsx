"use client";

import { motion } from "framer-motion";

const supporters = [
  {
    name: "JHIC",
    logo: "/supported-by/jhic.png",
  },
  {
    name: "Jagoan Hosting",
    logo: "/supported-by/jagoan-hosting.png",
  },
  {
    name: "Komdigi",
    logo: "/supported-by/komdigi.png",
  },
  {
    name: "Garuda Spark",
    logo: "/supported-by/garuda-spark.png",
  },
  {
    name: "Ngalup",
    logo: "/supported-by/ngalup.png",
  },
];

export function SupportedBy() {
  return (
    <section className="bg-bg py-8 md:py-10">
      <div className="container-page">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
            Supported by
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Didukung oleh ekosistem teknologi dan komunitas yang berkolaborasi
            dalam pengembangan talenta digital.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-5 md:gap-8">
          {supporters.map((supporter, index) => (
            <motion.div
              key={supporter.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
              }}
              className="group flex min-h-20 items-center justify-center"
            >
              <div className="flex h-20 w-full items-center justify-center px-4">
                <img
                  src={supporter.logo}
                  alt={supporter.name}
                  className="
                    max-h-14
                    max-w-[150px]
                    object-contain
                    grayscale
                    opacity-60
                    transition-all
                    duration-300
                    ease-out
                    group-hover:scale-105
                    group-hover:grayscale-0
                    group-hover:opacity-100
                  "
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}