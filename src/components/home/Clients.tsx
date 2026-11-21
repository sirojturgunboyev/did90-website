"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import type { Home } from "@/lib/queries";

/** Four grey boxes; each cycles through a quarter of the client logos every 4s. */
export function Clients({ clients }: { clients: Home["clients"] }) {
  const logos = clients.filter((c) => c.logo?.asset);
  const columns = [0, 1, 2, 3].map((col) => logos.filter((_, i) => i % 4 === col));
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);
  // TEMP: Framer shablonidagi namuna logotiplar — CMS'da logotip bo'lmasa ko'rsatiladi.
  if (!logos.length) {
    return (
      <section className="grid grid-cols-2 gap-[5px] py-[5px] desktop:grid-cols-4" aria-label="Clients">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="grid h-[70px] place-items-center rounded-[10px] bg-grey-03 px-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/placeholder-logos/logo-${n}.svg`} alt="" className="h-[30px] w-auto max-w-full" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-[5px] py-[5px] desktop:grid-cols-4" aria-label="Clients">
      {columns.map((col, ci) => {
        const item = col.length ? col[(tick + ci) % col.length] : null;
        return (
          <div key={ci} className="relative h-[70px] overflow-hidden rounded-[10px] bg-grey-03 px-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {item && (
                <motion.div
                  key={item._id + tick}
                  className="absolute inset-0 grid place-items-center px-2.5"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 240, damping: 72, mass: 8 }}
                >
                  <SanityImg image={item.logo} alt={item.name} width={320} sizes="200px" className="max-h-8 w-auto object-contain grayscale" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </section>
  );
}
