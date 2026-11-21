import Link from "next/link";
import { Ticker } from "../ui/Ticker";
import { LogoMark } from "./Logo";
import { BackToTop } from "./BackToTop";
import { getYear } from "@/lib/year";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

function MenuRow({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between gap-2.5 rounded-[10px] bg-grey-03 p-2 text-body text-black transition-colors duration-300 hover:text-grey-01"
    >
      {label}
      <span className="grid h-[18px] w-[34px] place-items-center rounded-full border border-[#222] text-[14px] leading-none text-black transition-[transform,background-color] duration-300 group-hover:rotate-90 group-hover:bg-white">+</span>
    </Link>
  );
}

export async function Footer({
  lang,
  dict,
  ticker,
  wordmark,
  socials,
}: {
  lang: Locale;
  dict: Dictionary;
  ticker: string[];
  wordmark: string;
  socials: { label: string; url: string }[];
}) {
  const year = await getYear();
  const pages = [
    { href: localePath(lang, "/"), label: dict.nav.home },
    { href: `${localePath(lang, "/") === "/" ? "" : localePath(lang, "/")}/#about`, label: dict.nav.about },
    { href: localePath(lang, "/projects"), label: dict.nav.projects },
    { href: localePath(lang, "/blog"), label: dict.nav.blog },
    { href: localePath(lang, "/contact"), label: dict.nav.contact },
  ];

  return (
    <footer className="flex flex-col gap-[5px] px-2.5 pb-2.5">
      {/* Framer Footer: black container (0/10/50 padding, r10); 76 two-pixel lines (280px, white 40% → black), ticker, wordmark, two link boxes */}
      <div className="relative overflow-hidden rounded-[10px] bg-black px-2.5 pb-[50px] text-white">
        <div aria-hidden className="flex h-[280px] justify-between">
          {Array.from({ length: 76 }, (_, i) => (
            <span key={i} className={`h-full w-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.4)_-33%,#000_88%)] ${i % 2 ? "max-tablet:hidden" : ""}`} />
          ))}
        </div>
        <div className="relative pt-[60px]">
          <div className="flex h-10 items-center rounded-[10px] bg-white text-body text-black">
            <Ticker duration={30} gap={10} className="w-full px-2.5">
              {(ticker.length ? ticker : ["DID90° Agency"]).map((t, i) => (
                <span key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                  {t}
                  <span className="h-6 w-[5px] rounded-[10px] bg-grey-02" aria-hidden />
                </span>
              ))}
            </Ticker>
          </div>

          <div className="px-2.5 py-[60px] tablet:py-[96px]">
            <LogoMark className="h-auto w-full" />
            <span className="sr-only">{wordmark}</span>
          </div>

          <div className="grid gap-2.5 tablet:grid-cols-2">
            <div className="flex flex-col gap-[5px] rounded-[10px] border-[0.1px] border-grey-03 bg-white p-2 text-black">
              {pages.map((p) => (
                <MenuRow key={p.href} {...p} />
              ))}
            </div>
            <div className="flex flex-col gap-[5px] rounded-[10px] bg-white p-2 text-black">
              {socials.map((s) => (
                <MenuRow key={s.url} href={s.url} label={s.label} external />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2.5 rounded-[10px] bg-black p-5 text-body text-white tablet:flex-row tablet:justify-between">
        <span>
          DID90° {year}. {dict.footer.rights}
        </span>
        <span className="text-grey-01">{dict.footer.credit}</span>
        <BackToTop label={dict.footer.backToTop} />
      </div>
    </footer>
  );
}
