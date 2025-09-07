import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

// Toast interface matching your existing types
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

// Toast state interface
interface ToastState {
  toasts: Toast[];
}

// Initial state
const initialState: ToastState = {
  toasts: [],
};

// Create the toast slice
const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newToast: Toast = {
        id,
        duration: 3000, // Default duration
        ...action.payload,
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    // Convenience actions for different toast types
    addSuccessToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newToast: Toast = {
        id,
        message: action.payload,
        type: "success",
        duration: 3000,
      };
      state.toasts.push(newToast);
    },
    addErrorToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newToast: Toast = {
        id,
        message: action.payload,
        type: "error",
        duration: 5000, // Errors stay longer
      };
      state.toasts.push(newToast);
    },
    addInfoToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newToast: Toast = {
        id,
        message: action.payload,
        type: "info",
        duration: 3000,
      };
      state.toasts.push(newToast);
    },
    addWarningToast: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString() + Math.random().toString(36);
      const newToast: Toast = {
        id,
        message: action.payload,
        type: "warning",
        duration: 4000,
      };
      state.toasts.push(newToast);
    },
  },
});

// Export actions
export const {
  addToast,
  removeToast,
  clearAllToasts,
  addSuccessToast,
  addErrorToast,
  addInfoToast,
  addWarningToast,
} = toastSlice.actions;

// Export selectors
export const selectToasts = (state: RootState) => state.toast.toasts;

export default toastSlice.reducer;
