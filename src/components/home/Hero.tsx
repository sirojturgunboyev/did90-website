"use client";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { CharReveal } from "../ui/Reveal";

const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

export function Hero({ title, tagline, cardImage, strapImage }: { title: string; tagline: string; cardImage?: string | null; strapImage?: string | null }) {
  return (
    <section className="relative -mx-2.5 h-svh min-h-[600px] overflow-hidden bg-white tablet:-mx-5">
      {/* Framer: Lanyard instance is a fixed 1080px-tall canvas pinned to the top, so the card keeps the same size on any screen height */}
      <div className="absolute inset-x-0 top-0 z-[2] h-[1080px]">
        <Lanyard cardImage={cardImage} strapImage={strapImage} />
      </div>
      {/* Framer: plain white text above the canvas — it only shows where it overlaps the dark card */}
      <header className="pointer-events-none relative z-[4] flex h-full flex-col items-center justify-center px-6 text-white">
        <h1 className="flex items-start gap-1">
          <CharReveal text={title} className="text-h1" />
          <motion.span
            className="display text-[18px] font-light leading-[2.3em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0, delay: 0.5 }}
          >
            °
          </motion.span>
        </h1>
        <motion.p
          className="text-body-l"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.87, 0, 0.5, 1], delay: 1.67 }}
        >
          {tagline}
        </motion.p>
      </header>
    </section>
  );
}
