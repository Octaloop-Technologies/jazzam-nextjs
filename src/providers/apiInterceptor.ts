/**
 * Global API Interceptor
 * Handles 401 errors and token expiry globally
 */

import { logoutUserAction } from "@/app/super-user/settings/action";

const logoutUser = async (): Promise<void> => {
  if (typeof window === "undefined") return;
  await logoutUserAction();
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
      // Call backend logout API and redirect
      logoutUser();
    }

    return response;
  }

  // For other URLs, use original fetch
  return originalFetch(input, init);
};
