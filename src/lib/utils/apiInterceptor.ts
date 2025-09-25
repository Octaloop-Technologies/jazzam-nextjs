/**
 * Global API Interceptor
 * Handles 401 errors and token expiry globally
 */

interface Window {
  dispatchAuthLogout: () => void;
}

const clearAuthCookies = (): void => {
  if (typeof document === "undefined") return;

  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
      clearAuthCookies();

      // Dispatch logout action if we're in a Redux context
      if (typeof window !== "undefined" && (window as Window).dispatchAuthLogout) {
        (window as Window).dispatchAuthLogout();
      }

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return response;
  }

  // For other URLs, use original fetch
  return originalFetch(input, init);
};
