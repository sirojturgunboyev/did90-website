"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue } from "motion/react";

/** Framer "Main - Cursor / Main white": a 14px white dot replaces the pointer over [data-cursor="dot"] areas. */
export function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setOn(!!t?.closest?.('[data-cursor="dot"]') && !t.closest('[data-cursor="explore"]'));
    };
    const leave = () => setOn(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <motion.div className="pointer-events-none fixed left-0 top-0 z-[60]" style={{ x, y }} aria-hidden>
      <motion.span
        className="block size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 60, mass: 1 }}
      />
    </motion.div>
  );
}
