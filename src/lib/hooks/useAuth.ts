"use client";

import { useState, useEffect, useCallback } from "react";

interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTokens = useCallback((): Tokens | null => {
    if (typeof window === "undefined") return null;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    return { accessToken, refreshToken };
  }, []);

  const setTokens = useCallback((accessToken: string, refreshToken: string): void => {
    if (typeof window === "undefined") return;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  }, []);

  const clearTokens = useCallback((): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  }, []);

  const isTokenExpired = useCallback((token: string | null): boolean => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp ? payload.exp < currentTime : false;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }, []);

  const checkAuth = useCallback((): boolean => {
    const tokens = getTokens();
    if (!tokens) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    const { accessToken, refreshToken } = tokens;

    const authenticated =
      !!accessToken &&
      !!refreshToken &&
      accessToken.trim() !== "" &&
      refreshToken.trim() !== "" &&
      !isTokenExpired(accessToken) &&
      !isTokenExpired(refreshToken);

    setIsAuthenticated(authenticated);
    setIsLoading(false);

    return authenticated;
  }, [getTokens, isTokenExpired]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    getTokens,
    setTokens,
    clearTokens,
    checkAuth,
    isTokenExpired,
  };
};
