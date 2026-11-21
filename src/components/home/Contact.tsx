"use client";
import { useState } from "react";
import { motion } from "motion/react";
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
    <section id="contact" className="relative overflow-hidden rounded-[10px] border-[3px] border-black bg-white px-5 pb-24 pt-20 tablet:pt-24">
      <motion.div className="pointer-events-none absolute left-0 top-0 w-[38%] max-w-[380px]" initial={{ x: -60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.44, 0, 0.56, 1] }}>
        <SanityImg image={imageLeft} width={800} sizes="380px" className="w-full" />
      </motion.div>
      <motion.div className="pointer-events-none absolute right-0 top-0 w-[38%] max-w-[380px]" initial={{ x: 60, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.44, 0, 0.56, 1] }}>
        <SanityImg image={imageRight} width={800} sizes="380px" className="w-full" />
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
