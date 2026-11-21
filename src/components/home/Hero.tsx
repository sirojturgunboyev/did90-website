"use client";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { CharReveal } from "../ui/Reveal";

const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

export function Hero({ title, tagline, cardImage, strapImage }: { title: string; tagline: string; cardImage?: string | null; strapImage?: string | null }) {
  return (
    <section className="relative -mx-2.5 h-[844px] overflow-hidden bg-white tablet:-mx-5 tablet:h-[1080px] desktop:h-svh desktop:min-h-[600px]">
      {/* Framer: Phone section is 844px and Tablet 1080px with the canvas filling it; Desktop pins a 1080px canvas to the top */}
      <div className="absolute inset-0 z-[2] desktop:bottom-auto desktop:h-[1080px]">
        <Lanyard cardImage={cardImage} strapImage={strapImage} />
      </div>
      {/* Plain white text above the canvas, centred on the same box as the canvas so it always lands on the card */}
      <header className="pointer-events-none absolute inset-0 z-[4] flex flex-col items-center justify-center px-6 text-white desktop:bottom-auto desktop:h-[1080px]">
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
