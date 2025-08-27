import { NextRequest, NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Define protected routes that require authentication
// const protectedRoutes = ["/profile"];
// // Define auth routes that should not be accessible when logged in
// const authRoutes = ["/signin", "/signup", "/verify-code", "/set-new-password", "password-recovery"];

// export function middleware(request: NextRequest) {
//   // Get the pathname from the request
//   const path = request.nextUrl.pathname;

//   // Get token from cookies instead of localStorage since middleware runs on the edge
//   const token = request.cookies.get("token")?.value;
//   const user = request.cookies.get("user")?.value;

//   // If user is logged in (has token and user data)
//   if (token && user) {
//     // Prevent access to auth pages when logged in
//     if (authRoutes.some((route) => path.startsWith(route))) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     // Allow access to all other pages
//     return NextResponse.next();
//   }

//   // If user is not logged in
//   if (!token || !user) {
//     // Prevent access to protected routes
//     if (protectedRoutes.some((route) => path.startsWith(route))) {
//       return NextResponse.redirect(new URL("/signin", request.url));
//     }
//     // Allow access to public routes
//     return NextResponse.next();
//   }

//   const response = NextResponse.next();

//   // ===============| Add basic security headers |==============
//   if (process.env.NODE_ENV === "production") {
//     // Set X-Frame-Options to prevent embedding in iframes
//     response.headers.set("X-Frame-Options", "SAMEORIGIN");

//     // Basic CSP that allows inline scripts but with nonce
//     response.headers.set(
//       "Content-Security-Policy",
//       "default-src 'self'; script-src 'self' 'unsafe-inline' 'nonce-console-blocker';"
//     );
//   }

//   return response;
// }

// // Configure the middleware to run on specific paths
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

export function middleware(request: NextRequest) {
  console.log("Middleware is running");

  // if (request.nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}
