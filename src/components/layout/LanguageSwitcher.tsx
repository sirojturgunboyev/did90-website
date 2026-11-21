"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

/** Builds the same page URL in another language (uz has no prefix). */
function swap(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  const hasPrefix = (locales as readonly string[]).includes(parts[1]);
  const rest = hasPrefix ? "/" + parts.slice(2).join("/") : pathname;
  const clean = rest === "/" ? "" : rest.replace(/\/$/, "");
  return to === defaultLocale ? clean || "/" : `/${to}${clean}`;
}

export function LanguageSwitcher({ current, className = "" }: { current: Locale; className?: string }) {
  const pathname = usePathname() || "/";
  return (
    <div className={`flex items-center gap-1 text-nav-s ${className}`}>
      {locales.map((l) => (
        <Link
          key={l}
          href={swap(pathname, l)}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className={`rounded-[6px] px-1.5 py-1 uppercase transition-colors ${l === current ? "bg-white text-black" : "text-grey-01 hover:text-black"}`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
