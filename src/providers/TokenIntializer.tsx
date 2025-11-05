"use client";

import { useEffect } from "react";

export default function TokenInitializer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");
    const refreshToken = url.searchParams.get("refreshToken");

    // If tokens are present in the URL, persist them and clean the URL
    if (accessToken && refreshToken) {
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Remove tokens from the address bar
        url.searchParams.delete("accessToken");
        url.searchParams.delete("refreshToken");
        window.history.replaceState({}, document.title, url.toString());
      } catch (err) {
        console.error("TokenInitializer: failed to persist tokens", err);
      }
    }
  }, []);

  return null;
}