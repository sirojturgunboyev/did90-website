"use client";
/* Port of the Framer Process "Slideshow" component: 5 slides, auto-advance every 5s (spring 0.6s),
   navigator pinned 40px from the bottom with a 1px white/20 top border and a 3px progress bar over the active step. */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Home } from "@/lib/queries";

const SLIDE_MS = 5000;

function Chars({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", duration: 1, bounce: 0, delay: i * 0.05 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Process({ title, steps }: { title?: string; steps: Home["steps"] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (steps.length < 2) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % steps.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [active, steps.length]);
  if (!steps.length) return null;
  const step = steps[active];

  return (
    <section id="process" className="scroll-mt-24">
      <div data-cursor="dot" className="relative flex min-h-[640px] flex-col overflow-hidden rounded-[5px] bg-black p-5 text-white tablet:h-[828px]">
        {/* Top row: + title + */}
        <div className="flex items-center justify-between">
          <span className="text-body-xl leading-none">+</span>
          <span className="text-body">{title}</span>
          <span className="text-body-xl leading-none">+</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-[120px] text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="flex flex-col items-center gap-2.5"
              exit={{ opacity: 0 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            >
              <h3 className="text-h1">
                <Chars text={step.title} />
              </h3>
              <motion.p
                className="text-body opacity-80"
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 0.8, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", duration: 0.9, bounce: 0, delay: 0.35 }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigator */}
        <ol className="absolute inset-x-5 bottom-10 flex gap-10 border-t border-white/20 pt-5 tablet:inset-x-10">
          {steps.map((s, i) => (
            <li key={s._id} className="relative min-w-0 flex-1">
              {i === active && (
                <span className="absolute -top-5 left-0 h-[3px] w-full -translate-y-1/2 overflow-hidden rounded-[10px]">
                  <motion.span
                    key={active}
                    className="block h-full rounded-[10px] bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SLIDE_MS / 1000, ease: "linear", delay: 0.1 }}
                  />
                </span>
              )}
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active ? "step" : undefined}
                className={`flex w-full flex-col items-start gap-[5px] text-left text-body transition-opacity duration-500 ${i === active ? "text-white opacity-100" : "text-grey-02 opacity-40 hover:opacity-70"}`}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="hidden truncate tablet:block">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
