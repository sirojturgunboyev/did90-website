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

/** Plain fade-in on view (Framer appear: opacity 0 → 1, spring 1s). */
export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0 }} transition={{ type: "spring", duration: 1, bounce: 0.2 }}>
      {children}
    </motion.div>
  );
}

/** Container that triggers its <Rise> children when it enters the view (children may start clipped/off-screen). */
export function RiseGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0 }}>
      {children}
    </motion.div>
  );
}

/** Slow rise from `y` px to 0 (Framer "style transform on in-view"); driven by the parent RiseGroup. */
export function Rise({ children, y, duration, bounce = 0, className, style }: { children: React.ReactNode; y: number; duration: number; bounce?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{ hidden: { y }, show: { y: 0, transition: { type: "spring", duration, bounce } } }}
    >
      {children}
    </motion.div>
  );
}
