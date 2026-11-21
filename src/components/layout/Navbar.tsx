"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Ticker } from "../ui/Ticker";
import { localePath, type Locale } from "@/i18n/config";

type NavDict = { about: string; projects: string; services: string; process: string; blog: string; contact: string; menu: string; close: string; contactUs: string };

function Clock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Tashkent" }).format(new Date());
    const first = setTimeout(() => setNow(fmt()), 0);
    const id = setInterval(() => setNow(fmt()), 10_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return (
    <span className="flex items-center gap-1.5 tabular-nums" suppressHydrationWarning>
      {now || " "}
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
        <path d="M8 4.5V8h3" stroke="currentColor" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Navbar({ lang, dict, ticker }: { lang: Locale; dict: NavDict; ticker: string[] }) {
  const [open, setOpen] = useState(false);
  const home = localePath(lang, "/");
  const links = [
    { href: `${home === "/" ? "" : home}/#about`, label: dict.about },
    { href: localePath(lang, "/projects"), label: dict.projects },
    { href: `${home === "/" ? "" : home}/#services`, label: dict.services },
    { href: `${home === "/" ? "" : home}/#process`, label: dict.process },
    { href: localePath(lang, "/blog"), label: dict.blog },
  ];
  const items = ticker.length ? ticker : ["DID90° Agency"];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="pointer-events-auto w-full max-w-[920px] rounded-[10px] bg-light-grey/90 px-2.5 py-1.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Logo href={home} className="mr-auto shrink-0 px-1 tablet:mr-6" />

          <div className="hidden min-w-0 flex-1 items-center gap-1.5 desktop:flex">
            <div className="relative min-w-0 flex-1 rounded-[8px] bg-white py-1.5 text-nav-s text-grey-01 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
              <Ticker duration={18} gap={10}>
                {items.map((t, i) => (
                  <span key={i} className="whitespace-nowrap">
                    <span className="text-black">{t}</span>
                    <span className="mx-2">/</span>
                  </span>
                ))}
              </Ticker>
            </div>
            <span className="h-6 w-[5px] rounded-full bg-grey-02" aria-hidden />
            <span className="rounded-[8px] bg-white px-2.5 py-1.5 text-nav-m">
              <Clock />
            </span>
          </div>

          <ul className="hidden items-center gap-3.5 pl-3 text-nav-m tablet:flex">
            {links.slice(0, 4).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-opacity hover:opacity-60">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher current={lang} className="hidden tablet:flex" />
          <Link href={localePath(lang, "/contact")} className="hidden rounded-[8px] px-3 py-1.5 text-nav-m transition-colors hover:bg-white tablet:block">
            {dict.contact}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? dict.close : dict.menu}
            className="grid size-9 place-items-center rounded-[8px] transition-colors hover:bg-white tablet:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path d={open ? "M5 5l10 10M15 5L5 15" : "M3 6h14M3 10h14M3 14h14"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="overflow-hidden tablet:hidden"
            >
              <ul className="flex flex-col gap-1 px-1 pb-3 pt-6">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setOpen(false)} className="text-h2 block py-1">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-1 pb-2">
                <LanguageSwitcher current={lang} />
                <Link href={localePath(lang, "/contact")} onClick={() => setOpen(false)} className="rounded-[8px] bg-black px-4 py-2.5 text-nav-m text-white">
                  {dict.contactUs}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
