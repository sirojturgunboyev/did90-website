"use client";
import { motion } from "motion/react";

const TICKS = 109;
const START = 16;

/** Framer "Seperator": a row of 1×9px ticks; ~20% visible, all ticks fade in once the row is fully in view. */
export function Separator() {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-[1160px] justify-between py-[50px]"
      initial="partial"
      whileInView="full"
      viewport={{ once: true, amount: 1 }}
      aria-hidden
    >
      {Array.from({ length: TICKS }, (_, i) => (
        <motion.span
          key={i}
          className={`h-[9px] w-px bg-grey-02 ${i % 2 ? "max-tablet:hidden" : ""}`}
          variants={{ partial: { opacity: i < START ? 1 : 0 }, full: { opacity: 1 } }}
          transition={{ duration: 0.8, ease: [0.44, 0, 0.56, 1] }}
        />
      ))}
    </motion.div>
  );
}
