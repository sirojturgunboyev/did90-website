"use client";
import { motion, type HTMLMotionProps } from "motion/react";

const ease = [0.44, 0, 0.56, 1] as const;

/** Blur + rise reveal used on headings across the Framer template. */
export function Reveal({ children, delay = 0, y = 20, blur = 10, ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number; blur?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Character-by-character entrance (hero title). */
export function CharReveal({ text, delay = 0.5, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0, delay: delay + 0.1 + i * 0.04 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
