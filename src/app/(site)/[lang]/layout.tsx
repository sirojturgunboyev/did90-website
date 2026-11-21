import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import { hasLocale, locales, localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSettings } from "@/lib/queries";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Loader } from "@/components/layout/Loader";

import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const s = await getSettings(lang);
  const title = s?.title || "DID90° Agency";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${title}` },
    description: s?.description,
    alternates: {
      canonical: localePath(lang, "/"),
      languages: Object.fromEntries(locales.map((l) => [l, localePath(l, "/")])),
    },
    openGraph: { siteName: title, locale: lang, type: "website" },
    // Light browser theme → dark mark, dark theme → white mark.
    icons: {
      icon: [
        { url: "/favicon/light.png", type: "image/png", sizes: "64x64", media: "(prefers-color-scheme: light)" },
        { url: "/favicon/dark.png", type: "image/png", sizes: "64x64", media: "(prefers-color-scheme: dark)" },
      ],
      apple: "/favicon/light.png",
    },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const [dict, settings] = await Promise.all([getDictionary(locale), getSettings(locale)]);

  return (
    <html lang={locale} className={GeistSans.variable}>
      <body>
        <Loader />
        <SmoothScroll />
        <Navbar lang={locale} dict={dict.nav} ticker={settings?.navTicker ?? []} />
        <main className="mx-auto flex w-full max-w-[1560px] flex-col gap-2.5 px-2.5 tablet:px-5">{children}</main>
        <Footer
          lang={locale}
          dict={dict}
          ticker={settings?.footerTicker ?? []}
          wordmark={settings?.wordmark || "DID90°"}
          socials={settings?.socials ?? []}
        />
      </body>
    </html>
  );
}
