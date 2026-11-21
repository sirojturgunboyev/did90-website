"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import type { Home } from "@/lib/queries";

function Corners() {
  const c = "absolute text-white text-body-xl leading-none";
  return (
    <>
      <span className={`${c} left-5 top-5`}>+</span>
      <span className={`${c} right-5 top-5`}>+</span>
      <span className={`${c} bottom-5 left-5`}>+</span>
      <span className={`${c} bottom-5 right-5`}>+</span>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/did90-mark.png" alt="" aria-hidden width={28} height={28} className="size-7" />
          <span>{right}</span>
        </div>
      </div>
      {services.map((s) => (
        <ServiceRow key={s._id} title={s.title} images={s.images} />
      ))}
    </section>
  );
}
