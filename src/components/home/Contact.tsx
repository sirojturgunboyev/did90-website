"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import type { SanityImage } from "@/lib/queries";
import type { Dictionary } from "@/i18n/dictionaries";

type State = "idle" | "sending" | "success" | "error";

const field = "w-full rounded-[8px] bg-grey-03 px-3 py-2.5 text-[14px] tracking-[-0.02em] outline-none placeholder:text-grey-01 focus:ring-1 focus:ring-black";

export function Contact({
  lines,
  note,
  imageLeft,
  imageRight,
  dict,
}: {
  lines: string[];
  note?: string;
  imageLeft?: SanityImage;
  imageRight?: SanityImage;
  dict: Dictionary["contact"];
}) {
  const [state, setState] = useState<State>("idle");
  // Framer: side images slide in ±250px → 0 as the section scrolls up to the viewport bottom (spring 400/98/0.9).
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 400, damping: 98, mass: 0.9 });
  const xl = useTransform(p, [0, 1], [-250, 0]);
  const xr = useTransform(p, [0, 1], [250, 0]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    const res = await fetch("/api/contact", { method: "POST", body: new FormData(form) }).catch(() => null);
    if (res?.ok) {
      setState("success");
      form.reset();
    } else setState("error");
  }

  return (
    <section ref={ref} id="contact" className="relative overflow-hidden rounded-[10px] border-[3px] border-black bg-white px-5 pb-24 pt-20 tablet:pt-24">
      <motion.div className="pointer-events-none absolute left-0 top-2.5 w-[470px] max-w-[38%]" style={{ x: xl }}>
        <SanityImg image={imageLeft} width={800} sizes="470px" className="w-full" />
      </motion.div>
      <motion.div className="pointer-events-none absolute right-0 top-2.5 w-[470px] max-w-[38%]" style={{ x: xr }}>
        <SanityImg image={imageRight} width={800} sizes="470px" className="w-full" />
      </motion.div>

      <div className="relative mx-auto flex max-w-[400px] flex-col gap-4">
        <div className="pb-2 text-center text-body-l">
          {lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate={false}>
          <label className="flex flex-col gap-1.5 text-small">
            <span className="px-2.5">{dict.name}</span>
            <input name="name" required maxLength={120} autoComplete="name" placeholder={dict.namePh} className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-small">
            <span className="px-2.5">{dict.email}</span>
            <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder={dict.emailPh} className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-small">
            <span className="px-2.5">{dict.message}</span>
            <textarea name="message" required maxLength={4000} rows={4} placeholder={dict.messagePh} className={`${field} resize-y`} />
          </label>
          {/* honeypot */}
          <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-2 rounded-[8px] bg-black py-2.5 text-[14px] font-semibold text-white ring-2 ring-white outline outline-1 outline-grey-02 transition-opacity hover:opacity-85 disabled:opacity-60"
          >
            {state === "sending" ? dict.sending : dict.submit}
          </button>
          <p role="status" className={`min-h-5 text-center text-small ${state === "error" ? "text-red" : "text-grey-01"}`}>
            {state === "success" ? dict.success : state === "error" ? dict.error : ""}
          </p>
        </form>
        <p className="text-center text-body-l">{note}</p>
      </div>
    </section>
  );
}
