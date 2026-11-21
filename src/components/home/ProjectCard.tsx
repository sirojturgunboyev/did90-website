"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import type { ProjectCard as P } from "@/lib/queries";

// Framer "Project Card" hover: thumbnail blur 5px + scale 1.06 (spring 0.4s, bounce 0.2),
// and the "Main - Cursor / Explore" pill following the pointer.
const cardSpring = { type: "spring", duration: 0.4, bounce: 0.2 } as const;

export function ProjectCard({ project, href, size = "sm", invert = false }: { project: P; href: string; size?: "sm" | "lg"; invert?: boolean }) {
  const [hover, setHover] = useState(false);
  // Framer cursor has follow: false → sits exactly on the pointer.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <Link href={href} className="group flex flex-col gap-[5px] pb-4">
      <div
        data-cursor="explore"
        className="relative aspect-[0.94] cursor-none overflow-hidden rounded-[5px]"
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          move(e);
          setHover(true);
        }}
        onPointerMove={(e) => e.pointerType === "mouse" && move(e)}
        onPointerLeave={() => setHover(false)}
      >
        <motion.div
          className="size-full"
          animate={hover ? { scale: 1.06, filter: "blur(5px)" } : { scale: 1, filter: "blur(0px)" }}
          transition={cardSpring}
        >
          <SanityImg
            image={project.cover}
            alt={project.title}
            width={size === "lg" ? 1200 : 700}
            sizes={size === "lg" ? "(min-width:1200px) 560px, 100vw" : "(min-width:1200px) 190px, 50vw"}
            className="size-full object-cover"
          />
        </motion.div>
        <AnimatePresence>
          {hover && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-10"
              style={{ x, y }}
            >
              <motion.span
                className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/40 px-[14px] py-[7px] text-[11px] leading-[1.2] text-white backdrop-blur-[30px]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 60, mass: 1 }}
              >
                Explore
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className={`flex items-center justify-between text-small ${invert ? "text-white" : "text-black"}`}>
        <span>{project.title}</span>
      </div>
    </Link>
  );
}
