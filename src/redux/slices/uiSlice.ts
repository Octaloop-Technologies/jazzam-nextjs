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
  isModalOpen: boolean; // 👈 new field for modal
}

// Initial state
const initialState: UIState = {
  theme: getInitialTheme(),
  isModalOpen: false, // 👈 modal initially closed
};

// Create the UI slice
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // --- THEME HANDLING ---
    setTheme: (state, action: PayloadAction<"light" | "dark" | "auto">) => {
      state.theme = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }

      if (action.payload !== "auto") {
        document.documentElement.dataset.theme = action.payload;
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
      }
    },

    // --- MODAL HANDLING ---
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
  },
});

// Function to initialize theme
export const initializeTheme = () => {
  const theme = getInitialTheme();

  if (theme !== "auto") {
    document.documentElement.dataset.theme = theme;
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = prefersDark ? "dark" : "light";

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (getInitialTheme() === "auto") {
        document.documentElement.dataset.theme = e.matches ? "dark" : "light";
      }
    });
  }
};

// Export actions
export const { setTheme, openModal, closeModal, toggleModal } = uiSlice.actions;

// Export selectors
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectIsModalOpen = (state: RootState) => state.ui.isModalOpen; // 👈 selector

export default uiSlice.reducer;
