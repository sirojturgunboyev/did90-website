"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Home } from "@/lib/queries";

export function Process({ title, steps }: { title?: string; steps: Home["steps"] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || steps.length < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 4000);
    return () => clearInterval(id);
  }, [paused, steps.length]);
  if (!steps.length) return null;
  const step = steps[active];

  return (
    <section id="process" className="scroll-mt-24">
      <div
        className="relative flex min-h-[640px] flex-col rounded-[10px] bg-black px-5 pb-10 text-white tablet:h-[828px] tablet:px-[65px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="absolute left-6 top-6 text-body-xl leading-none">+</span>
        <span className="absolute right-6 top-6 text-body-xl leading-none">+</span>
        <p className="pt-6 text-center text-body-l text-grey-02">{title}</p>

        <div className="flex flex-1 items-center justify-center text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.44, 0, 0.56, 1] }}
            >
              <h3 className="text-h1">{step.title}</h3>
              <p className="mt-3 text-body-l text-grey-02">{step.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative border-t border-[#2a2a2a]">
          <motion.span
            key={active}
            className="absolute -top-px left-0 h-px bg-white"
            initial={{ width: 0 }}
            animate={{ width: paused ? undefined : `${100 / steps.length}%` }}
            transition={{ duration: 4, ease: "linear" }}
            style={{ marginLeft: `${(active * 100) / steps.length}%` }}
          />
          <ol className="grid pt-6" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }}>
            {steps.map((s, i) => (
              <li key={s._id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={`flex flex-col items-start text-left text-body-l transition-colors ${i === active ? "text-white" : "text-[#555] hover:text-grey-02"}`}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="hidden tablet:block">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
