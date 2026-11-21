"use client";
import { motion } from "motion/react";

/** Page-load wipe: light grey panel sliding up, as in the Framer "Loader". */
export function Loader() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] bg-light-grey"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 1, ease: [0.5, 0, 0.88, 0.77], delay: 0.2 }}
    />
  );
}
