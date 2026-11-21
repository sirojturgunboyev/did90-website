"use client";
/* Port of the Framer FAQ section: two equal columns; left = H1 title + "Accordions" (4px padding, 20px gap,
   items 10px vertical padding with a Grey 03 bottom border, 15px text, 16px plus rotating 45°, spring 0.4/0.2);
   right = centred H1 + "Email Button" (Grey 03 → Grey 02 on hover, 8/12 padding, r8, 20px). */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "../ui/Reveal";
import type { Home } from "@/lib/queries";

const spring = { type: "spring", duration: 0.4, bounce: 0.2 } as const;

function PlusIcon({ open }: { open: boolean }) {
  return (
    <motion.svg width="16" height="16" viewBox="0 0 16 16" fill="none" animate={{ rotate: open ? 45 : 0 }} transition={spring} className="shrink-0 text-grey-01" aria-hidden>
      <path d="M8 1.5v13M1.5 8h13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </motion.svg>
  );
}

export function Faq({ title, subtitle, aside, email, faqs }: { title?: string; subtitle?: string; aside?: string; email?: string; faqs: Home["faqs"] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-[100px]">
      <div className="flex flex-col gap-16 tablet:flex-row tablet:gap-0 tablet:px-5">
        <div className="flex flex-1 flex-col gap-[58px]">
          <Reveal>
            <h2 className="text-h1">
              {title}
              <br />
              <span className="text-grey-01">{subtitle}</span>
            </h2>
          </Reveal>
          <ul className="flex flex-col gap-5 p-1">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f._id} className="border-b border-grey-03 py-2.5">
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center text-left text-nav-m">
                    <span className="flex-1">{f.question}</span>
                    <PlusIcon open={isOpen} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring} className="overflow-hidden">
                        <p className="pt-2.5 text-nav-m text-grey-01">{f.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <Reveal>
            <p className="max-w-[340px] text-h1">{aside}</p>
          </Reveal>
          {email && (
            <a href={`mailto:${email}`} className="rounded-[8px] bg-grey-03 px-3 py-2 text-body-xl text-grey-01 transition-colors duration-300 hover:bg-grey-02 hover:text-black">
              {email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
