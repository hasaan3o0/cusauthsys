import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

const locales = ["en", "es"];
const publicPages = ["/", "/login", "/register"];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

export default async function middleware(request: NextRequest) {
  const publicPatterns = publicPages.map(
    (page) => new RegExp(`^/(${locales.join("|")})${page}$`)
  );

  if (
    publicPatterns.some((pattern) => pattern.test(request.nextUrl.pathname))
  ) {
    return intlMiddleware(request);
  }

  const verifiedToken = await verifyAuth(request);
  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/en/login", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
