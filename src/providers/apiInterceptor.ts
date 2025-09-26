/**
 * Global API Interceptor
 * Handles 401 errors and token expiry globally
 */

import { logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { logoutUserAction } from "@/app/super-user/settings/action";
import { clearClientCookies, isTokenExpired } from "@/lib/utils/cookieUtils";

const logoutUser = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    // Clear Redux state first for immediate UI feedback
    store.dispatch(logout());

    // Clear client-side cookies and storage
    clearClientCookies();

    // Call server logout action
    await logoutUserAction();

    // Navigate to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
    // Even if server logout fails, clear local state and redirect
    window.location.href = "/login";
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
    // Check if we have tokens and they're not expired before making the request
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (accessToken && isTokenExpired(accessToken)) {
      // Token is expired, logout immediately
      logoutUser();
      // Return a 401 response to prevent the actual API call
      return new Response(JSON.stringify({ message: "Token expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

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
