import { NextRequest, NextResponse } from "next/server";

// ==============================================================
// Define protected routes that require authentication
// ==============================================================
const protectedRoutes = ["/super-user", "/profile", "/dashboard"];

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

// Helper function to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    // Decode JWT token payload (without verification)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Check if token has expired
    return payload.exp ? payload.exp < currentTime : false;
  } catch (error) {
    console.log("error***", error)
    // If token can't be decoded, consider it invalid/expired
    return true;
  }
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
  // Only consider authenticated if both tokens exist, are not empty, and are not expired
  const isAuthenticated = !!(
    accessToken &&
    refreshToken &&
    accessToken.trim() !== "" &&
    refreshToken.trim() !== "" &&
    !isTokenExpired(accessToken) &&
    !isTokenExpired(refreshToken)
  );

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

  const isLogoutScenario =
    (path.startsWith("/login") && (!accessToken || !refreshToken || !isAuthenticated)) ||
    request.nextUrl.searchParams.has("logout");

  // If we don't have a valid language cookie and it's not a logout scenario, detect and set locale
  if ((!langCookie || !supportedLocales.includes(langCookie)) && !isLogoutScenario) {
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
