import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

// Get initial theme from localStorage or default to 'auto'
const getInitialTheme = (): "light" | "dark" | "auto" => {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("theme") as "light" | "dark" | "auto") || "dark";
};

// UI state interface
interface UIState {
  theme: "light" | "dark" | "auto";
}

// Initial state
const initialState: UIState = {
  theme: getInitialTheme(),
};

// Create the UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "auto">) => {
      state.theme = action.payload;

      // Persist theme to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }

      // Update data-theme attribute
      if (action.payload !== "auto") {
        document.documentElement.dataset.theme = action.payload;
      } else {
        // For auto mode, check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
      }
    },
  },
});

// Function to initialize theme
export const initializeTheme = () => {
  const theme = getInitialTheme();

  if (theme !== "auto") {
    document.documentElement.dataset.theme = theme;
  } else {
    // For auto mode, check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = prefersDark ? "dark" : "light";

    // Add listener for system preference changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (getInitialTheme() === "auto") {
        document.documentElement.dataset.theme = e.matches ? "dark" : "light";
      }
    });
  }
};

// Export actions
export const { setTheme } = uiSlice.actions;

// Export selectors
export const selectTheme = (state: RootState) => state?.ui?.theme;

export default uiSlice.reducer;
