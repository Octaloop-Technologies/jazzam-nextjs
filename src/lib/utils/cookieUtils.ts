/**
 * Client-side cookie and storage clearing utilities
 */

/**
 * Clear authentication cookies and storage on the client side
 */
export const clearClientCookies = () => {
  if (typeof document === "undefined") return;

  // Get the current domain to match cookie settings
  const currentDomain = window.location.hostname;
  const isProduction = process.env.NODE_ENV === "production";

  // Determine the domain for cookie clearing
  // In production, cookies are typically set with a domain like .jazzam.ai
  // In development, cookies are set with localhost
  let cookieDomain = "localhost";

  if (isProduction) {
    // For production, try to determine the cookie domain
    // If the domain is jazzam.ai, cookies are likely set with .jazzam.ai
    if (currentDomain === "jazzam.ai") {
      cookieDomain = ".jazzam.ai";
    } else if (currentDomain.includes(".")) {
      // For subdomains, use the parent domain
      const parts = currentDomain.split(".");
      if (parts.length > 2) {
        cookieDomain = `.${parts.slice(-2).join(".")}`;
      } else {
        cookieDomain = `.${currentDomain}`;
      }
    }
  }

  // Clear cookies with proper domain and attributes to match how they were set
  const cookieOptions = [
    "expires=Thu, 01 Jan 1970 00:00:00 UTC",
    "path=/",
    `domain=${cookieDomain}`,
    isProduction ? "secure" : "",
    isProduction ? "samesite=strict" : "samesite=lax",
  ]
    .filter(Boolean)
    .join("; ");

  // Clear all authentication and user preference cookies with proper options
  document.cookie = `accessToken=; ${cookieOptions}`;
  document.cookie = `refreshToken=; ${cookieOptions}`;
  document.cookie = `lang=; ${cookieOptions}`;

  // Also try clearing without domain (fallback for edge cases)
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Try clearing with just the current domain (another fallback)
  if (isProduction && currentDomain !== cookieDomain) {
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${currentDomain};`;
    document.cookie = `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${currentDomain};`;
    document.cookie = `lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${currentDomain};`;
  }

  // Clear session storage if used
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.clear();
  }

  // Clear any service worker caches to prevent cached responses
  if (typeof window !== "undefined" && "serviceWorker" in navigator && "caches" in window) {
    caches
      .keys()
      .then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to clear service worker caches:", error);
        }
      });
  }
};

/**
 * Check if JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode JWT token payload (without verification)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Check if token has expired
    return payload.exp ? payload.exp < currentTime : false;
  } catch (error) {
    // If token can't be decoded, consider it invalid/expired
    return true;
  }
};
