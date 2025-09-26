/**
 * Global API Interceptor
 * Handles 401 errors and token expiry globally
 */

import { logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";

const logoutUser = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  // Clear Redux state
  store.dispatch(logout());

  // Read token before clearing cookies
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  // Attempt backend logout to remove refresh token from DB and clear httpOnly cookies
  try {
    if (token) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/auth/logout`, {
        method: "POST",
        credentials: "include", // Important: include cookies for backend to clear them
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Backend successfully cleared cookies, redirect to login
        window.location.href = "/login";
        return;
      }
    }
  } catch (e) {
    // Ignore errors; proceed to fallback cleanup
  }

  // Fallback: if backend logout fails, try client-side clearing for non-httpOnly cookies
  const clearCookie = (name: string) => {
    const isProduction = process.env.NODE_ENV === "production";
    const domain = isProduction ? "jazzam.ai" : "localhost";
    const secure = isProduction ? "; secure" : "";
    const sameSite = isProduction ? "; samesite=strict" : "; samesite=lax";
    const domainAttr = domain ? `; domain=${domain}` : "";

    // Try clearing with exact domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${secure}${sameSite}${domainAttr}`;

    // Try clearing with subdomain domain
    if (isProduction) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${secure}${sameSite}; domain=.jazzam.ai`;
    }
  };

  // Clear both auth cookies
  clearCookie("accessToken");
  clearCookie("refreshToken");

  window.location.href = "/login";
};

// Store original fetch
const originalFetch = global.fetch;

// Override global fetch
global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Only intercept API calls to our backend
  const url = typeof input === "string" ? input : input.toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (url.includes(baseUrl || "") || url.startsWith("/api/")) {
    const response = await originalFetch(input, init);

    // If 401, handle token expiry
    if (response.status === 401) {
      logoutUser();
    }

    return response;
  }

  // For other URLs, use original fetch
  return originalFetch(input, init);
};
