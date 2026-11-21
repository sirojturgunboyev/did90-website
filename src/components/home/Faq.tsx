"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "../ui/Reveal";
import type { Home } from "@/lib/queries";

export function Faq({ title, subtitle, aside, email, faqs }: { title?: string; subtitle?: string; aside?: string; email?: string; faqs: Home["faqs"] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="flex flex-col gap-16 px-0 py-[60px] tablet:px-5">
      <Reveal>
        <h2 className="text-h1">
          {title}
          <br />
          <span className="text-grey-01">{subtitle}</span>
        </h2>
      </Reveal>
      <div className="grid gap-16 tablet:grid-cols-2 tablet:gap-[120px]">
        <ul>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f._id} className="border-b border-grey-03">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-4 text-left text-[15px] tracking-[-0.02em]"
                >
                  {f.question}
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-[20px] font-light leading-none text-grey-01">
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", duration: 0.5, bounce: 0 }} className="overflow-hidden">
                      <p className="pb-5 text-body text-grey-01">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col items-center gap-6 pt-4 text-center">
          <p className="max-w-[300px] text-h3">{aside}</p>
          {email && (
            <a href={`mailto:${email}`} className="rounded-[6px] bg-grey-03 px-3 py-2 text-body-xl transition-colors hover:bg-light-grey">
              {email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
