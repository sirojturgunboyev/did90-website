"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { SanityImg } from "../ui/SanityImg";
import type { SanityImage } from "@/lib/queries";
import type { Dictionary } from "@/i18n/dictionaries";

type State = "idle" | "sending" | "success" | "error";

const field = "w-full rounded-[10px] bg-grey-03 px-2.5 text-[14px] tracking-[-0.02em] text-black outline-none placeholder:text-grey-01 focus:ring-1 focus:ring-black";

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
    <section ref={ref} id="contact" className="relative overflow-hidden rounded-[10px] border-4 border-black bg-white px-5 py-[100px]">
      <motion.div className="pointer-events-none absolute left-0 top-2.5 w-[470px] max-w-[38%]" style={{ x: xl }}>
        <SanityImg image={imageLeft} width={800} sizes="470px" className="w-full" />
      </motion.div>
      <motion.div className="pointer-events-none absolute right-0 top-2.5 w-[470px] max-w-[38%]" style={{ x: xr }}>
        <SanityImg image={imageRight} width={800} sizes="470px" className="w-full" />
      </motion.div>

      {/* Framer "Contact Form": 500px max, 16px lines, form 20px padding / 20px gap, 12px labels, 40px inputs r10,
          submit = black 40px button r10 inside a Grey 03 5px frame */}
      <div className="relative mx-auto flex max-w-[500px] flex-col items-center">
        <div className="w-full text-center text-body">
          {lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-5 p-5" noValidate={false}>
          <label className="flex flex-col gap-[5px]">
            <span className="px-2.5 text-small">{dict.name}</span>
            <input name="name" required maxLength={120} autoComplete="name" placeholder={dict.namePh} className={`${field} h-10`} />
          </label>
          <label className="flex flex-col gap-[5px]">
            <span className="px-2.5 text-small">{dict.email}</span>
            <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder={dict.emailPh} className={`${field} h-10`} />
          </label>
          <label className="flex flex-col gap-[5px]">
            <span className="px-2.5 text-small">{dict.message}</span>
            <textarea name="message" required maxLength={4000} placeholder={dict.messagePh} className={`${field} min-h-[100px] resize-y py-2.5`} />
          </label>
          {/* honeypot */}
          <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <div className="rounded-[10px] bg-grey-03 p-[5px]">
            <button
              type="submit"
              disabled={state === "sending"}
              className={`flex h-10 w-full items-center justify-center gap-2 rounded-[10px] text-[14px] font-semibold transition-colors duration-300 ${
                state === "error" ? "bg-[rgba(255,34,68,0.15)] text-[rgb(255,34,68)]" : "bg-black text-white hover:bg-[rgba(3,3,3,0.6)]"
              }`}
            >
              {state === "sending" && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />}
              {state === "success" ? dict.success : state === "error" ? dict.error : dict.submit}
            </button>
          </div>
          <p className="px-2.5 text-center text-body-l">{note}</p>
        </form>
      </div>
    </section>
  );
}
