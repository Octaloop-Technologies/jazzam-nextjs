/**
 * Global API Interceptor
 * Handles 401 errors and token expiry globally
 */

import { logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { logoutUserAction } from "@/app/super-user/settings/action";

let isLoggingOut = false;

const hasToken = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

const isAuthPage = (): boolean => {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname;
  return p.startsWith("/login") || p.startsWith("/auth") || p.startsWith("/register");
};

const isSafeAuthCheck = (url: string): boolean => {
  // Endpoints that may legitimately return 401 during normal flow
  return url.includes("/companies/auth/current-company");
};

const isLogoutEndpoint = (url: string): boolean => {
  return url.includes("/companies/auth/logout");
};

const logoutUser = async (): Promise<void> => {
  if (typeof window === "undefined") return;
  if (isLoggingOut) return; // prevent multiple concurrent logouts
  isLoggingOut = true;

  try {
    // Clear Redux state first for immediate UI feedback
    store.dispatch(logout());

    // Call server logout action (best-effort)
    await logoutUserAction();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut = false;
  }
};

// Store original fetch
const originalFetch = global.fetch;

// Override global fetch
global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Only intercept API calls to our backend
  const url = typeof input === "string" ? input : input.toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (url.includes(baseUrl || "") || url.startsWith("/api/")) {
    // Skip authentication check for public form endpoints
    if (url.includes("/forms/") && !url.includes("/forms/platform")) {
      // This is a public form endpoint, skip authentication
      return originalFetch(input, init);
    }

    const response = await originalFetch(input, init);

    // If 401, handle token expiry carefully
    if (response.status === 401) {
      // 1) Don't loop on logout endpoint itself
      if (isLogoutEndpoint(url)) {
        return response;
      }

      // 2) Ignore 401s when we're on an auth page (login/callback/register)
      if (isAuthPage()) {
        return response;
      }

      // 3) If no token in storage, it's an unauthenticated user; don't call logout
      if (!hasToken()) {
        return response;
      }

      // 4) Ignore harmless auth checks to avoid noisy loops
      if (isSafeAuthCheck(url)) {
        return response;
      }

      // 5) Otherwise perform a single logout
      logoutUser();
    }

    return response;
  }

  // For other URLs, use original fetch
  return originalFetch(input, init);
};