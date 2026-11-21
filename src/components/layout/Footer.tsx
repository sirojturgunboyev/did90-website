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
      className="group flex items-center justify-between rounded-[6px] bg-grey-03 px-3 py-2 text-body-l transition-colors hover:bg-light-grey"
    >
      {label}
      <span className="grid h-[18px] w-[34px] place-items-center rounded-full border border-black text-[14px] leading-none transition-transform group-hover:rotate-90">+</span>
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
    <footer className="px-2.5 pb-2.5">
      <div className="relative overflow-hidden rounded-[10px] bg-black px-2.5 pb-2.5 text-white">
        {/* vertical lines fading in from top */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[300px] [background:repeating-linear-gradient(90deg,#2a2a2a_0_2px,transparent_2px_10px)] [mask-image:linear-gradient(#000,transparent)]"
        />
        <div className="relative pt-[260px] tablet:pt-[340px]">
          <div className="rounded-[8px] bg-white py-2.5 text-body-l text-black">
            <Ticker duration={30} gap={12}>
              {(ticker.length ? ticker : ["DID90° Agency"]).map((t, i) => (
                <span key={i} className="flex items-center gap-3 whitespace-nowrap">
                  {t}
                  <span className="h-6 w-[5px] rounded-full bg-grey-02" aria-hidden />
                </span>
              ))}
            </Ticker>
          </div>

          <div className="px-2 py-10 tablet:px-6 tablet:py-16">
            <LogoMark className="h-auto w-full" />
            <span className="sr-only">{wordmark}</span>
          </div>

          <div className="grid gap-2.5 tablet:grid-cols-2">
            <div className="flex flex-col gap-1.5 rounded-[8px] bg-white p-2 text-black">
              {pages.map((p) => (
                <MenuRow key={p.href} {...p} />
              ))}
            </div>
            <div className="flex flex-col gap-1.5 rounded-[8px] bg-white p-2 text-black">
              {socials.map((s) => (
                <MenuRow key={s.url} href={s.url} label={s.label} external />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex flex-col items-center gap-2 rounded-[10px] bg-black px-5 py-4 text-body-l text-white tablet:flex-row tablet:justify-between">
        <span>
          DID90° {year}. {dict.footer.rights}
        </span>
        <span className="text-grey-01">{dict.footer.credit}</span>
        <BackToTop label={dict.footer.backToTop} />
      </div>
    </footer>
  );
}
