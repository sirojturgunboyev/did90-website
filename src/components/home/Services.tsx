"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import type { Home } from "@/lib/queries";

/** Right-angle (90°) marker drawn like a set-square: L-shaped ruler with ticks and the ∟ square at the vertex. */
function RightAngle({ className = "" }: { className?: string }) {
  const ticks = [8, 12, 16, 20, 24, 28];
  return (
    <svg viewBox="0 0 36 36" className={`absolute size-9 text-white ${className}`} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <path d="M0.5 36V0.5H36" />
      <path d="M0.5 9.5H9.5V0.5" />
      {ticks.map((t) => (
        <g key={t} strokeOpacity={t % 8 === 0 ? 1 : 0.55}>
          <path d={`M${t + 0.5} 0.5v${t % 8 === 0 ? 5 : 3}`} />
          <path d={`M0.5 ${t + 0.5}h${t % 8 === 0 ? 5 : 3}`} />
        </g>
      ))}
    </svg>
  );
}

function Corners() {
  return (
    <>
      <RightAngle className="left-5 top-5" />
      <RightAngle className="right-5 top-5 rotate-90" />
      <RightAngle className="bottom-5 right-5 rotate-180" />
      <RightAngle className="bottom-5 left-5 -rotate-90" />
    </>
  );
}

function ServiceRow({ title, images }: { title: string; images: Home["services"][number]["images"] }) {
  const [i, setI] = useState(0);
  const list = images?.length ? images : [null];
  return (
    <div
      className="grid gap-2.5 tablet:grid-cols-2"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setI(Math.min(list.length - 1, Math.floor(((e.clientX - r.left) / r.width) * list.length)));
      }}
      onMouseLeave={() => setI(0)}
    >
      <div className="grid min-h-[180px] place-items-center rounded-[10px] border border-grey-03 bg-white text-body-l tablet:min-h-[434px]">{title}</div>
      <div className="grid min-h-[260px] place-items-center rounded-[10px] bg-grey-03 tablet:min-h-[434px]">
        <div className="relative aspect-[210/158] w-[min(210px,60%)] overflow-hidden rounded-[8px] border-2 border-white shadow-[0_1px_2px_rgba(0,0,0,.08)]">
          <AnimatePresence initial={false}>
            <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <SanityImg image={list[i]} alt={title} width={500} sizes="210px" className="size-full object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Services({ title, left, right, services }: { title?: string; left?: string; right?: string; services: Home["services"] }) {
  return (
    <section id="services" className="flex scroll-mt-24 flex-col gap-2.5">
      <div className="relative flex min-h-[70svh] flex-col items-center justify-center rounded-[10px] bg-black px-5 text-white tablet:min-h-svh">
        <Corners />
        <p className="absolute top-14 text-body-l">{title}</p>
        <div className="flex w-full flex-col items-center gap-6 text-body-l tablet:flex-row tablet:justify-between">
          <span>{left}</span>
          <span className="display text-[22px]" aria-hidden>
            ✺
          </span>
          <span>{right}</span>
        </div>
      </div>
      {services.map((s) => (
        <ServiceRow key={s._id} title={s.title} images={s.images} />
      ))}
    </section>
  );
}
