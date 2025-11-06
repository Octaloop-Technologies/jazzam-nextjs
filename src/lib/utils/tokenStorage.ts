// ==============================================================
// Client-side token management utility
// ==============================================================

"use client"

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
}

const tokenStorage = {
  // Store tokens in localStorage
  setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      console.log("Tokens stored successfully");
    } catch (error) {
      console.error("Error storing tokens:", error);
    }
  },

  // Get tokens from localStorage
  getTokens(): TokenData {
    if (typeof window === 'undefined') {
      return { accessToken: null, refreshToken: null };
    }

    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      
      // Only log in development or when debugging
      if (process.env.NODE_ENV === 'development') {
        console.log("TokenStorage.getTokens() - Access token exists:", !!accessToken, "Length:", accessToken?.length);
        console.log("TokenStorage.getTokens() - Refresh token exists:", !!refreshToken, "Length:", refreshToken?.length);
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error getting tokens from localStorage:", error);
      return { accessToken: null, refreshToken: null };
    }
  },

  // Remove tokens from localStorage
  clearTokens(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      console.log("Tokens cleared successfully");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  // Check if user is authenticated (has valid tokens)
  isAuthenticated(): boolean {
    try {
      const { accessToken, refreshToken } = this.getTokens();
      return !!(accessToken && refreshToken && !this.isTokenExpired(accessToken));
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  },

  // Check if token is expired
  isTokenExpired(token: string): boolean {
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
  },

  // Get user data from token
  getUserFromToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }
};

export default tokenStorage;