"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./Logo";
import { LanguageMenu } from "./LanguageMenu";
import { Ticker } from "../ui/Ticker";
import { localePath, type Locale } from "@/i18n/config";

type NavDict = { about: string; projects: string; services: string; process: string; blog: string; contact: string; menu: string; close: string; contactUs: string };

function Clock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Asia/Tashkent" }).format(new Date());
    const first = setTimeout(() => setNow(fmt()), 0);
    const id = setInterval(() => setNow(fmt()), 10_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return (
    <span className="flex items-center gap-[5px] tabular-nums" suppressHydrationWarning>
      {now || " "}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
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

  // Collapse into the dark pill (template "Collapsed Dark" variant) once the marker placed after the
  // client logos has scrolled under the navbar; pages without the marker use 60% of the first screen.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const marker = document.querySelector("[data-nav-collapse]");
      setScrolled(marker ? marker.getBoundingClientRect().top < 70 : window.scrollY > window.innerHeight * 0.6);
    };
    const first = setTimeout(onScroll, 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const collapsed = scrolled && !open;
  const spring = { type: "spring" as const, stiffness: 500, damping: 60, mass: 1 };

  // Sizes follow the Framer "Navbar" component: 915px wide, 5/10px padding, radius 10, Grey 03 + 12px blur.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <motion.nav
        layout
        transition={spring}
        animate={{ backgroundColor: collapsed ? "#030303" : "#f2f2f2" }}
        style={{ borderRadius: 10 }}
        className={`pointer-events-auto px-2.5 py-[5px] backdrop-blur-[12px] ${collapsed ? "w-auto" : "w-full max-w-[915px]"}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
        {collapsed ? (
          <motion.div
            key="collapsed"
            layout="position"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-[30px] pl-1"
          >
            <Logo href={home} invert className="shrink-0" />
            <Link href={localePath(lang, "/contact")} className="rounded-[5px] bg-grey-03 px-3.5 py-1.5 text-nav-m text-black transition-colors hover:bg-white">
              {dict.contact}
            </Link>
          </motion.div>
        ) : (
        <motion.div
          key="full"
          layout="position"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-4"
        >
          {/* Left: logo … ticker badge | divider | clock */}
          <div className="flex min-w-0 flex-1 items-center gap-[3px]">
            <Logo href={home} className="mr-auto shrink-0 pl-1 pr-4" />
            <div className="hidden min-w-0 items-center gap-[3px] desktop:flex">
              <div className="relative h-7 w-[260px] min-w-[120px] shrink overflow-hidden rounded-[10px] bg-white px-2.5 text-nav-s text-grey-01">
                {/* Box stays solid; only the scrolling text fades out at the edges. */}
                <div className="flex h-full items-center [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
                  <Ticker duration={18} gap={10}>
                    {items.map((t, i) => (
                      <span key={i} className="whitespace-nowrap">
                        <span className="text-black">{t}</span>
                        <span className="mx-2">/</span>
                      </span>
                    ))}
                  </Ticker>
                </div>
              </div>
              <span className="h-[27px] w-[5px] shrink-0 rounded-[10px] bg-grey-02" aria-hidden />
              <span className="shrink-0 rounded-[10px] bg-white px-2.5 py-1.5 text-nav-m">
                <Clock />
              </span>
            </div>
          </div>

          {/* Right: tabs (contact is a regular tab), divider, language */}
          <div className="hidden shrink-0 items-center gap-4 tablet:flex">
            <ul className="flex items-center gap-4 text-nav-m">
              {[...links.slice(0, 4), { href: localePath(lang, "/contact"), label: dict.contact }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-opacity hover:opacity-60">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <span className="h-[27px] w-[5px] shrink-0 rounded-[10px] bg-grey-02" aria-hidden />
            <LanguageMenu current={lang} />
          </div>

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
        </motion.div>
        )}
        </AnimatePresence>

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
                <LanguageMenu current={lang} align="left" up />
                <Link href={localePath(lang, "/contact")} onClick={() => setOpen(false)} className="rounded-[8px] bg-black px-4 py-2.5 text-nav-m text-white">
                  {dict.contactUs}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
