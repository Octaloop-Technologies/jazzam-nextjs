import { NextRequest, NextResponse } from "next/server";

// ==============================================================
// Define protected routes that require authentication
// ==============================================================
const protectedRoutes = ["/super-user", "/profile", "/dashboard"];
// const protectedRoutes = ["/profile", "/dashboard"];

// ==============================================================
// Define auth routes that should not be accessible when logged in (will redirect to dashboard)
// ==============================================================
const authRoutes = ["/login"];

// ==============================================================
// Locale configuration
// ==============================================================
const supportedLocales = ["en", "ar"];
const defaultLocale = "en";

function getLocaleFromHeader(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [locale, q = "1"] = lang.trim().split(";q=");
      return {
        locale: locale.split("-")[0], // "en-US" -> "en"
        quality: parseFloat(q),
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported locale
  for (const lang of languages) {
    if (supportedLocales.includes(lang.locale)) {
      return lang.locale;
    }
  }

  return defaultLocale;
}

// ==============================================================
// Middleware function
// ==============================================================
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Check if user is authenticated (has valid tokens)
  const isAuthenticated = !!(accessToken && refreshToken);

  // ==============================================================
  // Handle OAuth callback redirects
  // ==============================================================
  const isOAuthCallback =
    path === "/super-user" && request.nextUrl.searchParams.get("login") === "success";

  if (isOAuthCallback) {
    // Check if we have the authentication cookies (they should be set by the backend)
    if (isAuthenticated) {
      // If we have auth cookies, redirect to clean URL to trigger proper SSR
      const cleanUrl = new URL("/super-user", request.url);
      const response = NextResponse.redirect(cleanUrl);

      // Set a flag to indicate this is a fresh login (for toast notification)
      response.cookies.set("freshLogin", "true", {
        path: "/",
        maxAge: 10, // Short-lived, just for the redirect
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // Handle locale detection for OAuth callback
      const langCookie = request.cookies.get("lang")?.value;
      if (!langCookie || !supportedLocales.includes(langCookie)) {
        const acceptLang = request.headers.get("accept-language");
        const detectedLocale = getLocaleFromHeader(acceptLang);

        response.cookies.set("lang", detectedLocale, {
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      return response;
    } else {
      // If no auth cookies yet, redirect to login with error
      return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
    }
  }

  // ==============================================================
  // Handle authentication redirects
  // ==============================================================
  if (isAuthenticated) {
    // If user is logged in and trying to access login page, redirect to dashboard
    if (authRoutes.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/super-user", request.url));
    }
  } else {
    // If user is not logged in and trying to access protected routes, redirect to login
    if (protectedRoutes.some((route) => path.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();

  // ==============================================================
  // Handle locale detection and cookie setting
  // ==============================================================
  const langCookie = request.cookies.get("lang")?.value;

  // If we don't have a valid language cookie, detect and set locale
  if (!langCookie || !supportedLocales.includes(langCookie)) {
    const acceptLang = request.headers.get("accept-language");
    const detectedLocale = getLocaleFromHeader(acceptLang);

    // Save locale in cookie
    response.cookies.set("lang", detectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  // ==============================================================
  // Add security headers in production
  // ==============================================================
  // if (process.env.NODE_ENV === "production") {
  //   response.headers.set("X-Frame-Options", "SAMEORIGIN");
  //   response.headers.set("X-Content-Type-Options", "nosniff");
  //   response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  //   // Basic CSP
  //   response.headers.set(
  //     "Content-Security-Policy",
  //     "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  //   );
  // }

  return response;
}

// ==============================================================
// Configure the middleware to run on specific paths
// ==============================================================
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (assets files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - robots.txt (robots file)
     * - sw.js (service worker)
     */
    "/((?!api|_next/static|_next/image|assets|favicon.ico|manifest.json|robots.txt|sw.js).*)",
  ],
};
