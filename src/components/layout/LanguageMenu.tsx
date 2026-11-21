"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

const NAMES: Record<Locale, string> = { uz: "O‘zbekcha", ru: "Русский", en: "English" };

/** Same page URL in another language (uz has no prefix). */
export function swapLocale(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  const hasPrefix = (locales as readonly string[]).includes(parts[1]);
  const rest = hasPrefix ? "/" + parts.slice(2).join("/") : pathname;
  const clean = rest === "/" ? "" : rest.replace(/\/$/, "");
  return to === defaultLocale ? clean || "/" : `/${to}${clean}`;
}

function Globe() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M2.75 12h18.5M12 2.75c2.4 2.5 3.7 5.7 3.7 9.25S14.4 18.75 12 21.25M12 2.75C9.6 5.25 8.3 8.45 8.3 12s1.3 6.75 3.7 9.25" />
    </svg>
  );
}

/** Globe button that opens a small menu with the three languages. */
export function LanguageMenu({ current, label = "Language", align = "right", up = false }: { current: Locale; label?: string; align?: "left" | "right"; up?: boolean }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={`flex h-8 items-center gap-1 rounded-[8px] px-2 text-nav-s uppercase transition-colors hover:bg-white ${open ? "bg-white" : ""}`}
      >
        <Globe />
        <span>{current}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.44, 0, 0.56, 1] }}
            className={`absolute ${align === "right" ? "right-0" : "left-0"} ${up ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"} z-10 min-w-[150px] rounded-[10px] bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,.08),0_8px_24px_rgba(0,0,0,.08)]`}
          >
            {locales.map((l) => (
              <li key={l} role="none">
                <Link
                  role="menuitem"
                  href={swapLocale(pathname, l)}
                  hrefLang={l}
                  onClick={() => setOpen(false)}
                  aria-current={l === current ? "true" : undefined}
                  className={`flex items-center justify-between rounded-[6px] px-2.5 py-2 text-nav-m transition-colors hover:bg-grey-03 ${l === current ? "text-black" : "text-grey-01"}`}
                >
                  {NAMES[l]}
                  <span className="text-small uppercase">{l}</span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
