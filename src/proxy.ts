import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // /uz/... → / (default locale has no prefix)
  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if ((locales as readonly string[]).includes(first)) return NextResponse.next();

  // Anything else is served from the default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
