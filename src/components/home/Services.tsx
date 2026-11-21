"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
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
  // Framer: each card scrolls up over the sticky dark panel and shrinks to 0.9 as it reaches the viewport middle.
  const ref = useRef<HTMLDivElement>(null);
  // Stays full width while it covers the panel's middle row, then shrinks once its top passes the viewport middle.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [1, 0.9]);
  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.44, 0, 0.56, 1] }}
      className="grid gap-2.5 tablet:grid-cols-2"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setI(Math.min(list.length - 1, Math.floor(((e.clientX - r.left) / r.width) * list.length)));
      }}
      onMouseLeave={() => setI(0)}
    >
      <div className="grid min-h-[180px] place-items-center rounded-[10px] border border-grey-03 bg-white text-body-l tablet:min-h-[434px] desktop:min-h-[500px]">{title}</div>
      <div className="grid min-h-[260px] place-items-center rounded-[10px] bg-grey-03 tablet:min-h-[434px] desktop:min-h-[500px]">
        <div className="relative aspect-[210/158] w-[min(210px,60%)] overflow-hidden rounded-[8px] border-2 border-white shadow-[0_1px_2px_rgba(0,0,0,.08)]">
          <AnimatePresence initial={false}>
            <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <SanityImg image={list[i]} alt={title} width={500} sizes="210px" className="size-full object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export function Services({ title, left, right, services }: { title?: string; left?: string; right?: string; services: Home["services"] }) {
  // Hide the panel texts for good once the first card reaches the middle row (they reappear only when scrolling back above it).
  const cards = useRef<HTMLDivElement>(null);
  const [covered, setCovered] = useState(false);
  const { scrollYProgress } = useScroll({ target: cards, offset: ["start end", "start center"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setCovered(v >= 0.98));
  const fade = { animate: { opacity: covered ? 0 : 1 }, transition: { duration: 0.3 } };
  return (
    <section id="services" className="relative scroll-mt-24 py-2.5">
      {/* Sticky dark panel; the service cards below scroll up over it. */}
      <div data-cursor="dot" className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden rounded-[10px] bg-black px-5 text-white">
        <Corners />
        <motion.p {...fade} className="absolute top-5 text-body-l">{title}</motion.p>
        <motion.div {...fade} className="flex w-full flex-col items-center gap-6 text-body-l tablet:flex-row tablet:justify-between">
          <span>{left}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/did90-mark.png" alt="" aria-hidden width={28} height={28} className="size-7" />
          <span>{right}</span>
        </motion.div>
      </div>
      <div ref={cards} className="relative z-[1] flex flex-col gap-2.5 pb-[50px] pt-2.5">
        {services.map((s) => (
          <ServiceRow key={s._id} title={s.title} images={s.images} />
        ))}
      </div>
    </section>
  );
}
