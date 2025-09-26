/**
 * Client-side cookie and storage clearing utilities
 */

/**
 * Clear authentication cookies and storage on the client side
 */
export const clearClientCookies = () => {
  if (typeof document === "undefined") return;

  // Clear cookies by setting them to expire immediately
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear local storage if used
  if (typeof localStorage !== "undefined") {
    localStorage.clear();
  }

  // Clear session storage if used
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.clear();
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
