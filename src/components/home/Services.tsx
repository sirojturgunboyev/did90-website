"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
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

/* Framer "Hover Card": white 3px frame, 240×160 image; five hover zones stack images 2–5 on top (instant, no transition);
   overlay images are 393×288, anchored bottom-right inside the frame. */
function HoverCard({ title, images }: { title: string; images: Home["services"][number]["images"] }) {
  const list = images?.length ? images : [null];
  const [shown, setShown] = useState(0); // how many overlay images are visible
  const overlays = list.slice(1, 5);
  return (
    <div
      className="relative rounded-[10px] bg-white p-[3px] shadow-[inset_0_1.5px_0_rgba(255,255,255,.07),0_1px_0_1px_rgba(255,255,255,.05)]"
      onMouseLeave={() => setShown(0)}
    >
      <div className="relative h-[160px] w-[240px] overflow-hidden rounded-[10px]">
        <SanityImg image={list[0]} alt={title} width={500} sizes="240px" className="absolute inset-0 size-full object-cover" />
        {overlays.map((img, k) => (
          <SanityImg
            key={k}
            image={img}
            alt=""
            width={800}
            sizes="393px"
            className={`absolute bottom-0 right-0 z-[1] h-[288px] w-[393px] max-w-none object-cover ${k < shown ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
      <div className="absolute bottom-0 right-0 z-[3] flex h-full w-full">
        {[0, 1, 2, 3, 4].map((z) => (
          <span key={z} className="h-full flex-1" onMouseEnter={() => setShown(Math.min(z, overlays.length))} />
        ))}
      </div>
    </div>
  );
}

function ServiceRow({ title, images }: { title: string; images: Home["services"][number]["images"] }) {
  // Framer: each card scrolls up over the sticky dark panel; it stays full width while it covers the panel's middle row,
  // then shrinks to 0.9 once its top passes the viewport middle.
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [1, 0.9]);
  // "Hover me" cursor pill over the image half (Framer Main - Cursor / Hover me)
  const [hover, setHover] = useState(false);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    cx.set(e.clientX - r.left);
    cy.set(e.clientY - r.top);
  };
  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.44, 0, 0.56, 1] }}
      className="grid gap-2.5 tablet:grid-cols-2"
    >
      <div className="grid min-h-[180px] place-items-center rounded-[10px] border border-grey-03 bg-white text-body tablet:min-h-[400px] desktop:min-h-[500px]">{title}</div>
      <div
        data-cursor="explore"
        className="relative grid min-h-[260px] cursor-none place-items-center overflow-hidden rounded-[10px] bg-grey-03 tablet:min-h-[400px] desktop:min-h-[498px]"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          move(e);
          setHover(true);
        }}
        onPointerMove={(e) => e.pointerType === "mouse" && move(e)}
        onPointerLeave={() => setHover(false)}
      >
        <HoverCard title={title} images={images} />
        <AnimatePresence>
          {hover && (
            <motion.span aria-hidden className="pointer-events-none absolute left-0 top-0 z-10" style={{ x: cx, y: cy }}>
              <motion.span
                className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/40 px-[14px] py-[7px] text-[11px] leading-[1.2] text-black backdrop-blur-[30px]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 60, mass: 1 }}
              >
                Hover me
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
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
