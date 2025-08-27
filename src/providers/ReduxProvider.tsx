"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { initializeTheme } from "@/redux/slices/uiSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // =============| Initialize Theme |=============
  useEffect(() => {
    // Initialize theme based on localStorage and system preference
    initializeTheme();

    // Add listener for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // This will update the theme if auto mode is selected
      if (localStorage.getItem("theme") === "auto") {
        document.documentElement.dataset.theme = e.matches ? "dark" : "light";
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // =============| Provider |=============
  return <Provider store={store}>{children}</Provider>;
}
