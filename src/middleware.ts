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
  // Add security headers in production
  // ==============================================================
  if (process.env.NODE_ENV === "production") {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Basic CSP
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    );
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
