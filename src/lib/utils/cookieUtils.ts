/**
 * Client-side cookie and storage clearing utilities
 */

/**
 * Clear authentication cookies and storage on the client side
 */
export const clearClientCookies = () => {
  if (typeof document === "undefined") return;

  console.log("Clearing client-side cookies...");

  // Get the current domain and environment
  const currentDomain = window.location.hostname;
  const isProduction = process.env.NODE_ENV === "production";

  console.log("Current domain:", currentDomain, "Production:", isProduction);

  // Create multiple clearing attempts with different domain configurations
  const clearAttempts = [
    // Attempt 1: No domain (most common for localhost)
    {
      domain: "",
      options: [
        "expires=Thu, 01 Jan 1970 00:00:00 UTC",
        "path=/",
        isProduction ? "secure" : "",
        isProduction ? "samesite=strict" : "samesite=lax",
      ]
        .filter(Boolean)
        .join("; "),
    },
    // Attempt 2: With current domain
    {
      domain: currentDomain,
      options: [
        "expires=Thu, 01 Jan 1970 00:00:00 UTC",
        "path=/",
        `domain=${currentDomain}`,
        isProduction ? "secure" : "",
        isProduction ? "samesite=strict" : "samesite=lax",
      ]
        .filter(Boolean)
        .join("; "),
    },
    // Attempt 3: With localhost (for development)
    {
      domain: "localhost",
      options: [
        "expires=Thu, 01 Jan 1970 00:00:00 UTC",
        "path=/",
        "domain=localhost",
        isProduction ? "secure" : "",
        isProduction ? "samesite=strict" : "samesite=lax",
      ]
        .filter(Boolean)
        .join("; "),
    },
  ];

  // Add production domain attempts if in production
  if (isProduction) {
    // Attempt 4: With parent domain (e.g., .jazzam.ai)
    if (currentDomain.includes(".")) {
      const parts = currentDomain.split(".");
      if (parts.length >= 2) {
        const parentDomain = `.${parts.slice(-2).join(".")}`;
        clearAttempts.push({
          domain: parentDomain,
          options: [
            "expires=Thu, 01 Jan 1970 00:00:00 UTC",
            "path=/",
            `domain=${parentDomain}`,
            "secure",
            "samesite=strict",
          ].join("; "),
        });
      }
    }
  }

  // Try to clear cookies with all different domain configurations
  const cookiesToClear = ["accessToken", "refreshToken", "lang"];

  cookiesToClear.forEach((cookieName) => {
    clearAttempts.forEach((attempt, index) => {
      const cookieString = `${cookieName}=; ${attempt.options}`;
      document.cookie = cookieString;
      console.log(`Attempt ${index + 1} for ${cookieName}:`, cookieString);
    });
  });

  // Also try the old method as fallback
  cookiesToClear.forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${currentDomain};`;
    if (currentDomain !== "localhost") {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
    }
  });

  // Clear session storage
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.clear();
    console.log("Session storage cleared");
  }

  // Clear localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
    console.log("Local storage cleared");
  }

  // Clear any service worker caches
  if (typeof window !== "undefined" && "serviceWorker" in navigator && "caches" in window) {
    caches
      .keys()
      .then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
        console.log("Service worker caches cleared");
      })
      .catch((error) => {
        console.warn("Failed to clear service worker caches:", error);
      });
  }

  // Log current cookies after clearing attempt
  setTimeout(() => {
    console.log("Cookies after clearing attempt:", document.cookie);
  }, 100);
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
