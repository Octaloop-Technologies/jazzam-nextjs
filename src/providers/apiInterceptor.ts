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

  // Redirect to logout page for server-side handling
  window.location.href = "/logout";
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
