export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";
export const hasLocale = (l: string): l is Locale => (locales as readonly string[]).includes(l);

/** Path for a locale: uz has no prefix. */
export const localePath = (locale: Locale, path = "/") => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
};

/** Pick a localized value with fallback uz → en → ru. */
export function t(value: Partial<Record<Locale, string>> | null | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] || value.uz || value.en || value.ru || "";
}
