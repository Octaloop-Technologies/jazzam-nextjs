"use client";

import { useAppDispatch } from "@/redux/store";
import {
  addToast,
  addSuccessToast,
  addErrorToast,
  addInfoToast,
  addWarningToast,
  removeToast,
  clearAllToasts,
} from "@/redux/slices/toastSlice";

export const useToast = () => {
  const dispatch = useAppDispatch();

  return {
    // ==============================================================
    // Toast Actions
    // ==============================================================
    addToast: (toast: {
      message: string;
      type: "success" | "error" | "info" | "warning";
      duration?: number;
    }) => {
      dispatch(addToast(toast));
    },

    // ==============================================================
    // Convenience methods for different toast types
    // ==============================================================
    success: (message: string) => {
      dispatch(addSuccessToast(message));
    },

    error: (message: string) => {
      dispatch(addErrorToast(message));
    },

    info: (message: string) => {
      dispatch(addInfoToast(message));
    },

    warning: (message: string) => {
      dispatch(addWarningToast(message));
    },

    // ==============================================================
    // Toast Management Actions
    // ==============================================================
    remove: (id: string) => {
      dispatch(removeToast(id));
    },

    // ==============================================================
    // Clear All Toasts
    // ==============================================================
    clearAll: () => {
      dispatch(clearAllToasts());
    },
  };
};
